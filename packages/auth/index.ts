import auth from 'basic-auth'
import { foaf, rdf } from '@tpluscode/rdf-ns-builders/strict'
import { DESCRIBE } from '@tpluscode/sparql-builder'
import clownface from 'clownface'
import $rdf from 'rdf-ext'
import { asyncMiddleware } from 'middleware-async'
import type { MiddlewareFactory } from '@hydrofoil/knossos/configuration'
import { isNamedNode } from 'is-graph-pointer'

export const basic: MiddlewareFactory = () => asyncMiddleware(async (req, res, next) => {
  const { name, pass } = auth(req) || {}

  if (!name || !pass) {
    return next()
  }

  // Find the user account in the store
  const quads = await DESCRIBE`?agent`
    .WHERE`
        ?agent a ${foaf.Person} ;
               ${foaf.accountName} "${name}" ;
               <http://linkeddata.center/kees/v1#password> "${pass}" .
      `
    .execute(req.labyrinth.sparql.query)

  const dataset = await $rdf.dataset().import(quads)
  const agent = clownface({ dataset }).has(rdf.type, foaf.Person)

  // Set authenticated agent to request
  if (isNamedNode(agent)) {
    req.agent = agent
  }

  return next()
})
