# Bridging the gap between business domains and Knowledge Graphs
### A Knowledge Graph Conference tutorial

## Step 4 - resource updates

Most APIs and, by extension, Knowledge Graphs are not append-only. API client will modify resources by sending 

TL;DR;

[See what changed](https://github.com/hypermedia-app/kgc-hypermedia-app-tutorial/compare/step-3...step-4) since step 3

## Modifying TO-DO items

<details><summary>🔍 Expand</summary>

To update a resource we will implement the HTTP `PUT` method, which requires that a new resource representation is
sent to the server. This is done by [annotating the given class](apps/todos/resources/api/TodoItem.ttl#L44-L54) with a
supported operation implemented by `@hydrofoil/knossos/resource#PUT`.

In the case of the `/api/TodoItem` class, it could be desired to additionally prevent modifications of `acl:owner` and
`schema:isPartOf` properties. 

There is no default support for such a feature, yet, but Creta makes is simple enough. By implementing a [BeforeSave hook](https://creta.hypermedia.app/#/advanced/hooks?id=before-save-hook), implementors can perform additional logic which access the original and modified
representations of the resource.

To prevent changes to select properties, they can be [annotated in the SHACL shape](apps/todos/resources/api/TodoItem.ttl#L28)
using the `dash:readOnly` predicate. The [hook's](apps/todos/resources/api/TodoItem.ttl#L56-L59) [implementation](packages/api/resource.ts#L6-L21)
then looks up properties annotated this way, find the values and compares between the "before" and "after" resource state.

</details>

## Try it!

<details><summary>🔍 Expand</summary>

Ensure local database is populated with new resources:

```
lando start
yarn bootstrap
```

Mark a TO-DO as complete

```
curl -X PUT \
     https://creta-todos.lndo.site/todos/item/Ride%20Corbet%27s%20couloir \
     -u tomasz:super-secret \
     -H content-type:text/turtle \
     --data '
     PREFIX schema: <http://schema.org/>
     PREFIX acl: <http://www.w3.org/ns/auth/acl#>

     <> 
       a </todos/api/TodoItem> ;
       schema:name "Ride Corbet'"'"'s couloir" ;
       schema:isPartOf </todos/list/bucket-list> ;
       schema:status "COMPLETED" ;
       acl:owner </users/user/tomasz> ;
     .
     '
```

Check that [status was updated](http://trifid.creta-todos.lndo.site/sparql/#query=PREFIX+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E%0Aask+%7B%0A++%3Chttps%3A%2F%2Fcreta-todos.lndo.site%2Ftodos%2Flist%2Fbucket-list%3E+schema%3Astatus+%22COMPLETED%22+%0A%7D%0A%0A&contentTypeConstruct=text%2Fturtle&contentTypeSelect=application%2Fsparql-results%2Bjson&endpoint=http%3A%2F%2Ftrifid.creta-todos.lndo.site%2Fquery&requestMethod=POST&tabTitle=Query+2&headers=%7B%7D&outputFormat=rawResponse)

</details>

## Next step

[https://a.maze.link/kgc-tutorial-step-5](https://a.maze.link/kgc-tutorial-step-5)
