import { html, Renderer } from '@hydrofoil/roadshow'
import type { FocusNodeViewContext } from '@hydrofoil/roadshow/lib/ViewContext'
import { RdfResource, RuntimeOperation } from 'alcaeus'
import clownface, { GraphPointer } from 'clownface'
import $rdf from 'rdf-ext'
import { rdf, sh } from '@tpluscode/rdf-ns-builders/strict'
import { FocusNodeState } from '@hydrofoil/roadshow/lib/state'
import { hex } from '@hydrofoil/vocabularies/builders'
import { isResource } from 'is-graph-pointer'

interface OperationFormViewState {
  resource?: GraphPointer
  shapes?: RdfResource
  operation?: RuntimeOperation
}

function submit(e: Event) {
  e.target?.dispatchEvent(new CustomEvent('submit-operation', {
    bubbles: true,
    composed: true,
    detail: {},
  }))
}

function setEvent({ operation }: OperationFormViewState) {
  return (e: any) => {
    /* eslint-disable no-param-reassign */
    e.detail.payload = e.currentTarget.resource
    e.detail.operation = operation
  }
}

function renderComponent(state: FocusNodeState<OperationFormViewState>) {
  return html`
    <shaperone-form @submit-operation="${setEvent(state.locals)}" 
                    .resource="${state.locals.resource}"
                    .shapes="${state.locals.shapes?.pointer}">
      <button slot="buttons" @click="${submit}">${state.locals.operation?.title}</button>
    </shaperone-form>
  `
}

export const renderer: Renderer<FocusNodeViewContext<OperationFormViewState>> = {
  viewer: hex.OperationFormViewer,
  async init() {
    await import(/* webpackChunkName: "operation-viewer" */ '@hydrofoil/shaperone-wc/shaperone-form')
  },
  render(pointer) {
    if (!pointer.value) {
      return html``
    }

    if (!this.state.locals.shapes && isResource(pointer)) {
      let operationType = this.state.shape?.pointer.out(hex.operation).term
      if (!operationType) {
        operationType = this.parent?.propertyShape.pointer.out(hex.operation).term
      }
      const resource = this.params.core.client?.resources.factory.createEntity(pointer)
      const [operation] = resource?.findOperations({
        bySupportedOperation: operationType as any,
      }) || []

      if (!operation) {
        return html`Operation ${operationType?.value} not found on resource ${pointer.value}`
      }

      this.state.locals.operation = operation
      const { expects } = operation
      const shapeId = expects[0]?.id
      if (shapeId) {
        const state = this.params.resource.representations.get(shapeId)
        const shape = state?.representation?.get(shapeId.value)
        if (shape) {
          this.state.locals.shapes = shape
          this.state.locals.resource = clownface({ dataset: $rdf.dataset() })
            .namedNode('')
            .addOut(rdf.type, shape.pointer.out(sh.targetClass))
        } else if (!state) {
          this.controller.host.dispatchEvent(new CustomEvent('load-resource', {
            bubbles: true,
            composed: true,
            detail: {
              id: shapeId,
            },
          }))
        }
      }
    }

    return renderComponent(this.state)
  },
}
