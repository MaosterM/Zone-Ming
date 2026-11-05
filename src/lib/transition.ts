import { createContext, useContext } from 'react'

/**
 * idle: no transition is running.
 * covering: slabs are sweeping in, or a new page is mounted behind them.
 * revealing: slabs are sweeping off, so a page intro can start.
 */
export type TransitionPhase = 'idle' | 'covering' | 'revealing'

export const TransitionContext = createContext<TransitionPhase>('idle')

export function useTransitionPhase() {
  return useContext(TransitionContext)
}
