# Bridging the gap between business domains and Knowledge Graphs
### A Knowledge Graph Conference tutorial

## Step 3 - event-driven architecture

Events are a powerful tool which allow the capture of changes in the domain objects over time. By persisting and handling
events asynchronously, complex business processes can be implemented without relying on long transactions and high coupling.

Most existing solutions require a specialized programming model and event persistence. Instead, I propose to simplify the 
architecture by making events pure RDF resource, embedded in the Knowledge Graph.

TL;DR;

[See what changed](https://github.com/hypermedia-app/kgc-hypermedia-app-tutorial/compare/step-2...step-3) since step 2

## Default events

<details><summary>🔍 Expand</summary>

Creta comes with built-in support for creating and consuming events. Events are represented using [Activity Streams vocabulary][as].
The default handlers emit `as:Create` and `as:Update` as result of successful PUT and POST requests.

This [example query](https://trifid.creta-todos.lndo.site/sparql/#query=PREFIX+as%3A+%3Chttps%3A%2F%2Fwww.w3.org%2Fns%2Factivitystreams%23%3E%0A%0Aconstruct+WHERE+%7B%0A++%3Fevent+a+as%3AActivity%2C+%3Ftype+%3B%0A+++++++++as%3Aobject+%3Chttps%3A%2F%2Fcreta-todos.lndo.site%2Ftodos%2Fitem%2FRide%2520Corbet%2527s%2520couloir%3E+%3B%0A+++++++++as%3AattributedTo+%3FattributedTo+%3B+%0A++++%09+as%3Acontext+%3Fcontext+%3B%0A+++++++++as%3Aactor+%3Factor+%3B%0A+++++++++as%3Apublished+%3Fpublished+%3B%0A+++++++++as%3Asummary+%3Fsummary+%3B%0A%7D%0A&contentTypeConstruct=text%2Fturtle&contentTypeSelect=application%2Fsparql-results%2Bjson&endpoint=https%3A%2F%2Ftrifid.creta-todos.lndo.site%2Fquery&requestMethod=POST&tabTitle=Query&headers=%7B%7D&outputFormat=rawResponse) will find the event representing
the earlier creation of "Ride Corbet's couloir" TO-DO item.

[as]: https://www.w3.org/TR/activitystreams-core/

</details>

## Reacting to events

<details><summary>🔍 Expand</summary>

The natural way to take advantage of events is to implement declarative handlers. Again, and unsurprisingly, they are simply
RDF resources which connect the kind of event to watch for with a piece of code which implements the additional action to
take.

For the sake of the simplest possible example, [this event handler](apps/todos/resources/_eventHandler/todoItem/updateList.ttl)
will react to TO-DO items being created. Its [implementation](packages/domain/todo-list.ts#L51-L78) updates the
containing list and in turn creates a new event accordingly.

</details>

## Try it!

<details><summary>🔍 Expand</summary>

Ensure local database is populated with new resources:

```
lando start
yarn bootstrap
```

Create another TO-DO:

```
curl -X POST \
     https://creta-todos.lndo.site/todos/list/bucket-list \
     -u tomasz:super-secret \
     -H content-type:text/turtle \
     --data '
     PREFIX schema: <http://schema.org/>
     
     <> schema:name "Trek Patagonia" .
     '
```

</details>

## Next step

[https://a.maze.link/kgc-tutorial-step-4](https://a.maze.link/kgc-tutorial-step-4)
