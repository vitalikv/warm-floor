import * as types from '../constants/ActionTypes'

const initialState = {
  project: {
    file: '',
    id: '',
    name: 'Название проекта',
    price: '10000'
  },
  user: {
    id: '',
    name: 'Имя'
  },
  currentModal: '',
  filters: {
    'roomsFilter': ''
  },
  isAuth: false,
  authInProcess: false,
  loader: false,
  loaderText: '',
  loadingEstimate: false
}

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_PROJECT_INFO:
      return { ...state, ...action.payload }
    case types.UPDATE_PRICE:
      return { ...state, project: { ...state.project, price: action.payload } }
    case types.SET_CURRENT_MODAL:
      return { ...state, currentModal: action.payload }
    case types.SET_FILTER_VALUE:
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case types.AUTH_USER:
      return { ...state, isAuth: action.payload, authInProcess: false }
    case types.AUTH_IN_PROCESS:
      return { ...state, authInProcess: true }
    case types.APPEND_LOADER:
      return { ...state, loader: true, loaderText: action.payload }
    case types.REMOVE_LOADER:
      return {...state, loader: false, loaderText: '' }
    case types.LOADING_ESTIMATE:
      return { ...state, loadingEstimate: true }
    case types.END_LOADING_ESTIMATE:
      return { ...state, loadingEstimate: false }
    default:
      return state
  }
}