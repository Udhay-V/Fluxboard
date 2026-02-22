import type { BoardState, Action, TaskId, Order, AddTaskPayload, Task } from './types';

export const defaultState: BoardState = {
    tasks: {},
    order: { todo: [], inProgress: [], done: [] },
    filters: { text: '', priority: null },
    history: [],
    future: [],
};

export function boardReducer(state: BoardState, action: Action): BoardState {
    const isDev = import.meta.env.DEV === true;
    if (isDev) {
        Object.freeze(state);
    }

    switch (action.type) {
        case 'ADD_TASK': {
            const { title, description = '', priority }: AddTaskPayload = action.payload;
            const id: TaskId = crypto.randomUUID();
            const task: Task = {
                id,
                title,
                description,
                status: 'todo' as const,
                priority,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };

            return {
                ...state,
                tasks: { ...state.tasks, [id]: task },
                order: {
                    ...state.order,
                    todo: [...state.order.todo, id],
                },
                history: [createHistorySnapshot(state)],
                future: [],
            };
        }

        case 'UPDATE_TASK': {
            const task = state.tasks[action.payload.id];
            if (!task) return state;

            const updatedTask = {
                ...task,
                ...action.payload.updates,
                updatedAt: Date.now(),
            };

            return {
                ...state,
                tasks: { ...state.tasks, [action.payload.id]: updatedTask },
                history: [createHistorySnapshot(state)],
                future: [],
            };
        }

        case 'DELETE_TASK': {
            const newTasks = { ...state.tasks };
            delete newTasks[action.payload];

            const newOrder: Order = {
                todo: state.order.todo.filter(id => id !== action.payload),
                inProgress: state.order.inProgress.filter(id => id !== action.payload),
                done: state.order.done.filter(id => id !== action.payload),
            };

            return {
                ...state,
                tasks: newTasks,
                order: newOrder,
                history: [createHistorySnapshot(state)],
                future: [],
            };
        }

        case 'MOVE_TASK': {
            const { id, sourceStatus, targetStatus, targetIndex } = action.payload;
            const updatedTask = {
                ...state.tasks[id],
                status: targetStatus as any,
                updatedAt: Date.now()
            };
            if (sourceStatus === targetStatus) {
                const sourceIds = [...state.order[sourceStatus]];
                const fromIndex = sourceIds.indexOf(id);
                if (fromIndex === -1) return state;

                const newSourceIds = [...sourceIds];
                newSourceIds.splice(fromIndex, 1);
                newSourceIds.splice(targetIndex, 0, id);

                return {
                    ...state,
                    tasks: { ...state.tasks, [id]: updatedTask },
                    order: {
                        ...state.order,
                        [sourceStatus]: newSourceIds,
                    },
                    history: [createHistorySnapshot(state)],
                    future: [],
                };
            } else {
                const newOrder: Order = {
                    ...state.order,
                    [sourceStatus]: state.order[sourceStatus].filter(tid => tid !== id),
                    [targetStatus]: insertAt(state.order[targetStatus], id, targetIndex),
                };

                return {
                    ...state,
                    order: newOrder,
                    history: [createHistorySnapshot(state)],
                    future: [],
                };
            }
        }

        case 'SET_FILTERS':
            return { ...state, filters: action.payload };

        case 'UNDO': {
            if (state.history.length === 0) return state;
            const previous = state.history[state.history.length - 1];
            return {
                ...previous,
                history: state.history.slice(0, -1),
                future: [createHistorySnapshot(state), ...state.future].slice(0, 15),
            };
        }

        case 'REDO': {
            if (state.future.length === 0) return state;
            const next = state.future[0];
            return {
                ...next,
                history: [...state.history, createHistorySnapshot(state)].slice(0, 15),
                future: state.future.slice(1),
            };
        }

        case 'HYDRATE': {
            return validateState(action.payload) ? action.payload : defaultState;
        }

        case 'CLEAR_HISTORY': {
            return {
                ...state,
                history: [],
                future: [],
            };
        }

        default:
            return state;
    }
}

function createHistorySnapshot(state: BoardState): Omit<BoardState, 'history' | 'future'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { history, future, ...snapshot } = state;
    return {
        ...snapshot,
        tasks: { ...snapshot.tasks },
        order: {
            todo: [...snapshot.order.todo],
            inProgress: [...snapshot.order.inProgress],
            done: [...snapshot.order.done],
        },
    };
}

function insertAt<T>(arr: T[], item: T, index: number): T[] {
    return [...arr.slice(0, index), item, ...arr.slice(index)];
}

export function validateState(state: any): state is BoardState {
    try {
        return (
            state &&
            typeof state === 'object' &&
            typeof state.tasks === 'object' &&
            Object.values(state.tasks || {}).every((task: any) =>
                typeof task?.id === 'string' &&
                typeof task?.title === 'string'
            ) &&
            typeof state.filters?.text === 'string' &&
            Array.isArray(state.order?.todo)
        );
    } catch {
        return false;
    }
}
