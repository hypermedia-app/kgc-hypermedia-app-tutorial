import { acl, hydra, schema } from '@tpluscode/rdf-ns-builders/strict'
import type { ResourceHook } from '@hydrofoil/labyrinth/resource'

export const ensureMemberAssertions: ResourceHook = (req, pointer) => {
  const { method, agent } = req

  // only when creating a new TO-DO List
  if (method === 'PUT' && agent) {
    if (!pointer.out(hydra.memberAssertion).terms.length) {
      pointer.addOut(hydra.memberAssertion, (ma) => {
        ma.addOut(hydra.property, schema.isPartOf)
        ma.addOut(hydra.object, pointer)
      })
      pointer.addOut(hydra.memberAssertion, (ma) => {
        ma.addOut(hydra.property, acl.owner)
        ma.addOut(hydra.object, agent)
      })
    }
  }
}

export const setOwner: ResourceHook = (req, pointer) => {
  if (!pointer.out(acl.owner).term && req.agent) {
    pointer.addOut(acl.owner, req.agent)
  }
}
