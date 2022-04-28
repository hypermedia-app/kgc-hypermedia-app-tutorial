import { ShapesLoader } from '@hydrofoil/roadshow/ShapesController'
import type { ApiDocumentation, Collection, Resource, ResourceIdentifier } from 'alcaeus'
import { HydraClient } from 'alcaeus/alcaeus'
import { dash, rdf, schema, sh } from '@tpluscode/rdf-ns-builders/strict'
import { GraphPointer } from 'clownface'
import { FocusNodeState, PropertyState } from '@hydrofoil/roadshow/lib/state'

interface GetApiDoc {
  (): ApiDocumentation | undefined
}

const shapePromises = new Map<string, Promise<Collection | undefined | null>>()

function getShNode(state: FocusNodeState | PropertyState) {
  if ('propertyShape' in state) {
    return state.propertyShape.node
  }

  return state.shape?.node
}

// eslint-disable-next-line max-len
export const apiLoader = (docs: GetApiDoc, Hydra: HydraClient): ShapesLoader => async (arg, state) => {
  const shNode = getShNode(state)?.pointer
  const shapes: GraphPointer<ResourceIdentifier>[] = []
  if (shNode) {
    shapes.push(shNode)
  }

  if (!dash.DetailsViewer.equals(state.viewer)) {
    return shapes
  }

  const collections = docs()?.getCollections({
    predicate: rdf.type,
    object: sh.NodeShape,
  }) as Resource[] | undefined

  if (!collections?.length || arg.term?.termType !== 'NamedNode') {
    return shapes
  }

  const [shapesCollection] = collections
  // TODO: this could be improved in the future to actually dereference the collection
  // and check what query parameters are available
  const url = new URL(shapesCollection.get(schema.sameAs).id.value)
  url.searchParams.set('resource', arg.term.value)

  const id = url.toString()
  let shapePromise = shapePromises.get(id)
  if (!shapePromise) {
    shapePromise = Hydra.loadResource<Collection>(id)
      .then(({ representation }) => {
        shapePromises.delete(id)
        return representation?.root
      })
    shapePromises.set(id, shapePromise)
  }

  const collection = await shapePromise
  if (collection) {
    shapes.push(...collection.member.map(m => m.pointer))
  }

  return shapes
}
