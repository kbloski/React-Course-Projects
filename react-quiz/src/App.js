import { useEffect, useReducer, useState } from "react";
import Header from "./components/Header";
// import data from './store/questions.json'

import Main from "./components/Main";
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

  useEffect( () => {
    fetch('/api/questions.json')
    .then( res => {
      if (!res.ok) throw new Error("Error load questions")

      return res.json()
    }).then( questions => dispatch({ type: 'setQuestions', payload: questions}))
    .catch(err => {
      console.error(err)
    })
  })

  return (
      <div className="app">
          <Header />
          <Main>
              <p>1/15</p>
              <p>Questions?</p>
          </Main>
      </div>
  );
}

export default App;
