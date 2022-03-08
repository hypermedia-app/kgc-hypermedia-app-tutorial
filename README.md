# Bridging the gap between business domains and Knowledge Graphs
### A Knowledge Graph Conference tutorial

## Step 1 - defining resource models, authorization, and setting up local environment

A Knowledge Graph is not just business resources but also all necessary metadata. This way, inspired by the [Data-Centric Manifesto][centric], makes the data easily portable and self-sufficient. Granted, it requires an application layer on top of it to produce working software but said layer must strive not to rely on logic encoded only within the implementing source code.  

[centric]: http://www.datacentricmanifesto.org/

TL;DR;

[See what changed](https://github.com/hypermedia-app/kgc-hypermedia-app-tutorial/compare/step-0...step-1) since step 0

## Data models

### `TodoItem` class

A SHACL Shape defines what individual TO-DOs should look like: [/todos/api/ToDoItem](apps/todos/resources/api/TodoItem.ttl) 

### `TodoList` - collection of TO-DOs

TO-DOs will be grouped in collection resources. A list of todos will be used to create new TO-DOs but sending a `POST` request.

## Access Control

Every API operation (request) must be explicitly allowed using a subset of the [Web Access Control vocabulary](https://solid.github.io/web-access-control-spec/). For the moment, read-only access will be granted to anonymous clients.

## Local environment

To quickly validate and test the data models and resource graphs, a set of development-time resources can easily be created. For that purpose, create a `apps/todos/resources.dev` directory. The template comes preconfigured to bootstrap resources in the local environment but there can be any number of analogous directories for various environments, such as `resources.prod` or `resources.uat`.

## Try it!

Ensure local database is populated with new resources:

```
lando start
yarn bootstrap
```

Dereference a TO-DO list and a TO-DO item

```
curl -H accept:text/turtle https://creta-todos.lndo.site/todos/list/kgc
curl -H accept:text/turtle https://creta-todos.lndo.site/todos/item/prepare-kgc-tutorial  
```

## Next step

[https://a.maze.link/kgc-tutorial-step-2](https://a.maze.link/kgc-tutorial-step-2)
