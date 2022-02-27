/* eslint-disable class-methods-use-this */
import { connect } from '@captaincodeman/rdx'
import type { State } from '@hydrofoil/shell'
import { html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { store } from '../state/store'

export default class extends connect(store, LitElement) {
  @property({ type: Object })
    state!: State

  async connectedCallback() {
    store.dispatch.core.initialize()
    await import('@hydrofoil/roadshow/roadshow-view.js')
    super.connectedCallback()
  }

  render() {
    if (!this.state.core.contentResource) {
      return html`<slot name="loading"></slot>`
    }

    return html`<roadshow-view .resource="${this.state.core.contentResource.pointer}"
                               .params="${this.state}"
    ></roadshow-view>`
  }

  mapState(state: State) {
    return {
      state,
    }
  }
}
