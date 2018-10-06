import axios from 'axios';

import * as types from '../constants/';
import apiRequest from '../helpers/apiRequest';

// const keys = ['552b35929960e09d08b168e5690cc6eae85570f980931c64266790bea3e2a6f1',
//   'sJJOy5oexUjd0SbguJatJWBo6VOHICzTqnJfH9poWBWToIJdax9occ6ej3CcfUIs',
//   '92da6c1f72c1ebca456a86d978af1dfc7db1bcb24d658d710c5c8ae25d98ba52'];
const keys = ['fb5f95f84fa11b73e0ebfa0969de65176902c1b7337652d43537a66a09d7028d'];

export const init = () => dispatch => {
  dispatch({
    type: '',
    payload: ''
  })
}

export const openModal = (modalName, pending) => dispatch => {
  // console.log(pending)
  dispatch({
    type: types.OPEN_MODAL,
    payload: { name: modalName, pending: pending }
  })
}

export const closeModal = () => dispatch => {
  dispatch({
    type: types.CLOSE_MODAL
  })
}

export const setModalHeader = (title, subTitle) => dispatch => {
  dispatch({
    type: types.SET_MODAL_HEADER,
    payload: { title: title, subTitle: subTitle }
  })
}

export const setLibrary = (id) => dispatch => {
  dispatch({
    type: types.SET_LIBRARY,
    payload: id
  })
}

export const getCategoryByFilters = (filters) => (dispatch, getState) => {
  const state = getState();
  const libraries = state.libraries;
  for (let lib in libraries) {
    for (let cat in libraries[lib]) {
      for (let sub in libraries[lib][cat]) {
        for (let subcat in libraries[lib][cat][sub].categories) {
          const fil = libraries[lib][cat][sub].categories[subcat].filters.split(',');
          for (let f in fil) {
            for (let curF in filters) {
              if (parseInt(filters[curF]) === parseInt(fil[f])) {
                // console.log({ catName: libraries[lib][cat][sub].name, id: libraries[lib][cat][sub].categories[subcat].id, filters: fil, subCatName: libraries[lib][cat][sub].categories[subcat].name })
                return {
                  id: libraries[lib][cat][sub].categories[subcat].id,
                  catName: libraries[lib][cat][sub].name,
                  subCatName: libraries[lib][cat][sub].categories[subcat].name,
                  filters: fil
                }
              }
            }
          }
        }
      }
    }
  }
}

export const getLibraries = () => (dispatch) => {
  dispatch({
    type: types.FETCHING_LIBRARY
  })
  apiRequest('init/', keys, {}).then(response => {
    let counter = 0;
    let allItems = response.data.libraries.length;
    for (let i in response.data.libraries) {
      getFile(response.data.libraries[i]).then(response => {
        if (isNeededCategory(response.data)) {
          // console.log(response)
          dispatch({
            type: types.ADD_LIBRARY,
            payload: { id: response.data.id, categories: response.data.categories }
          })
        }
        counter++;
        if (counter === allItems) {
          dispatch({
            type: types.FETCHING_LIBRARY_END
          })
        }
      })
    }

    let filterCounter = 0;
    let filtersTotal = response.data.filters.length;
    let allFilters = {};
    let allGroups = {};
    for (let i in response.data.filters) {
      getFile(response.data.filters[i]).then(response => {
        filterCounter++;
        const parseData = parseFilters(response.data);
        allFilters = { ...allFilters, ...parseData.filters };
        allGroups = { ...allGroups, ...parseData.groups };
        if (filterCounter === filtersTotal) {
          dispatch({
            type: types.SET_ALL_FILTERS,
            payload: { allFilters: allFilters, allGroups: allGroups }
          })
        }
      })
    }

    function parseFilters(filters) {
      let outFilters = {};
      let outGroups = {};
      for (let i in filters.groups) {
        for (let k in filters.items) {
          if (filters.items[k].groupsId === filters.groups[i].id) {
            if (typeof outFilters[filters.items[k].id] === 'undefined') {
              outFilters[filters.items[k].id] = {}
            }
            outFilters[filters.items[k].id] = filters.items[k];
            outFilters[filters.items[k].id].groupName = filters.groups[i].name;
            if (typeof outGroups[filters.groups[i].id] === 'undefined') {
              outGroups[filters.groups[i].id] = {};
            }
            outGroups[filters.groups[i].id] = filters.groups[i];
            if (typeof outGroups[filters.groups[i].id].filters === 'undefined') {
              outGroups[filters.groups[i].id].filters = {};
            }
            outGroups[filters.groups[i].id].filters[filters.items[k].id] = filters.items[k];
          }
        }
      }
      return { filters: outFilters, groups: outGroups }
    }


  })
}

export const clearLots = () => ({
  type: types.CLEAR_LOTS
})

export const clearFilters = () => ({
  type: types.CLEAR_FILTERS
})

export const needToUpdateFilters = (bool) => ({
  type: types.NEED_TO_UPDATE_FILTERS,
  payload: bool
})

export const getLots = (category, filters, page, setFilters, more) => (dispatch, getState) => {

  dispatch({
    type: types.FETCHING_LOTS
  })
  const state = getState();
  page = page || state.pages.current || 0;
  // const activeLot = state.activeLot;
  const perPage = state.pages.perPage;
  const lotFilters = state.lotFilters || [];
  const oldLots = state.lots;
  const category = category || state.category;

  let f = filters || state.filters;
  f = removeEmpty(f);

  const priceOrder = parseInt(state.priceOrder);
  let order = {};

  if (priceOrder === 0) {
    order = {
      order_field: 'price',
      order_dir: 'asc'
    };
  } else if (priceOrder === 1) {
    order = {
      order_field: 'price',
      order_dir: 'desc'
    };
  }

  const params = {
    count: perPage,
    offset: perPage * (page),
    filters: removeEmpty(lotFilters),
    ...order
  }

  if (!category) {
    params.category_filters = removeEmpty(f);
  } else {
    params.categories = [category];
  }

  function tryGetLots(attempt) {
    if (!attempt) attempt = 0;
    if (attempt === 3) {
      dispatch({
        type: types.FETCHING_LOTS_END
      })
      console.error('Ошибка соединения');
      return
    }

    let updateFilters = (typeof state.needToUpdateFilters === 'boolean') ? state.needToUpdateFilters : filters;
    dispatch(needToUpdateFilters(null));

    if (typeof params.category_filters !== 'undefined' && params.category_filters.length === 0 || 
        typeof params.categories !== 'undefined' && params.categories.length === 0) {
      dispatch({
        type: types.FETCHING_LOTS_END
      })
      return false;
    }

    apiRequest('api/v2.1/search?', keys, params).then(response => {
      const avaibleFilters = getAvaibleFilters(response.data.filters, state);
      let allAvaibleFilters = updateFilters ? avaibleFilters : state.allAvaibleFilters;
      if (state.oldFilters) {
        allAvaibleFilters = state.oldFilters;
      }
      let pageCount = Math.ceil(response.data.total / state.pages.perPage);
      if (pageCount === 1) {
        pageCount = 0;
      }
      // console.log(oldLots)
      let lots;
      if (!more) {
        lots = response.data.items;
      } else if (more > 0) {
        lots = [...oldLots, ...response.data.items]
      } else if (more < 0) {
        lots = [...response.data.items, ...oldLots]
      }
      dispatch({
        type: types.SET_LOTS,
        payload: {
          lots: lots,
          total: response.data.total,
          avaibleFilters: avaibleFilters,
          allAvaibleFilters: allAvaibleFilters,
          oldFilters: false,
          pages: {
            count: pageCount
          }
        }
      })
      dispatch({
        type: types.FETCHING_LOTS_END
      })
    }, error => {
      console.log(error);
      setTimeout(() => tryGetLots(++attempt), attempt * 1000);
    })
  }

  tryGetLots();

  function removeEmpty(filters) {
    for (let i in filters) {
      if (!filters[i] || typeof filters[i] === 'undefined' || filters[i] === 'false') {
        filters.splice(i, 1);
      }
    }
    return filters
  }
}

export const setLotFilters = (filters) => (dispatch, getState) => {
  const state = getState()
  const lotFilters = state.lotFilters || []

  const newFilters = [...lotFilters, ...filters]
  dispatch({
    type: types.SET_LOT_FILTERS,
    payload: newFilters
  })
}

export const clearLotFilters = () => ({
  type: types.CLEAR_LOT_FILTERS
})

export const removeLotFilters = (filters) => (dispatch, getState) => {
  const state = getState();
  const lotFilters = state.lotFilters || [];
  const newFilters = lotFilters.filter(el =>
    filters.indexOf(el) === -1
  )
  dispatch({
    type: types.REMOVE_LOT_FILTERS,
    payload: newFilters
  })
}

export const setFilters = (filters, onlyOne) => dispatch => {
  dispatch({
    type: types.SET_FILTERS,
    payload: { filters: filters, onlyOne: onlyOne }
  })
}

export const setPriceFilter = (order) => (
  {
    type: types.SET_PRICE_ORDER,
    payload: order
  }
)

export const setPreviousPage = (id) => dispatch => {
  dispatch({
    type: types.SET_PREVIOUS_PAGE,
    payload: id
  })
}

export const setModalPage = (page) => (
  {
    type: types.SET_MODAL_PAGE,
    payload: page
  }
)

export const setCatalogPage = (page) => (
  {
    type: types.SET_CATALOG_PAGE,
    payload: page
  }
)

export const setCategory = (categoryId) => (
  {
    type: types.SET_CATEGORY,
    payload: categoryId
  }
)

export const setActiveLot = (lot) => (
  {
    type: types.SET_ACTIVE_LOT,
    payload: lot
  }
)

export const clearActiveLot = () => (
  {
    type: types.CLEAR_ACTIVE_LOT
  }
)

export const setOldAvaibleFilters = (filters) => (
  {
    type: types.SET_OLD_AVAIBLE_FILTERS,
    payload: filters
  }
)

export const setFilterValue = (values) => (
  {
    type: types.SET_FILTER_VALUE,
    payload: values
  }
)

export const setSelectedFilters = (filters) => (
  {
    type: types.SET_SELECTED_FILTERS,
    payload: filters
  }
)

export const clearSelectedFilters = (filterId) => (dispatch, getState) => {
  const state = getState();
  const selectedFilters = state.selectedFilters;
  delete selectedFilters[filterId];

  dispatch({
    type: types.CLEAR_SELECTED_FILTERS,
    payload: selectedFilters
  })
}

export const setLastModifedFilter = (id) => (
  {
    type: types.SET_LAST_MODIFED_FILTER,
    payload: id
  }
)

const getFile = (file) => {
  return axios.get(file)
}

const isNeededCategory = (library) => {
  if (library.id === types.LAYOUT_CATEGORY || library.id === types.LOTS_CATEGORY) {
    return true
  }
}

const getAvaibleFilters = (filters, state) => {
  let avaibleFilters = {}
  if (typeof state.allFilters === 'undefined') return avaibleFilters;
  for (let i in filters) {
    if (typeof state.allFilters[filters[i]] !== 'undefined') {
      if (typeof avaibleFilters[state.allFilters[filters[i]].groupsId] === 'undefined') {
        avaibleFilters[state.allFilters[filters[i]].groupsId] = {}
        avaibleFilters[state.allFilters[filters[i]].groupsId].filters = []
      }
      avaibleFilters[state.allFilters[filters[i]].groupsId].name = state.allFilters[filters[i]].groupName
      avaibleFilters[state.allFilters[filters[i]].groupsId].filters.push(state.allFilters[filters[i]])
    }
  }
  return avaibleFilters;
}