import { Action, User } from "../types"
import { POST, PUT, DELETE } from "../lib/http"
import { GENERAL_ERROR } from "../errors"

export const SIGN_IN = "SIGN_IN"
export const SIGN_IN_SUCCESS = "SIGN_IN_SUCCESS"
export const SIGN_IN_FAIL = "SIGN_IN_FAIL"
export const SIGN_OUT = "SIGN_OUT"

export const CREATE_ACCOUNT = "CREATE_ACCOUNT"
export const CREATE_ACCOUNT_SUCCESS = "CREATE_ACCOUNT_SUCCESS"
export const CREATE_ACCOUNT_FAIL = "CREATE_ACCOUNT_FAIL"

export const UPDATE_ACCOUNT = "UPDATE_ACCOUNT"
export const UPDATE_ACCOUNT_FAIL = "UPDATE_ACCOUNT_FAIL"
export const UPDATE_ACCOUNT_SUCCESS = "UPDATE_ACCOUNT_SUCCESS"

export const DELETE_ACCOUNT = "DELETE_ACCOUNT"
export const DELETE_ACCOUNT_FAIL = "DELETE_ACCOUNT_FAIL"
export const DELETE_ACCOUNT_SUCCESS = "DELETE_ACCOUNT_SUCCESS"

export const signin = (): Action => ({
  type: SIGN_IN,
})

export const signinSuccess = (user: User): Action => ({
  type: SIGN_IN_SUCCESS,
  payload: user,
})

export const signinFail = (err): Action => ({
  type: SIGN_IN_FAIL,
  payload: err,
})

export const signout = (): Action => ({
  type: SIGN_OUT,
})

export const createAccount = (): Action => ({
  type: CREATE_ACCOUNT,
})

export const createAccountSuccess = (user: User): Action => ({
  type: CREATE_ACCOUNT_SUCCESS,
  payload: user,
})

export const createAccountFail = (err): Action => ({
  type: CREATE_ACCOUNT_FAIL,
  payload: err,
})

export const updateAccount = (): Action => ({
  type: UPDATE_ACCOUNT,
})

export const updateAccountFail = (err): Action => ({
  type: UPDATE_ACCOUNT_FAIL,
  payload: err,
})

export const updateAccountSuccess = (user) => ({
  type: UPDATE_ACCOUNT_SUCCESS,
  payload: user,
})

export const deleteAccount = (): Action => ({
  type: DELETE_ACCOUNT,
})

export const deleteAccountFail = (err): Action => ({
  type: DELETE_ACCOUNT_FAIL,
  payload: err,
})

export const deleteAccountSuccess = (): Action => ({
  type: DELETE_ACCOUNT_SUCCESS,
})

export function doCreateAccount(data: User, cache = false) {
  return async (dispatch) => {
    dispatch(createAccount())

    try {
      const response = await POST("auth/signup", data, true)

      const resData = await response.json()
      
      if (response.status !== 201) {
        if (resData.error === 'Unprocessable Entity') {
            resData.message = 'Invalid input data';
        }
        dispatch(createAccountFail(resData))
      } else {
        dispatch(createAccountSuccess(resData))

        localStorage.setItem("user", JSON.stringify(resData))
        
      }
    } catch (err) {
      dispatch(createAccountFail(err))
    }
  }
}

export function doSignin(data: User, cache = false) {
  return async (dispatch) => {
    dispatch(signin())

    try {
      const response = await POST(`auth/login`, {
        email: data.email,
        password: data.password,
      }, true)

      const resData = await response.json();
    
      if (response.status !== 201) {
        dispatch(signinFail(GENERAL_ERROR))
      } else {
        dispatch(signinSuccess(resData))
        localStorage.setItem("user", JSON.stringify(resData));
      }
    } catch (err) {
      dispatch(signinFail(GENERAL_ERROR))
    }
  }
}

export function doSignout() {
  localStorage.clear()

  return async (dispatch) => {
    dispatch(signout())
  }
}

export function doUpdateAccount(
  data,
) {
  return async (dispatch) => {
    dispatch(updateAccount())

    try {
      const response = await PUT(`auth/update`, data)

      const resData = await response.json()
      if (response.status !== 200) {
        dispatch(updateAccountFail(GENERAL_ERROR))
      } else {
        resData.rawPass = data.password

        if (localStorage.getItem("user")) {
          localStorage.setItem("user", JSON.stringify(resData))
        }

        dispatch(updateAccountSuccess(resData))
      }
    } catch (err) {
      dispatch(updateAccountFail(GENERAL_ERROR))
    }
  }
}

export function doDeleteAccount(
  id: number,
) {
  return async (dispatch) => {
    dispatch(deleteAccount())

    try {
      await DELETE(`auth/${id}`)

      dispatch(deleteAccountSuccess())
      dispatch(doSignout())
    } catch (err) {
      dispatch(deleteAccountFail(GENERAL_ERROR))
    }
  }
}
