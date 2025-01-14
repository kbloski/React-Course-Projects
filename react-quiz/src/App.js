import { useEffect, useReducer, useState } from "react";
import Header from "./components/Header";
import Loader from './components/Loader'
// import data from './store/questions.json'

import Main from "./components/Main";
import { useQuestions } from "./hooks/useQuestions";
// import DateCounter from "./components/DateCounter";

const initialState = {
  started: false,
  questions: null
}

function reducer(state, action){
  switch( action.type ){
    case 'setQuestions':
      return { ...state, questions: action.payload}
    case 'startQuiz':
      return { started: true, questions: []}
    default: 
      throw new Error("Unknown action")
  }

}

function App() {
  const [state, dispatch] = useReducer( reducer, initialState)
  const { questions , isLoading, error } = useQuestions()

  useEffect( () => {
    // console.log( questions)
    if (!questions) return;
    dispatch({type: 'setQuestions', payload: questions})
  }, [questions])
  

  return (
      <div className="app">
          <Header />
          <Main>
              { !!isLoading && <Loader />}
              { !isLoading && <>
                <p>1/15</p>
                <p>Questions?</p>
                { JSON.stringify( state.questions ) }
              </>}
          </Main>
      </div>
  );
}

export default App;
