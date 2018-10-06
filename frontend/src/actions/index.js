import * as types from '../constants/ActionTypes'
import axios from 'axios'
import qs from 'qs'

import localCatalog from '../utils/local-catalog.json'
import divany from '../utils/local-divany.json'

import reactGlobal from '../utils/page-script.js'

export const setCurrentModal = (name) => {
  return {
    type: types.SET_CURRENT_MODAL,
    payload: name
  }
}

export const setFilterValue = (filter, value) => {
  let f = {};
  f[filter] = value;
  return {
    type: types.SET_FILTER_VALUE,
    payload: { ...f }
  }
}

export const setCategoryName = (category, subCategory) => {
  const subCat = (subCategory) ? { subCategory: subCategory } : {};
  const cat = (category) ? { category: category } : {};
  return {
    type: types.SET_CATEGORY_NAME,
    payload: { ...cat, ...subCat }
  }
}

export const startLoadingEstimate = () => {
  return {
    type: types.LOADING_ESTIMATE
  }
}

export const endLoadingEstimate = () => {
  return {
    type: types.END_LOADING_ESTIMATE
  }
}

export const updateEstimate = () => dispatch => {
  dispatch(startLoadingEstimate())
  setTimeout(then, 1000)
  function then() {
    dispatch(updatePrice())
    dispatch(endLoadingEstimate())
  }
}

export const getCategoryList = (callback, ...args) => dispatch => {
  console.log('.')
  dispatch({
    type: types.START_LOADING_DATA
  })
  apiRequest('/libraries/1/categories/').then(
    response => {
      console.dir(response)
      let data = remakeCats(response.data);
      dispatch({
        type: types.GET_CATEGORY_LIST,
        payload: data
      })
      dispatch({
        type: types.STOP_LOADING_DATA
      })
      if (callback) {
        console.log(...args)
        callback(...args);
      }
    }).catch(() => {
      console.error('Failed to load catalog structure. Using local copy')
      console.dir(localCatalog)
      let response = localCatalog;
      let data = remakeCats(response);
      dispatch({
        type: types.GET_CATEGORY_LIST,
        payload: data
      })
      dispatch({
        type: types.STOP_LOADING_DATA
      })
    })
}

export const setActiveCategoryId = (id) => {
  return {
    type: types.SET_ACTIVE_CATEGORY,
    payload: id
  }
}

export const updatePrice = () => {
  const price = Math.floor(Math.random() * (1000000 - 1000) + 1000);
  return {
    type: types.UPDATE_PRICE,
    payload: price
  }
}

export const removeLoader = () => {
  return {
    type: types.REMOVE_LOADER
  }
}

export const appendLoader = (name) => {
  return {
    type: types.APPEND_LOADER,
    payload: name
  }
}

export const getProjectInfo = (id) => dispatch => {
  if (process.env.NODE_ENV !== 'production') {
    loadLocalProject(dispatch)
  } else {
    dispatch(appendLoader('Загрузка проекта'))
    axios.get('https://planoplan.com/api/getWebglEditorData/?id=' + id, ).then(response => {
      const data = response.data.data;
      dispatch({
        type: types.GET_PROJECT_INFO,
        payload: data
      })
      dispatch(updatePrice())
      dispatch(removeLoader())
      reactGlobal.sendMessage('file', data.project.file);
    }).catch(e => {
      console.log(e)
      dispatch(removeLoader())
    })
  }
}

function loadLocalProject(dispatch) {
  dispatch(appendLoader('Загрузка проекта'))
  const response = { 'success': true, 'errorText': '', 'data': { 'user': { 'id': 387864, 'name': 'Павел' }, 'project': { 'id': 863941, 'name': 'Райский уголок', 'file': 'https://planoplan.com/ru/view/getProjectData/?id=20dbafa02d0cc02dfd9e30a7974c824d' } } }
  dispatch({
    type: types.GET_PROJECT_INFO,
    payload: response.data
  })
  dispatch(updatePrice());
  reactGlobal.sendMessage('file', response.data.project.file);
  dispatch(removeLoader())
}

export const getLibraries = () => () => {
  apiRequest('/libraries/xml')
}

export const getLot = (id, params, callback) => (dispatch) => {
  apiRequest(id, params).then(response => {
    const data = response.data;
    dispatch({
      type: types.GET_LOT_BY_ID,
      payload: data
    })
    if (callback) callback(response.data);
  })
}

export const getLotsBySearch = (params, callback) => (dispatch) => {
  dispatch({
    type: types.START_LOADING_DATA
  })
  apiRequest('/search/', { 'keys[]': '92da6c1f72c1ebca456a86d978af1dfc7db1bcb24d658d710c5c8ae25d98ba52', ...params }).then(response => {
    console.dir(response);
    const data = response.data.items;
    dispatch({
      type: types.GET_LOTS_BY_SEARCH,
      payload: data
    })
    dispatch({
      type: types.STOP_LOADING_DATA
    })
    if (callback) callback(data);
  }).catch((e) => {
    console.log(e);
    console.error('Failed to load catalog lots. Using local placeholder')
    console.dir(divany)
    const data = divany.data.items;
    dispatch({
      type: types.GET_LOTS_BY_SEARCH,
      payload: data
    })
    dispatch({
      type: types.STOP_LOADING_DATA
    })
  })
}

export const auth = () => dispatch => {
  const authOptions = {
    method: 'POST',
    url: 'https://catalog.planoplan.com/api/v2/auth/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    auth: {
      username: '92da6c1f72c1ebca456a86d978af1dfc7db1bcb24d658d710c5c8ae25d98ba52',
      password: 'iDBbyzj1UBi2Of0sn7pl'
    },
    data: qs.stringify({
      grant_type: 'client_credentials',
      scope: 'catalog'
    }),
    responseType: 'json'
  };
  dispatch({
    type: types.AUTH_IN_PROCESS
  })
  axios(authOptions).then((response) => {
    const data = response.data;
    if (response.status === 200) {
      let exp = new Date();
      exp = exp.getTime() + data.expires_in * 1000;
      localStorage.setItem('tokenExpires', exp);
      localStorage.setItem('token', data.access_token);
      console.log('auth complete')
      dispatch({
        type: types.AUTH_USER,
        payload: true
      })
    }
  }).catch(error => {
    console.log(error)
    dispatch({
      type: types.AUTH_USER,
      payload: false
    })
    localStorage.setItem('tokenExpires', '');
    localStorage.setItem('token', '');
  })
}

function apiRequest(path, params) {
  const options = {
    method: 'GET',
    url: path,
    baseURL: 'https://catalog.planoplan.com/api/v2',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    params: params,
    responseType: 'json'
  }
  return axios(options)
}

export const authUser = () => dispatch => {
  dispatch({
    type: types.AUTH_USER,
    payload: true
  })
}

function remakeCats(categories) {
  let allCats = {}
  function rec(cat) {
    for (let i = 0; i < cat.length; i++) {
      let newCat = {};
      newCat[cat[i].id] = {
        ...cat[i]
      }
      allCats = { ...allCats, ...newCat }
      if (newCat[cat[i].id].categories.length > 0) {
        rec(newCat[cat[i].id].categories)
      }
    }
  }
  rec(categories);
  return allCats;
}
