import { useEffect, useReducer } from "react";
import { useQuestions } from "./hooks/useQuestions";
import Header from "./components/Header";
import Footer from './components/Footer.js'
import Loader from './components/Loader'
import Error from './components/Error'
import Main from "./components/Main";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question"; 
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Timer from "./components/Timer.js";


const initialState = {
  status: 'loading',
  questions: [],
  questionIndex: 0,
  answer: null,
  points: 0,
  highscore: 0,
  maxQuizTime: 300
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
          questionIndex: ++state.questionIndex,
      };

    case 'finish':
      return { 
        ...state,
        status: 'finished',
        highscore: state.points > state.highscore ? state.points : state.highscore
      }
    case 'restart':
      return {
        ...initialState,
        questions: state.questions,
        status: 'ready',
        highscore: state.highscore
      }
    default: 
      throw new Error("Unknown action")
  }

}

function App() {
  const [{status, questions, questionIndex, answer, points, highscore, maxQuizTime}, dispatch] = useReducer( reducer, initialState)
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
              {status === "loading" && <Loader />}
              {status === "error" && <Error />}
              {status === "ready" && (
                  <StartScreen
                      numQuestions={numQuestions}
                      onStart={() => dispatch({ type: "startQuiz" })}
                  />
              )}
              {status === "active" && (
                  <>
                      <Progress
                          index={questionIndex}
                          numQuestions={numQuestions}
                          points={points}
                          maxPossiblePoints={maxPossiblePoints}
                          answer={answer}
                      />
                      <Question
                          question={questions[questionIndex]}
                          answer={answer}
                          dispatch={dispatch}
                      />
                      <Footer>
                          <Timer
                              dispatch={dispatch}
                              maxTime={maxQuizTime}
                          />
                          <NextButton
                              dispatch={dispatch}
                              answer={answer}
                              index={questionIndex}
                              numQuestions={numQuestions}
                          />
                      </Footer>
                  </>
              )}
              {status === "finished" && (
                  <FinishScreen
                      points={points}
                      maxPossiblePoints={maxPossiblePoints}
                      highscore={highscore}
                      dispatch={dispatch}
                  />
              )}
          </Main>
      </div>
  );
}

export default App;
