# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

// IMMUTABLE - New objects/arrays each time
return {
  ...state,
  tasks: { ...state.tasks, [id]: task },     // New tasks object
  order: { ...state.order, todo: [...todo, id] }, // New order + new array
  history: [createHistorySnapshot(state)],   // New history array
  future: [],
};

function createHistorySnapshot(state: BoardState): BoardStateSnapshot {
  return {
    ...state,
    tasks: { ...state.tasks },                    // Shallow clone tasks
    order: {
      todo: [...state.order.todo],               // NEW arrays
      inProgress: [...state.order.inProgress],
      done: [...state.order.done],
    },
  };
}

const undoRedoState = useMemo((): UndoRedoState => ({
  canUndo: state.history.length > 0,
  canRedo: state.future.length > 0,
  historyLength: state.history.length,
  futureLength: state.future.length,
}), [state.history.length, state.future.length]); // PRIMITIVE deps only

export const UndoRedoControls = memo<UndoRedoControlsProps>(function UndoRedoControls({
  state, dispatch
}) {
  // Only re-renders when canUndo/canRedo changes
});

// Add this button to Board.tsx temporarily
<button onClick={staleClosureTest}>Test Stale Closure</button>

const staleClosureTest = useCallback(() => {
  // 1. Create rapid state changes
  for (let i = 0; i < 10; i++) {
    setTimeout(() => addTask(), i * 50); // 10 tasks in 500ms
  }
  
  // 2. Immediately test undo after 600ms
  setTimeout(() => {
    console.log('History length:', state.history.length); // Should be 10
    undo(); // Should work
  }, 600);
}, [state.history.length]); // STALE CLOSURE if deps wrong!


```
