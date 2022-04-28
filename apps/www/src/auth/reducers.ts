import { AuthState } from '@hydrofoil/shell-auth'
import type { Credentials } from '.'

export default {
  clearCredentials(state: AuthState) {
    return {
      ...state,
      credentials: undefined,
    }
  },
  setCredentials(state: AuthState, credentials: Credentials) {
    return {
      ...state,
      credentials,
    }
  },
}
