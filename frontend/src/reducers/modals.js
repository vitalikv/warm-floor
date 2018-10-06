import * as types from '../constants/ActionTypes'

const initialState = {
  categoryId: '0',
  prevCategoryId: '0',
  category: '',
  categories: '',
  subCategory: '',
  lots: '',
  lostPerPage: 20,
  lotsPage: 0,
  loadingData: false
}

export default function getLotsBySearch(state = initialState, action) {
  switch (action.type) {
    case types.GET_LOTS_BY_SEARCH:
      if (state.lots.length > 0 && state.lots[0].id == action.payload[0].id)
        return { ...state }
      else {
        return { ...state, lots: [...state.lots, ...action.payload] }
      }
    case types.SET_CATEGORY_NAME:
      return { ...state, ...action.payload }
    case types.GET_CATEGORY_LIST:
      return { ...state, categories: action.payload }
    case types.SET_ACTIVE_CATEGORY:
      return { ...state, prevCategoryId: state.categoryId, categoryId: action.payload, lots: [] }
    case types.START_LOADING_DATA:
      return { ...state, loadingData: true }
    case types.STOP_LOADING_DATA:
      return { ...state, loadingData: false }
    default:
      return state
  }
}


