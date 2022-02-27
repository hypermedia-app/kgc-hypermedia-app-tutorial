declare module '*.ttl' {
  import { Quad, DataFactory } from 'rdf-js'

  export default function (arg: { factory: DataFactory }): Quad[]
}
