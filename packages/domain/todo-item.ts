import type { ResourceHook } from '@hydrofoil/labyrinth/resource'
import { schema } from '@tpluscode/rdf-ns-builders/strict'

export const defaultStatus: ResourceHook = (req, pointer) => {
  if (req.method === 'POST') {
    pointer.deleteOut(schema.status)
      .addOut(schema.status, 'IN PROGRESS')
  }
}
