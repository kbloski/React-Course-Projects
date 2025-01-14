import { useState } from "react";
import Header from "./components/Header";
import data from './store/questions.json'
import DateCounter from "./components/DateCounter";


function App() {
  const [questions, setQuestions] = useState( data );

  return (
    <div className="App">
      <Header />
      <DateCounter />
      
    </div>
  );
}

export default App;
