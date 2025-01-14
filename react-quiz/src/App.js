import { useReducer, useState } from "react";
import Header from "./components/Header";
import data from './store/questions.json'
import Main from "./components/Main";
import DateCounter from "./components/DateCounter";

const initialState = {
  started: false,
  questions: null
}

function reducer(state, action){

  switch( state.type ){
    case 'startQuiz':
      return { started: true, questions: data}
    default: 
      throw new Error("Unknown action")
  }

}

function App() {
  const [state, dispatch] = useReducer( reducer, initialState)
  

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
