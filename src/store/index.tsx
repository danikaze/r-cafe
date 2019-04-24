import * as React from 'react';
const { createContext, useContext, useReducer, useRef } = React;

export interface Props<S, E, A> {
  reducer: React.Reducer<S, A>;
  initialState: S;
  children: React.ReactNode;
  extraParams?: E;
}

export type ThunkDispatch<R, A> = (action: A) => R;

export type ThunkAction<R, S, E, A> = (
  dispatch: React.Dispatch<A>,
  getState: () => S,
  extraParams: E,
) => R;

function useThunkReducer<R, S, E, A>(
  reducer: React.Reducer<S, A>,
  initialState: S,
  extraParams: E,
): [S, ThunkDispatch<R, A>] {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(null);
  stateRef.current = state;
  const getState = () => stateRef.current;
  const thunk = (actionCreator) => {
    if (typeof actionCreator === 'function') {
      return actionCreator(dispatch, getState, extraParams);
    }
    return dispatch(actionCreator);
  };
  return [state, thunk];
}

export function createState<R, S, E, A>() {
  const StateContext = createContext<[S, ThunkDispatch<R, A>]>([undefined as S, undefined]);

  function StateProvider({ reducer, initialState, children, extraParams }: Props<S, E, A>) {
    return (
      <StateContext.Provider value={useThunkReducer<R, S, E, A>(reducer, initialState, extraParams)}>
        {children}
      </StateContext.Provider>
    );
  }

  function useStateValue() {
    return useContext(StateContext);
  }

  return {
    StateProvider,
    useStateValue,
  };
}
