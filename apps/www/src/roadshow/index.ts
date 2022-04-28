import { Renderer } from '@hydrofoil/roadshow'
import { ViewersController } from '@hydrofoil/roadshow/ViewersController'
import { dash, rdf } from '@tpluscode/rdf-ns-builders'
import { hex } from '@hydrofoil/vocabularies/builders'
import * as Collection from './renderer/Collection'
import * as OperationForm from './renderer/OperationForm'
import * as TodoStatusToggleButton from './renderer/TodoStatusToggleButton'
import * as Details from './renderer/Details'

ViewersController.viewerMeta.node(hex.CollectionViewer)
  .addOut(rdf.type, dash.MultiViewer)

export const renderers: Renderer<any>[] = [
  Collection.renderer,
  Details.renderer,
  OperationForm.renderer,
  TodoStatusToggleButton.renderer,
]
