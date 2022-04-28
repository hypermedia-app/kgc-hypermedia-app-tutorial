import $rdf from '@rdfjs/data-model'
import { rdfs } from '@tpluscode/rdf-ns-builders/strict'
import type { DispatchParam, Store } from '../store'

export default function effects(store: Store) {
  const dispatch = store.getDispatch()

  return {
    'core/clientReady': (Hydra: DispatchParam<'core', 'clientReady'>) => {
      const { resource } = store.getState().routing
      dispatch.resource.load(resource)

      /* eslint-disable no-param-reassign */
      Hydra.defaultHeaders = (): HeadersInit => {
        const { credentials } = store.getState().auth
        if (credentials) {
          return {
            Authorization: `Basic ${window.btoa(`${credentials.username}:${credentials.password}`)}`,
          }
        }

        return {}
      }
    },
    'resource/succeeded': ({ id, representation }: DispatchParam<'resource', 'succeeded'>) => {
      const { resource } = store.getState().routing
      if (id.value === resource && representation?.root) {
        dispatch.core.setContentResource({
          id: $rdf.namedNode(resource),
          pointer: representation.root.pointer,
        })
      }
    },
    'operation/succeeded': () => {
      const { contentResource } = store.getState().core

      if (contentResource) {
        dispatch.resource.load(contentResource.id.value)
      }
    },
    'operation/failed': ({ error }: DispatchParam<'operation', 'failed'>) => {
      alert(error?.getString(rdfs.label))
      // eslint-disable-next-line no-console
      console.warn(error?.toJSON())
    },
  }
}
