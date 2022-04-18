import type { BeforeSave } from '@hydrofoil/knossos/lib/resource'
import httpError from 'http-errors'
import { dash, hydra, rdf, sh } from '@tpluscode/rdf-ns-builders/strict'
import { findNodes, toSparql } from 'clownface-shacl-path'
import type { ResourceHook } from '@hydrofoil/labyrinth/resource'

export const checkReadonlyProperties: BeforeSave = ({ before, after, api }) => {
  // find properties where [ dash:readOnly true ]
  const readonlyProperties = api.node(before.out(rdf.type).terms)
    .out(sh.property)
    .has(dash.readOnly, true)

  for (const readonlyProperty of readonlyProperties.toArray()) {
    const shaclPath = readonlyProperty.out(sh.path)
    const beforeValue = findNodes(before, shaclPath)
    const afterValue = findNodes(after, shaclPath)

    if (!beforeValue.term?.equals(afterValue.term)) {
      const pathSparql = toSparql(shaclPath).toString({ prologue: false })
      throw new httpError.BadRequest(`Path ${pathSparql} is readonly`)
    }
  }
}

export const ensureHydraApi: ResourceHook = (req, pointer) => {
  if (req.method === 'PUT' && !pointer.has(hydra.apiDocumentation).terms.length) {
    pointer.addOut(hydra.apiDocumentation, req.hydra.api.term!)
  }
}
