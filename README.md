# Bridging the gap between business domains and Knowledge Graphs
### A Knowledge Graph Conference tutorial

## Step 5 - DDD-esque patterns, CQRS

Creta separates concerns by turning a resource namespace into its own API. In this tutorial we've had `/todos` and `/users`.
While the underlying Knowledge Graph is set up to combine all resources in a single database, the APIs and their concerns
are logically separated.

TL;DR;

[See what changed](https://github.com/hypermedia-app/kgc-hypermedia-app-tutorial/compare/step-4...step-5) since step 4

## API provenance

### Static resources

Talos, the CLI tool used to bootstrap APIs, automatically sets a `hydra:apiDocumentation` property to each inserted resource
graph. This serves the purpose of provenance, grouping all resources belonging to that API. Specifically, classes are
gathered at application start to build a model of available client-server interactions (hypermedia affordances).

For example, if we were to add an ACL authorization resource [/todos/api/authenticated-read-all](apps/todos/resources/api/authorization/authenticated-read-all.ttl)
which let every authenticated user permission to dereference any resource (provided any of its type is `rdfs:subClassOf rdfs:Resource`,
which may not be the default assumption in all reasoners).

### User-generated resources

On the other hand, resources created through client's requests to the API do not have that property set by default. If
necessary, this could be changed by combining the techniques shown previously:

1. Use [SHACL to require `hydra:apiDocumentation`](apps/todos/resources/api/Resource.ttl)
2. Use [resource hook](packages/api/resource.ts#L25-L29) to ensure it is set on TO-DO Lists
3. Use [member assertion](apps/todos/resources/api/TodoList.ttl#L21-L24) to ensure it is set on TO-DO Items

## Domain of a Bounded Context

As [summarized](https://martinfowler.com/bliki/BoundedContext.html) by Martin Fowler

> Bounded Context is a central pattern in Domain-Driven Design. It is the focus of DDD's strategic design section which 
> is all about dealing with large models and teams. DDD deals with large models by dividing them into different Bounded 
> Contexts and being explicit about their interrelationships. 
> [...]
> To be effective, a model needs to be unified - that is to be internally consistent so that there are no contradictions within it.

RDF can apply context-specific models inside a bounded by subclassing, as could be done to create a more specific class
of [`Person`](apps/users/resources/api/Person.ttl), mapped to a "core domain".

## CQRS applied to Knowledge Graph

CQRS stands for Command/Query Responsibility Segregation. At its core it means that reading from a database is separated
from writing to it. 

In the case of a Creta-based Knowledge Graph, most reads will be a simple SPARQL query over the union
graph. This is where inferencing or [Graph Per Aspect](https://patterns.dataincubator.org/book/graph-per-aspect.html)
pattern can be used to organize data but union graph builds a complete picture of the KG.

On the other hand, writing an individual resource representation happens in [its own named graph](https://patterns.dataincubator.org/book/graph-per-resource.html). 
This lets authors implement domain-specific rules which may otherwise be difficult to capture only using graph-y tools.
This corresponds with Domain Driven Design's [Aggregate pattern](https://martinfowler.com/bliki/DDD_Aggregate.html) which
defines a clear-cut boundary of resource integrity. Again, in the case of a Knowledge Graph as proposed, a resource's own
named graph would be treated as a whole.

For the sake of the example, let's [add a tags resource](apps/todos/resources.dev/item/buy-milk.ttl#L12-L15) as an entity
inside TO-DO item's aggregate. It has its own URI which means it can be addressed and dereferenced but any modifications
would have to go through the parent item (Aggregate Root).

## Try it!

<details><summary>🔍 Expand</summary>

Ensure local database is populated with new resources:

```
curl http://admin:password@db.creta-todos.lndo.site/repositories/creta-todos -X POST \
  --data 'update=delete+%7B+graph+%3Fg+%7B+%3Fs+%3Fp+%3Fo+%7D+%7D+where+%7B+graph+%3Fg+%7B+%3Fs+%3Fp+%3Fo+%7D+%7D'
yarn bootstrap
```

### Resource permissions

See that any resource in `/todos` namespace can be dereferenced

```
curl -I https://creta-todos.lndo.site/todos/api/TodoList -u tomasz:super-secret 
```

But not in `/users` namespace

```
curl -I https://creta-todos.lndo.site/users/user/tomasz -u tomasz:super-secret 
```

### API provenance

Re-create the TO-DO List

```
curl -X PUT \
     https://creta-todos.lndo.site/todos/list/bucket-list \
     -u tomasz:super-secret \
     -H content-type:text/turtle \
     --data '
     PREFIX schema: <http://schema.org/>
     
     <> a </todos/api/TodoList> ; schema:name "My bucket list" .
     '
 ```

Post a new TO-DO

```
curl -X POST \
     https://creta-todos.lndo.site/todos/list/bucket-list \
     -u tomasz:super-secret \
     -H content-type:text/turtle \
     --data '
     PREFIX schema: <http://schema.org/>
     
     <> schema:name "Ski Lenin Peak" .
     '
```

[Observe](http://trifid.creta-todos.lndo.site/sparql/#query=PREFIX+hydra%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fhydra%2Fcore%23%3E%0ABASE+%3Chttps%3A%2F%2Fcreta-todos.lndo.site%2Ftodos%2F%3E%0A%0Aselect+%3Fresource+%3Fdoc+%7B%0A++VALUES+%3Fresource+%7B+%3Citem%2FSki%2520Lenin%2520Peak%3E+%3Clist%2Fbucket-list%3E+%7D%0A++%3Fresource+hydra%3AapiDocumentation+%3Fdoc+.%0A%7D&contentTypeConstruct=text%2Fturtle&contentTypeSelect=application%2Fsparql-results%2Bjson&endpoint=http%3A%2F%2Ftrifid.creta-todos.lndo.site%2Fquery&requestMethod=POST&tabTitle=Query+1&headers=%7B%7D&outputFormat=table) that both are created with `hydra:apiDocumentation`

</details>


### Aggregates and entities

```
curl https://creta-todos.lndo.site/todos/item/buy-milk/tags
```

## Next step

[https://a.maze.link/kgc-tutorial-step-6](https://a.maze.link/kgc-tutorial-step-6)
