# Bridging the gap between business domains and Knowledge Graphs
### A Knowledge Graph Conference tutorial

## Step 6 - Web Application

This step introduces a User Interface to the TO-DO API built so far

TL;DR;

[See what changed](https://github.com/hypermedia-app/kgc-hypermedia-app-tutorial/compare/step-5...step-6) since step 6

## Roadshow and Shaperone

The majority of the frontend code is composed of three sets of packages:

| `@hydrofoil/rodashow` | Renders views from SHACL Shapes |
| `@hydrofoil/shaperone` | Renders forms from SHACL Shapes |
| `@hydrofoil/shell` | Removes boilerplate by providing a core, redux-like state management |

For the front end components to work, the API is further extended to provide the necessary SHACL Shape resources at runtime,
using the techniques shown previously

It's a bit much, so explore on your own to see how everything works together. Do pay attention to some new additions:

1. [`dash:viewer`](apps/todos/resources/_shape/TodoList.ttl#L23) which declares how SHACL Properties are rendered by roadshow
2. The matching [implementation](apps/www/src/roadshow/renderer/OperationForm.ts#L43-L100)
3. [`query:order`](apps/todos/resources/api/TodoList.ttl#L75-L82) which sorts collections
4. [`query:include`](apps/todos/resources/api/index.ttl#L24-L36) which eager-loads linked resources in a representation
5. [`query:search`](apps/todos/resources/api/view-shapes.ttl#L22-L36) which defines how collections are filtered

## Try it!

<details><summary>🔍 Expand</summary>

Ensure local database is populated with new resources:

```
curl http://admin:password@db.creta-todos.lndo.site/repositories/creta-todos -X POST \
  --data 'update=delete+%7B+graph+%3Fg+%7B+%3Fs+%3Fp+%3Fo+%7D+%7D+where+%7B+graph+%3Fg+%7B+%3Fs+%3Fp+%3Fo+%7D+%7D'
yarn bootstrap
```

_(this time we clear the database first, because of earlier changes to `hydra:apiDocumentation`)_

Open https://creta-todos.lndo.site/app/todos/list/shopping-list

</details>
