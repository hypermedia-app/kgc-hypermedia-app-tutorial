# Bridging the gap between business domains and Knowledge Graphs
### A Knowledge Graph Conference tutorial

## Step 2 - authenticating user, creating TO-DO lists and items

To actually take advantage of authorization rules it is necessary to authenticate the caller to the API. This step will
actually use a special case of authorizing resource owners, thus removing the `acl:Authorization` from the picture.

TL;DR;

[See what changed](https://github.com/hypermedia-app/kgc-hypermedia-app-tutorial/compare/step-1...step-2) since step 1

## Authentication

<details>
  <summary>🔍 Expand</summary>

This is the first example of functionalities which require JavaScript code. It is, naturally, referenced in RDF from the
configuration resource [/api/config](apps/todos/resources/api/config.ttl#L9-L17).

The crucial detail of the [implementation](packages/auth/index.js#L29-L31), regardless of the used method, is to set
the agent resource to the request when authentication succeeds.

```typescript
const agent = authenticateUser()

if (agent.term) {
  req.agent = agent
}
```

</details>

## Creating a new TO-DO list

<details>
  <summary>🔍 Expand</summary>

To create a new list, the API will allow clients to `PUT` its representation. Multiple conditions must be met for this to happen:

1. Agent must be [authorized](apps/todos/resources/api/authorization/authenticated-create-lists.ttl) to do so. Here it's allowing any authenticated agent to create lists
2. The class must [be SHACL Node Shape](apps/todos/resources/api/TodoList.ttl#L13)
3. The class must [be explicitly annotated with `knossos:createWithPUT true`](apps/todos/resources/api/TodoList.ttl#L28)

</details>

## POST-ing items to TO-DO lists

<details>
  <summary>🔍 Expand</summary>

To create TO-DO items, we will use `POST` to submit their representations to the collection. The `TodoList` class must
explicitly [support such operation](apps/todos/resources/api/TodoList.ttl#L38-L50) (via `hydra:supportedOperation`).

Because the collection is the target of the request, it is up to the server to assign an identifier to the newly created
TO-DO item. They will be minted by filling an [RFC6570 URI Template](https://datatracker.ietf.org/doc/html/rfc6570) according
to the description provided by collection's [`knossos:memberTemplate` property](apps/todos/resources/api/TodoList.ttl#L51-L61).

Unlike previous examples, there is no `acl:Authorization` for creating TO-DO items. Instead, every list's owner will have
full permission to access it (within the limitations of supported operations).

</details>

## Try it!

<details>
  <summary>🔍 Expand</summary>

Ensure local database is populated with new resources:

```
lando start
yarn bootstrap
```

Create a new TO-DO list:

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

Create a new TO-DO:

```
curl -X POST \
     https://creta-todos.lndo.site/todos/list/bucket-list \
     -u tomasz:super-secret \
     -H content-type:text/turtle \
     --data '
     PREFIX schema: <http://schema.org/>
     
     <> schema:name "Ride Corbet'"'"'s couloir" .
     '
```

See that it both got created as expected:

```shell
curl https://creta-todos.lndo.site/todos/list/bucket-list
curl https://creta-todos.lndo.site/todos/item/Ride%20Corbet%27s%20couloir
```

</details>

## "Filling in the blanks"

<details>
  <summary>🔍 Expand</summary>

If you look closely at the resource definitions and examples above, you will notice that not all properties required by the
respective SHACL shapes of TO-DO List and TO-DO Item are actually transmitted. They are instead set automatically based on
the request information inside [resource hooks](https://creta.hypermedia.app/#/advanced/hooks).

For example, the [`setOwner` function](packages/domain/todo-list.ts#L22-L26) sets the currently authenticated agent's as
object of `acl:owner`. This is important for authorizing creation of new TO-DO items as mentioned above.

</details>

## Next step

[https://a.maze.link/kgc-tutorial-step-3](https://a.maze.link/kgc-tutorial-step-3)
