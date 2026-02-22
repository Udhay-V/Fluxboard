import { useMemo } from 'react';
import type { Task, Filters } from '../types';

export function useTaskFilters(
  tasks: Record<string, Task>, 
  filters: Filters
): string[] {
  return useMemo(() => {
    return Object.entries(tasks)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, task]) => {
        const matchesText = filters.text === '' || 
          task.title.toLowerCase().includes(filters.text.toLowerCase()) ||
          task.description.toLowerCase().includes(filters.text.toLowerCase());
        
        const matchesPriority = filters.priority === null || task.priority === filters.priority;
        
        return matchesText && matchesPriority;
      })
      .map(([id]) => id)

  }, [tasks, filters.text, filters.priority]); 
}


