import { url, Response } from '../../utils/http';

const prefix = 'login/';

const login = (userName: string, password: string) => {
  return (dispatch) => {
    return fetch(`${url}/login`, {
      credentials: "include",
      headers: { 
        "Content-Type": "application/json"
      },
      method: 'POST',
      body: JSON.stringify({
        userName,
        password
      })
    }).then((res) => res.json()).then(data => {
      dispatch({
        type: `${prefix}login`,
        payload: data
      })
      return data
    })
  }
}

const actions = {
  login
}

class InitState {
  userInfo: Response;
  loginStatus: boolean = false;
}

const reducer = (state = new InitState(), action): InitState => {
  switch (action.type) {
    case `${prefix}login`:
      return {
        ...state,
        userInfo: action.payload,
        loginStatus: true
      }
    default:
      return state
  }
}

export { actions, reducer, InitState }