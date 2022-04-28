import type { Shape } from '@rdfine/shacl'
import { sh } from '@tpluscode/rdf-ns-builders/strict'
import { GraphPointer } from 'clownface'
import { PropertyState } from '@hydrofoil/roadshow/lib/state'

type ShapeLike = PropertyState | Shape | GraphPointer

function getPointer(arg: ShapeLike) {
  if ('pointer' in arg) {
    return arg.pointer
  }

  if ('propertyShape' in arg) {
    return arg.propertyShape.pointer
  }

  return arg
}

export function byOrder(l: ShapeLike, r: ShapeLike): number {
  const lPointer = getPointer(l)
  const rPointer = getPointer(r)

  const leftOrder = parseInt(lPointer.out(sh.order).value || '0', 10) || 0
  const rightOrder = parseInt(rPointer.out(sh.order).value || '0', 10) || 0

  return leftOrder - rightOrder
}
