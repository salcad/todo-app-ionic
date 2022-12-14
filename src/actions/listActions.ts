import { Action } from "../types"
import { GET, POST, PUT, DELETE } from "../lib/http"
import { doFetchCategories } from "./categoryActions"
import { GENERAL_ERROR } from "../errors"

export const FETCH_LIST = "FETCH_LIST"
export const FETCH_LIST_FAIL = "FETCH_LIST_FAIL"
export const FETCH_LIST_SUCCESS = "FETCH_LIST_SUCCESS"

export const POST_LIST = "POST_LIST"
export const POST_LIST_FAIL = "POST_LIST_FAIL"
export const POST_LIST_SUCCESS = "POST_LIST_SUCCESS"

export const UPDATE_LIST = "UPDATE_LIST"
export const UPDATE_LIST_FAIL = "UPDATE_LIST_FAIL"
export const UPDATE_LIST_SUCCESS = "UPDATE_LIST_SUCCESS"

export const FETCH_PINNED = "FETCH_PINNED"
export const FETCH_PINNED_FAIL = "FETCH_PINNED_FAIL"
export const FETCH_PINNED_SUCCESS = "FETCH_PINNED_SUCCESS"

export const DELETE_LIST = "DELETE_LIST"
export const DELETE_LIST_FAIL = "DELETE_LIST_FAIL"
export const DELETE_LIST_SUCCESS = "DELETE_LIST_SUCCESS"

export const fetchList = (): Action => ({
  type: FETCH_LIST,
})

export const fetchListFail = (err): Action => ({
  type: FETCH_LIST_FAIL,
  payload: err,
})

export const fetchListSuccess = (listItems): Action => ({
  type: FETCH_LIST_SUCCESS,
  payload: listItems,
})

export const postList = (): Action => ({
  type: POST_LIST,
})

export const postListFail = (err): Action => ({
  type: POST_LIST_FAIL,
  payload: err,
})

export const postListSuccess = (list): Action => ({
  type: POST_LIST_SUCCESS,
  payload: list,
})

export const updateList = (): Action => ({
  type: UPDATE_LIST,
})

export const updateListFail = (err): Action => ({
  type: UPDATE_LIST_FAIL,
  payload: err,
})

export const updateListSuccess = (list): Action => ({
  type: UPDATE_LIST_SUCCESS,
  payload: list,
})

export const fetchPinned = (): Action => ({
  type: FETCH_PINNED,
})

export const fetchPinnedFail = (err): Action => ({
  type: FETCH_PINNED_FAIL,
  payload: err,
})

export const fetchPinnedSuccess = (pinned): Action => ({
  type: FETCH_PINNED_SUCCESS,
  payload: pinned,
})

export const deleteList = (): Action => ({
  type: DELETE_LIST,
})

export const deleteListFail = (err): Action => ({
  type: DELETE_LIST_FAIL,
  payload: err,
})

export const deleteListSuccess = (): Action => ({
  type: DELETE_LIST_SUCCESS,
})

export function doFetchList(
  id: number
) {
  return async (dispatch) => {
    dispatch(fetchList())

    try {
      const response = await GET(`lists/${id}`)

      const resData = await response.json()

      if (response.status !== 200) {
        dispatch(fetchListFail(GENERAL_ERROR))
      } else {
        dispatch(fetchListSuccess(resData))
      }
    } catch (err) {
      dispatch(fetchListFail(GENERAL_ERROR))
    }
  }
}

export function doPostList(list) {
  return async (dispatch) => {
    dispatch(postList())

    return new Promise((resolve, reject) => {
      POST("lists", list).then((response) => {
        if (response.status !== 201) {
          response.json().then((data) => {
            dispatch(postListFail(GENERAL_ERROR))
            reject(data)
          })
        } else {
          response.json().then((data) => {
            dispatch(doFetchCategories())
            dispatch(postListSuccess(data))
            return resolve(data)
          })
        }
      })
    })
  }
}

export function doFetchPinned() {
  return async (dispatch) => {
    dispatch(fetchPinned())

    try {
      const response = await GET("lists/pinned")

      const resData = await response.json()

      if (response.status !== 200) {
        dispatch(fetchPinnedFail(GENERAL_ERROR))
      } else {
        dispatch(doFetchCategories())
        dispatch(fetchPinnedSuccess(resData))
      }
    } catch (err) {
      dispatch(fetchPinnedFail(GENERAL_ERROR))
    }
  }
}

export function doUpdateList(id: number, payload) {
  return async (dispatch) => {
    dispatch(updateList())

    try {
      const response = await PUT(`lists/${id}`, payload)

      if (response.status !== 200) {
        dispatch(updateListFail(GENERAL_ERROR))
      } else {
        dispatch(doFetchList(id))
        dispatch(doFetchPinned())
      }
    } catch (err) {
      dispatch(updateListFail(GENERAL_ERROR))
    }
  }
}

export function doDeleteList(
  id: number
) {
  return async (dispatch) => {
    dispatch(deleteList())

    try {
      await DELETE(`lists/${id}`)

      dispatch(doFetchCategories())
      dispatch(deleteListSuccess())
    } catch (err) {
      dispatch(deleteListFail(GENERAL_ERROR))
    }
  }
}
