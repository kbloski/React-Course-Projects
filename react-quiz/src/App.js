import { useEffect, useReducer, useState } from "react";
import { useQuestions } from "./hooks/useQuestions";
import Header from "./components/Header";
import Loader from './components/Loader'
import Error from './components/Error'
import Main from "./components/Main";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question"; 

const initialState = {
  status: 'loading',
  questions: [],
  questionIndex: 0,
  answer: null,
  points: 0
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
      return {
        ...state,
        status: 'active' 
      }
    case 'newAnswer':

      const question = state.questions[ state.questionIndex]

      return {
          ...state,
          answer: action.payload,
          points: action.payload === question.correctOption
                  ? (state.points += question.points)
                  : state.points,
      };
    default: 
      throw new Error("Unknown action")
  }

}

function App() {
  const [{status, questions, questionIndex, answer}, dispatch] = useReducer( reducer, initialState)
  const { questions : dataQuestions , isLoading, error } = useQuestions()
  const numQuestions = questions.length;

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
              { status === 'ready' && <StartScreen numQuestions={numQuestions} onStart={() => dispatch({ type: 'startQuiz'}) }/>}
              { status === 'active' && <Question 
                question={questions[questionIndex]} 
                answer={answer}
                dispatch={dispatch}
              />}
          </Main>
      </div>
  );
}

export default App;
