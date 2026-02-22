import React, { memo } from 'react';
import { useUndoRedo } from '../hooks/useUndoRedo'; 
import type { BoardState,Action } from '../types';
import '../styles.css';

interface UndoRedoControlsProps {
  state: BoardState;
  dispatch: React.Dispatch<Action>;
}

export const UndoRedoControls = memo<UndoRedoControlsProps>(function UndoRedoControls({
  state,
  dispatch,
}) {
  // ✅ USE THE HOOK
  const { canUndo, canRedo, historyLength, futureLength, undo, redo } = useUndoRedo(state, dispatch);

  return (
    <div className="undo-redo-controls">
      <button 
        className={`control-btn ${canUndo ? '' : 'disabled'}`}
        onClick={undo}  // ✅ Use hook's undo
        disabled={!canUndo}
        title={`Undo (${historyLength})`}
      >
        ↶ Undo
      </button>
      <button 
        className={`control-btn ${canRedo ? '' : 'disabled'}`}
        onClick={redo}  // ✅ Use hook's redo
        disabled={!canRedo}
        title={`Redo (${futureLength})`}
      >
        Redo ↷
      </button>
      <span>{historyLength} ↔ {futureLength}</span>
    </div>
  );
});
