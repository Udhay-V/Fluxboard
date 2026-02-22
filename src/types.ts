export type TaskId = string;

export type Task = {
  id: TaskId;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: 1 | 2 | 3;
  createdAt: number;
  updatedAt: number;
};

export type Order = {
  todo: TaskId[];
  inProgress: TaskId[];
  done: TaskId[];
};

export type Filters = {
  text: string;
  priority: number | null;
};

export type BoardSnapshot = {
  tasks: Record<TaskId, Task>;
  order: Order;
  filters: Filters;
};

export type BoardState = {
  tasks: Record<TaskId, Task>;
  order: Order;
  filters: Filters;
  history: BoardSnapshot[];
  future: BoardSnapshot[];
};

export type PersistableState = {
  tasks: Record<TaskId, Task>;
  order: Order;
  filters: Filters;
};

export type AddTaskPayload = {
    title: string;
    description?: string;
    priority: 1 | 2 | 3;
};

export type Action =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_TASK'; payload: { id: TaskId; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: TaskId }
  | { type: 'MOVE_TASK'; payload: { id: TaskId; sourceStatus: keyof Order; targetStatus: keyof Order; targetIndex: number } }
  | { type: 'SET_FILTERS'; payload: Filters }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'HYDRATE'; payload: BoardState }  
  | { type: 'CLEAR_HISTORY' };               
