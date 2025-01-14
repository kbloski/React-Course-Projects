import { useEffect, useReducer, useState } from "react";
import { useQuestions } from "./hooks/useQuestions";
import Header from "./components/Header";
import Loader from './components/Loader'
import Error from './components/Error'
import Main from "./components/Main";
import StartScreen from "./components/StartScreen";

const initialState = {
  status: 'loading',
  questions: null
}

function reducer(state, action){
  switch( action.type ){
    case 'dataReceived':
      return { 
        ...state, 
        questions: action.payload,
        status: 'ready'
      }
    case 'dataFailed':
      return {
        ...state,
        status: 'error'
      }
    case 'startQuiz':
      return { started: true, questions: []}
    default: 
      throw new Error("Unknown action")
  }

}

function App() {
  const [{status, questions}, dispatch] = useReducer( reducer, initialState)
  const { questions : dataQuestions , isLoading, error } = useQuestions()

  useEffect(() => {
    if (error){
      return dispatch({ type: "dataFailed" });
    } 
    else if (dataQuestions){
      return dispatch({ type: "dataReceived", payload: dataQuestions });
    }
  }, [dataQuestions, error]);
  

  return (
      <div className="app">
          <Header />
          <Main>
              { status === 'loading' && <Loader />}
              { status === 'error' && <Error />}
              { status === 'ready' && <StartScreen />}
          </Main>
      </div>
  );
}

export default App;
