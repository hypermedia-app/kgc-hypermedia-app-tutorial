import type { MultiRenderer } from '@hydrofoil/roadshow'
import { html } from 'lit'
import type { PropertyShape } from '@rdfine/shacl'
import type { FocusNodeViewContext, PropertyViewContext } from '@hydrofoil/roadshow/lib/ViewContext'
import { GraphPointer } from 'clownface'
import { hydra, ldp } from '@tpluscode/rdf-ns-builders/strict'
import { hyper_query as query } from '@hydrofoil/vocabularies/builders/strict'
import { findNodes } from 'clownface-shacl-path'
import { hex } from '@hydrofoil/vocabularies/builders'
import { byOrder } from '../../lib/shape'

function renderCell(this: FocusNodeViewContext, property: PropertyShape) {
  return html`<td>${this.show({ property })}</td>`
}

function renderResource(this: FocusNodeViewContext) {
  const propertyShapes = this.state.shape?.property.filter(p => !p.hidden) || []

  return html`${propertyShapes.sort(byOrder).map(renderCell.bind(this))}`
}

function renderRow(this: PropertyViewContext, member: GraphPointer) {
  return html`<tr>
    ${this.object(member, { resource: renderResource })}
  </tr>`
}

function byAnnotatedCriteria(orders: GraphPointer[]) {
  return (left: GraphPointer, right: GraphPointer): number => {
    let result = 0
    for (const order of orders) {
      const path = order.out(query.path)
      const leftValue = findNodes(left, path).value || ''
      const rightValue = findNodes(right, path).value || ''
      result = leftValue.localeCompare(rightValue)
      if (result !== 0) {
        if (order.has(query.direction, ldp.Descending).terms.length) {
          result *= -1
        }
        break
      }
    }

    return result
  }
}

export const renderer: MultiRenderer = {
  viewer: hex.CollectionViewer,
  render(members) {
    if (!members.terms.length) {
      return 'Nothing to show'
    }

    this.controller.shapes.loadShapes(this.state, members)

    const propertyShapes = this.state.shape?.property.filter(p => !p.hidden) || []

    const headerRow = propertyShapes
      .sort(byOrder)
      .map(property => html`<td>${property.name}</td>`)

    const orders = members.in(hydra.member).toArray().shift()
      ?.out(query.order)
      .list()

    return html`<table>
      <thead>
        <tr>
          ${headerRow}
        </tr>
      </thead>
      <tbody>
        ${members.toArray().sort(byAnnotatedCriteria(orders ? [...orders] : [])).map(renderRow.bind(this))}
      </tbody>
    </table>`
  },
}
