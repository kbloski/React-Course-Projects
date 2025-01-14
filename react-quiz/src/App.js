import { useEffect, useReducer, useState } from "react";
import { useQuestions } from "./hooks/useQuestions";
import Header from "./components/Header";
import Loader from './components/Loader'
import Error from './components/Error'
import Main from "./components/Main";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question"; 
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";

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
                  ? (state.points = state.points +  question.points)
                  : state.points,
      };
    case 'nextQuestion':
      return {
        ...state,
        answer: null,
        questionIndex: ++state.questionIndex
      }
    default: 
      throw new Error("Unknown action")
  }

}

function App() {
  const [{status, questions, questionIndex, answer, points}, dispatch] = useReducer( reducer, initialState)
  const { questions : dataQuestions , isLoading, error } = useQuestions()
  const maxPossiblePoints = !!questions.length ? questions.reduce( (acc, question) => acc += question.points, 0) : 0
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
              { status === 'active' && <>
                <Progress index={questionIndex} numQuestions={numQuestions} points={points} maxPossiblePoints={maxPossiblePoints} answer={answer}/>
                <Question 
                
                  question={questions[questionIndex]} 
                  answer={answer}
                  dispatch={dispatch}
                />
                <NextButton dispatch={dispatch} answer={answer} />
              </> 
              }
          </Main>
      </div>
  );
}

export default App;
