import type { Renderer } from '@hydrofoil/roadshow'
import { dash } from '@tpluscode/rdf-ns-builders/strict'
import { html } from 'lit'
import type { FocusNodeViewContext } from '@hydrofoil/roadshow/lib/ViewContext'
import { byOrder } from '../../lib/shape'

export const renderer: Renderer<FocusNodeViewContext> = {
  viewer: dash.DetailsViewer,
  render() {
    const properties = this.state.properties.sort(byOrder)

    return html`${properties?.map(property => html`<div>${this.show({
      property,
    })}</div>`)}`
  },
}
