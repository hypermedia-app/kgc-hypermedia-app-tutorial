/* eslint-disable class-methods-use-this */
import { connect } from '@captaincodeman/rdx'
import { ResourceLoader } from '@hydrofoil/roadshow/ResourcesController'
import { ShapesLoader } from '@hydrofoil/roadshow/ShapesController'
import type { State } from '@hydrofoil/shell'
import { HydraClient } from 'alcaeus/alcaeus'
import { html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { store } from '../state/store'
import { resourceLoader } from '../roadshow/resourceLoader'
import { apiLoader } from '../roadshow/shapesLoader'
import { renderers } from '../roadshow'

export default class extends connect(store, LitElement) {
  private shapesLoader?: ShapesLoader
  private resourceLoader?: ResourceLoader

  @property({ type: Object })
    state!: State

  async connectedCallback() {
    store.dispatch.core.initialize()
    await import('@hydrofoil/roadshow/roadshow-view.js')
    super.connectedCallback()
  }

  render() {
    const authControls = !this.state.auth.credentials
      ? html`<form id="login-form" @submit="${this.__logIn}">
        <input name="username" placeholder="user name" required value="tomasz">
        <input name="password" type="password" placeholder="password" required value="super-secret">
        <input type="submit">
      </form>`
      : html`<button @click="${store.dispatch.auth.logOut}">Log out</button>`

    if (!this.state.core.contentResource) {
      return html`
        ${authControls}
        <slot name="loading"></slot>
      `
    }

    return html`${authControls}
    <roadshow-view .resource="${this.state.core.contentResource.pointer}"
                   .params="${this.state}"
                   .shapesLoader="${this.shapesLoader}"
                   .resourceLoader="${this.resourceLoader}"
                   .renderers="${renderers}"
    ></roadshow-view>`
  }

  mapState(state: State) {
    return {
      state,
      shapesLoader: this.shapesLoader || this.__initShapesLoader(state.core.client),
      resourceLoader: this.resourceLoader || resourceLoader(state.core.client),
    }
  }

  mapEvents() {
    return {
      'load-resource': ({ detail }: CustomEvent) => store.dispatch.resource.load(detail.id),
      'submit-operation': ({ detail }: CustomEvent) => store.dispatch.operation.invoke(detail),
    }
  }

  __logIn(e: SubmitEvent) {
    const form = this.renderRoot.querySelector<HTMLFormElement>('#login-form')!

    store.dispatch.auth.setCredentials({
      username: (form.elements.namedItem('username') as any).value,
      password: (form.elements.namedItem('password') as any).value,
    })
    store.dispatch.auth.logIn()
    e.preventDefault()
  }

  __initShapesLoader(client: HydraClient | undefined) {
    if (!client) {
      return undefined
    }

    return apiLoader(() => {
      const { contentResource } = store.state.core
      if (contentResource) {
        if ('types' in contentResource) {
          return contentResource.apiDocumentation
        }

        const { id } = contentResource
        return store.state.resource.representations.get(id)?.root?.apiDocumentation
      }

      return undefined
    }, client)
  }
}
