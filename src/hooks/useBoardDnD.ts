import { useCallback, useRef } from 'react';
import type { Dispatch } from 'react';
import type { Action, Order, TaskId } from '../types';

export function useBoardDnD(dispatch: Dispatch<Action>) {
  const dragStateRef = useRef<{
    draggedId: TaskId | null;
    sourceStatus: keyof Order | null;
  }>({ draggedId: null, sourceStatus: null });

  const handleDragStart = useCallback((
    e: React.DragEvent, 
    id: TaskId, 
    status: keyof Order
  ) => {
    dragStateRef.current = { draggedId: id, sourceStatus: status };
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({ id, status })); // ✅ Store full data
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((
    e: React.DragEvent, 
    targetStatus: keyof Order, 
    targetIndex: number = 0
  ) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData('application/json');
      const { id, status: sourceStatus } = JSON.parse(data);
      
      if (id && sourceStatus) {
        dispatch({
          type: 'MOVE_TASK' as const,
          payload: { id, sourceStatus, targetStatus, targetIndex },
        });
      }
    } catch {
      // Fallback to ref data
      const { draggedId, sourceStatus } = dragStateRef.current;
      if (draggedId && sourceStatus) {
        dispatch({
          type: 'MOVE_TASK' as const,
          payload: { id: draggedId, sourceStatus, targetStatus, targetIndex },
        });
      }
    }
    dragStateRef.current = { draggedId: null, sourceStatus: null };
  }, [dispatch]);

  return { handleDragStart, handleDragOver, handleDrop };
}
