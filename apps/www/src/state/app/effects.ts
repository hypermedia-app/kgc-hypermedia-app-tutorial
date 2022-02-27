import $rdf from '@rdfjs/data-model'
import type { DispatchParam, Store } from '../store'

export default function effects(store: Store) {
  const dispatch = store.getDispatch()

  return {
    'core/clientReady': () => {
      const { resource } = store.getState().routing
      dispatch.resource.load(resource)
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
  }
}
