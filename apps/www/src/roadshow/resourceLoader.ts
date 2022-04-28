import type { ResourceLoader } from '@hydrofoil/roadshow/ResourcesController.js'
import clownface from 'clownface'
import $rdf from 'rdf-ext'
import { HydraClient } from 'alcaeus/alcaeus'

export const resourceLoader = (Hydra: HydraClient | undefined): ResourceLoader | undefined => {
  if (!Hydra) {
    return undefined
  }

  return async (id) => {
    const { representation } = await Hydra.loadResource(id)

    return representation?.root?.pointer || clownface({ dataset: $rdf.dataset() }).blankNode()
  }
}
