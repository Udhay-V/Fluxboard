import React, { memo, useState, useRef, useCallback } from 'react';
import { TaskCard } from './TaskCard';
import { useTaskFilters } from '../hooks/useTaskFilters'; 
import type { Action, Order, TaskId, Task, Filters } from '../types';
import type { Dispatch } from 'react';
import '../styles.css';

interface ColumnProps {
  status: keyof Order;
  taskIds: TaskId[];
  tasks: Record<TaskId, Task>;
  filters: Filters;
  now: number;
  dispatch: Dispatch<Action>;
}

export const Column = memo<ColumnProps>(function Column({
  status,
  taskIds,
  tasks,
  filters, 
  now,
  dispatch,
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const allFilteredIds = useTaskFilters(tasks, filters);
  const visibleIds = taskIds.filter(id => allFilteredIds.includes(id));

  const handleDragStart = useCallback((e: React.DragEvent, id: TaskId, sourceStatus: keyof Order) => {
    e.dataTransfer.setData('text/plain', `${sourceStatus}:${id}`);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetStatus: keyof Order) => {
    e.preventDefault();
    const [sourceStatus, id] = e.dataTransfer.getData('text/plain').split(':') as [keyof Order, TaskId];

    if (id && sourceStatus) {
      const targetIndex = visibleIds.length;
      dispatch({
        type: 'MOVE_TASK',
        payload: { id, sourceStatus, targetStatus, targetIndex }
      });
    }
  }, [dispatch, visibleIds.length, status]); 

  const getTimeAgo = useCallback((timestamp: number) => {
    const diff = Math.floor((now - timestamp) / 1000);
    return diff < 60 ? `${diff}s` : `${Math.floor(diff / 60)}m`;
  }, [now]);

  const itemHeight = 80;
  const viewportHeight = 600;
  const visibleCount = Math.ceil(viewportHeight / itemHeight) + 2;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 1);
  const endIndex = Math.min(visibleIds.length, startIndex + visibleCount);
  const renderIds = visibleIds.slice(startIndex, endIndex);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div className="column-container">
      <h2 className="column-title">
        {status.replace('-', ' ').toUpperCase()} ({visibleIds.length})
      </h2>
      <div
        ref={containerRef}
        className="column"
        style={{ height: viewportHeight, overflow: 'auto' }}
        onScroll={handleScroll}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
      >
        <div style={{ height: visibleIds.length * itemHeight, position: 'relative' }}>
          {renderIds.map((id, idx) => {
            const task = tasks[id];
            if (!task) return null;

            const globalIdx = startIndex + idx;
            const top = globalIdx * itemHeight;
            const timeAgo = getTimeAgo(task.updatedAt);

            return (
              <div key={id} style={{ position: 'absolute', top, width: '100%' }}>
                <TaskCard
                  task={task}
                  timeAgo={timeAgo}
                  status={status}
                  onDragStart={(e) => handleDragStart(e, id, status)}
                  onDelete={(taskId) => dispatch({ type: 'DELETE_TASK', payload: taskId })}
                  onUpdate={(update) => dispatch({ type: 'UPDATE_TASK', payload: update })}
                />
              </div>
            );
          })}
          {visibleIds.length === 0 && (
            <div className="empty-column" style={{ 
              height: viewportHeight, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#666' 
            }}>
              {taskIds.length === 0 ? 'Drop tasks here' : 'No tasks match filter'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
