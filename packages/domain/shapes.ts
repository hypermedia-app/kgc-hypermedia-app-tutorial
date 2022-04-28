/* eslint-disable camelcase */
import { SELECT, sparql } from '@tpluscode/sparql-builder'
import type { Pattern } from '@hydrofoil/labyrinth/lib/query'
import { dash, sh } from '@tpluscode/rdf-ns-builders/strict'
import type { ResourceHook } from '@hydrofoil/labyrinth/resource'
import { hyper_auth } from '@hydrofoil/vocabularies/builders/strict'
import { check } from 'rdf-web-access-control'
import { isNamedNode } from 'is-graph-pointer'
import { toSparql } from 'clownface-shacl-path'
import $rdf from 'rdf-ext'
import getStream from 'get-stream'
import type { MultiPointer } from 'clownface'
import { NamedNode } from 'rdf-js'
import { roadshow } from '@hydrofoil/vocabularies/builders'

export function filterByTargetNode({ subject, object }: Pattern) {
  return sparql`{
    ${subject} ${sh.targetNode} <${object.value}>
  } union {
    <${object.value}> a ?type .
    ${subject} ${sh.targetClass} ?type .
  } union {
    <${object.value}> a ?type .
    ${subject} ${dash.applicableToClass} ?type .
  }`
}

export const removeUnauthorizedProperties: ResourceHook = async (req, pointer) => {
  const controledProps = pointer.any().has(hyper_auth.access)
  if (!req.query.resource) {
    return
  }

  const focusNode = $rdf.namedNode(req.query.resource.toString())

  async function findTerms(path: MultiPointer) {
    const stream = await SELECT`?term`
      .WHERE`${focusNode} ${toSparql(path)} ?term`
      .execute(req.labyrinth.sparql.query)
    const results = await getStream.array<{ term: NamedNode }>(stream)

    return results.map(({ term }) => term)
  }

  const toCheck = controledProps.map((prop) => {
    const path = prop.out(sh.path)
    const termPromises = path.term?.equals(roadshow.self) ? [focusNode] : findTerms(path)
    const accessMode = prop.out(hyper_auth.access)

    return {
      prop,
      accessMode,
      path,
      termPromises,
    }
  })

  await Promise.all(toCheck.map(async ({ accessMode, path, termPromises, prop }) => {
    if (!isNamedNode(accessMode)) {
      return
    }

    const terms = await termPromises
    await Promise.all(terms.map(async (term) => {
      req.knossos.log(`Checking access to ${prop.out(sh.name).value || toSparql(path)}`)
      const hasAccess = await check({
        client: req.labyrinth.sparql,
        accessMode: accessMode.term,
        agent: req.agent,
        term,
      })

      if (!hasAccess) {
        req.knossos.log(`Removing ${prop.out(sh.name).value || toSparql(path)}`)
        prop.deleteIn(sh.property)
      }
    }))
  }))
}
