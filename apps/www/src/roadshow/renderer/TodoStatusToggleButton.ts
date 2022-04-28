import type { Renderer } from '@hydrofoil/roadshow'
import { html } from 'lit'
import type { FocusNodeViewContext } from '@hydrofoil/roadshow/lib/ViewContext'
import { schema } from '@tpluscode/rdf-ns-builders/strict'
import $rdf from 'rdf-ext'
import clownface from 'clownface'
import { hex } from '@hydrofoil/vocabularies/builders'

export const renderer: Renderer<FocusNodeViewContext<{ busy: boolean }>> = {
  viewer: hex.TodoStatusToggleButtonEditor,
  render(focusNode) {
    const { client } = this.params.core

    const update = async (e: Event) => {
      this.state.locals.busy = true
      this.controller.host.requestUpdate()

      await client?.loadResource(focusNode.value!, { Prefer: 'return=minimal' })
        .then(response => response.representation)
        .then(representation => representation?.root)
        .then((resource) => {
          if (!resource) {
            return
          }

          const [operation] = resource.findOperations({
            bySupportedOperation: schema.UpdateAction,
          }) || []

          const dataset = $rdf.dataset([
            ...resource.pointer.dataset.match(null, null, null, resource.id),
          ])
            .map(({ subject, predicate, object }) => $rdf.quad(subject, predicate, object))
          const payload = clownface({ dataset })
            .node(resource.id)
            .deleteOut(schema.status)
            .addOut(schema.status, 'COMPLETED')

          e.target?.dispatchEvent(new CustomEvent('submit-operation', {
            bubbles: true,
            composed: true,
            detail: {
              payload,
              operation,
            },
          }))
        })

      this.state.locals.busy = false
      this.controller.host.requestUpdate()
    }

    const disabled = !!focusNode.has(schema.status, 'COMPLETED').term || this.state.locals.busy

    return html`<button ?disabled="${disabled}" @click="${update}">✓</button>`
  },
}
