export default function StartScreen({
    numQuestions,
    onStart
}){
    function handleStart(){
        onStart()
    }

    return <div className="start">
        <h2>Welcome to The React Quiz!</h2>
        <h3>{numQuestions} question to test your React mastery</h3>
        <button className="btn" onClick={handleStart}>Let's start</button>
    </div>
}