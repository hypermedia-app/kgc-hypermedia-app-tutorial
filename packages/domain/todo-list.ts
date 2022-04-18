import { acl, hydra, schema } from '@tpluscode/rdf-ns-builders/strict'
import type { ResourceHook } from '@hydrofoil/labyrinth/resource'
import { DELETE, SELECT } from '@tpluscode/sparql-builder'
import { updated } from '@hydrofoil/knossos-events/activity'
import { Handler } from '@hydrofoil/knossos-events'
import type { Term } from '@rdfjs/types'
import { isNamedNode } from 'is-graph-pointer'
import 'express-rdf-request'

export const ensureMemberAssertions: ResourceHook = (req, pointer) => {
  const { method, agent } = req

  // only when creating a new TO-DO List
  if (method === 'PUT') {
    if (!pointer.out(hydra.memberAssertion).terms.length) {
      pointer.addOut(hydra.memberAssertion, (ma) => {
        ma.addOut(hydra.property, schema.isPartOf)
        ma.addOut(hydra.object, pointer)
      })
      pointer.addOut(hydra.memberAssertion, (ma) => {
        ma.addOut(hydra.property, acl.owner)
        ma.addOut(hydra.object, agent!)
      })
    }
  }
}

export const setOwner: ResourceHook = (req, pointer) => {
  if (!pointer.out(acl.owner).term && req.agent) {
    pointer.addOut(acl.owner, req.agent)
  }
}

const newStatusSelect = (list: Term) => SELECT`?newStatus`
  .WHERE`
    {
      select (count(?item) as ?completeItems) {
        ?item schema:isPartOf ${list} .
        ?item schema:status "COMPLETED" .
      }
    }
    {
      select (count(?item) as ?totalItems) {
        ?item schema:isPartOf ${list} .
      }
    }
  
    BIND(IF(?totalItems = ?completeItems, "COMPLETED", "IN PROGRESS") as ?newStatus)
  `

export const updateProgress: Handler = async ({ req }) => {
  // get the list's URI
  const todoItem = await req.resource()
  const todoListPtr = todoItem.out(schema.isPartOf)
  if (!isNamedNode(todoListPtr)) return []

  const todoList = todoListPtr.term
  // update the list
  await DELETE`
    GRAPH ${todoList} { ${todoList} ${schema.status} ?status }
  `.INSERT`
    GRAPH ${todoList} { ${todoList} ${schema.status} ?newStatus }
  `.WHERE`
    optional { 
      ${todoList} ${schema.status} ?status ;
    }
    
    {
      ${newStatusSelect(todoList)}
    }
  `.execute(req.labyrinth.sparql.query)

  // create more events to be processed
  return updated(todoList, {
    actor: req.agent,
    summary: 'Added item to list',
  })
}
