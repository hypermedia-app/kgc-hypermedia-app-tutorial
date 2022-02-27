import { createElement, ClassAttributes } from 'react'
import * as ReactDOM from 'react-dom'

import {
  Workspace,
  WorkspaceProps,
  GroupTemplate, SparqlDataProvider, OWLStatsSettings,
} from 'graph-explorer'

import {
  onPageLoad,
  tryLoadLayoutFromLocalStorage,
  saveLayoutToLocalStorage,
} from './common'

function onWorkspaceMounted(workspace: Workspace) {
  if (!workspace) {
    return
  }

  const diagram = tryLoadLayoutFromLocalStorage()
  workspace.getModel().importLayout({
    diagram,
    validateLinks: true,
    dataProvider: new SparqlDataProvider({
      endpointUrl: process.env.TRIFID_ENDPOINT!,
    }, {
      ...OWLStatsSettings,
      linksInfoQuery: `SELECT ?source ?type ?target
      WHERE {
          \${linkConfigurations}

          VALUES (?source) {\${ids}}
          VALUES (?target) {\${ids}}

          filter exists {
  graph ?g \${linkConfigurations}
  }
      }`,
      linkTypesStatisticsQuery: `
        SELECT (\${linkId} as ?link) ?outCount ?inCount
        WHERE {
            {
                SELECT (count(?outObject) as ?outCount) WHERE {
                    \${linkConfigurationOut}
                    \${navigateElementFilterOut}
                } LIMIT 101
            } {
                SELECT (count(?inObject) as ?inCount) WHERE {
                    \${linkConfigurationIn}
                    \${navigateElementFilterIn}
                } LIMIT 101
            }
        }
    `,
    }),
  })
}

const props: WorkspaceProps & ClassAttributes<Workspace> = {
  ref: onWorkspaceMounted,
  onSaveDiagram: (workspace) => {
    const diagram = workspace.getModel().exportLayout()
    window.location.hash = saveLayoutToLocalStorage(diagram)
    window.location.reload()
  },
  onPersistChanges: (workspace) => {
    const state = workspace.getEditor().authoringState
    // eslint-disable-next-line no-console
    console.log('Authoring state:', state)
  },
  viewOptions: {
    onIriClick: ({ iri }) => window.open(iri),
    groupBy: [
      {
        linkType: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
        linkDirection: 'in',
      },
    ],
  },
  elementTemplateResolver: (types) => {
    if (types.length === 0) {
      // use group template only for classes
      return GroupTemplate
    }
    return undefined
  },
}

onPageLoad((container) => {
  ReactDOM.render(createElement(Workspace, props), container)
})
