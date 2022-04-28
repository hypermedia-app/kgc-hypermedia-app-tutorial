import type { Store } from '@hydrofoil/shell'

export function effects(store: Store) {
  const dispatch = store.getDispatch()

  function reload() {
    const { contentResource } = store.getState().core

    if (contentResource) {
      dispatch.resource.load(contentResource.id.value)
    }
  }

  return {
    async logIn() {
      dispatch.auth.isAuthenticated(true)
      reload()
    },
    async logOut() {
      dispatch.auth.clearCredentials()
      dispatch.auth.isAuthenticated(false)
      reload()
    },
  }
}
