import type * as rdx from '@captaincodeman/rdx'
import { create } from '@hydrofoil/shell'
import { config } from './config'

export const store = create(config)

export type State = rdx.StoreState<typeof config>
export type Dispatch = rdx.StoreDispatch<typeof config>
export type Store = rdx.ModelStore<Dispatch, State>

export type DispatchParam<M extends keyof Dispatch, D extends keyof Dispatch[M]>
  = Dispatch[M][D] extends (...arg: any[]) => any ? Parameters<Dispatch[M][D]>[0] : never
