
import { useReducer, useEffect } from 'react';
import { boardReducer, defaultState } from '../reducer';
import { Column } from './Column';
import { FiltersPanel } from './FiltersPanel';
import { UndoRedoControls } from './UndoRedoControls';
import { useDebouncedLocalStorage } from '../hooks/useDebouncedLocalStorage';
import { useGlobalLiveTimer } from '../hooks/useGlobalLiveTimer';
import type { Order, PersistableState } from '../types';

export function Board() {
    const now = useGlobalLiveTimer();
    const [state, dispatch] = useReducer(boardReducer, defaultState);
    const [persistedState, setPersistedState] = useDebouncedLocalStorage<PersistableState>(
        'fluxboard',
        { tasks: {}, order: { todo: [], inProgress: [], done: [] }, filters: { text: '', priority: null } }
    );

    useEffect(() => {
        if (Object.keys(persistedState.tasks || {}).length > 0) {
            dispatch({
                type: 'HYDRATE',
                payload: {
                    tasks: persistedState.tasks,
                    order: persistedState.order,
                    filters: persistedState.filters,
                    history: [],
                    future: []
                }
            });
        }
    }, [persistedState, dispatch]);

    useEffect(() => {
        const persistable: PersistableState = {
            tasks: state.tasks,
            order: state.order,
            filters: state.filters
        };
        setPersistedState(persistable);
    }, [state.tasks, state.order, state.filters, setPersistedState]);

    const addTask = () => {
        dispatch({
            type: 'ADD_TASK',
            payload: {
                title: `New Task #${Date.now().toString().slice(-4)}`,
                description: 'Click to edit',
                priority: (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3,
                status: 'todo'
            },
        });
    };

    // const addPriorityTask = (priority: number) => {
    //     dispatch({
    //         type: 'ADD_TASK',
    //         payload: {
    //             title: `${priority === 1 ? 'LOW' : priority === 2 ? 'MEDIUM' : 'HIGH'} Test`,
    //             description: `Priority ${priority}`,
    //             priority: priority as 1 | 2 | 3,
    //             status: 'todo'
    //         },
    //     });
    // };
    const statusOrder: (keyof Order)[] = ['todo', 'inProgress', 'done'];

    return (
        <div className="app"  style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header className="app-header">
                <h1>FluxBoard</h1>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button className="add-task-btn" onClick={addTask}>
                        + New Task
                    </button>
                    {/* <button 
                        onClick={() => addPriorityTask(1)} 
                        style={{ padding: '8px 12px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '6px' }}
                    >
                        Add LOW
                    </button>
                    <button 
                        onClick={() => addPriorityTask(2)} 
                        style={{ padding: '8px 12px', background: '#ff9800', color: 'white', border: 'none', borderRadius: '6px' }}
                    >
                        Add MED
                    </button>
                    <button 
                        onClick={() => addPriorityTask(3)} 
                        style={{ padding: '8px 12px', background: '#f44336', color: 'white', border: 'none', borderRadius: '6px' }}
                    >
                        Add HIGH
                    </button> */}
                </div>
            </header>

            <FiltersPanel
                filters={state.filters}
                onFiltersChange={(filters) => dispatch({ type: 'SET_FILTERS', payload: filters })}
            />

            <main className="board">
                <div className="columns">
                    {statusOrder.map(status => (
                        <Column
                            key={status}
                            status={status}
                            taskIds={state.order[status]}
                            tasks={state.tasks}
                            filters={state.filters}
                            now={now}
                            dispatch={dispatch}
                        />
                    ))}
                </div>
            </main>

            <UndoRedoControls state={state} dispatch={dispatch} />
        </div>
    );
}
