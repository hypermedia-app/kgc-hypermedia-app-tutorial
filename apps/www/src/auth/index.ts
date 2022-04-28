import { createModel } from '@captaincodeman/rdx'
import { AuthState, reducers } from '@hydrofoil/shell-auth'
import { effects } from './effects'
import basicAuthReducers from './reducers'

type R = typeof basicAuthReducers
type E = ReturnType<typeof effects>

export interface Credentials {
  username: string
  password: string
}

declare module '@hydrofoil/shell-auth' {
  /* eslint-disable */
  interface AuthState {
    credentials?: Credentials
  }

  interface Effects extends E {
  }

  interface Reducers extends R {
  }
}

export default createModel({
  state: <AuthState>{
    isAuthenticated: false,
  },
  reducers: { ...reducers, ...basicAuthReducers },
  effects,
})
