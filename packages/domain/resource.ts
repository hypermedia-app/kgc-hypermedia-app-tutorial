import type { BeforeSave } from '@hydrofoil/knossos/lib/resource'
import httpError from 'http-errors'
import { dash, rdf, sh } from '@tpluscode/rdf-ns-builders/strict'
import { findNodes, toSparql } from 'clownface-shacl-path'

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
