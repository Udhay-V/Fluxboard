import { useCallback, useMemo } from 'react';
import type { Dispatch } from 'react';
import type { BoardState, Action } from '../types';

export interface UndoRedoState {
  canUndo: boolean;
  canRedo: boolean;
  historyLength: number;
  futureLength: number;
}

export function useUndoRedo(
  state: BoardState,
  dispatch: Dispatch<Action>
): UndoRedoState & {
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
} {
  const undo = useCallback(() => {
    if (state.history.length > 0) {
      dispatch({ type: 'UNDO' as const });
    }
  }, [dispatch, state.history.length]);

  const redo = useCallback(() => {
    if (state.future.length > 0) {
      dispatch({ type: 'REDO' as const });
    }
  }, [dispatch, state.future.length]);

  const clearHistory = useCallback(() => {
    dispatch({ 
      type: 'CLEAR_HISTORY' as const 
    });
  }, [dispatch]);

  const undoRedoState = useMemo((): UndoRedoState => ({
    canUndo: state.history.length > 0,
    canRedo: state.future.length > 0,
    historyLength: state.history.length,
    futureLength: state.future.length,
  }), [state.history.length, state.future.length]);

  return {
    ...undoRedoState,
    undo,
    redo,
    clearHistory,
  };
}
