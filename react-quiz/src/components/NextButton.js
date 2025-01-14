export default function NextButton({dispatch, answer}){
    if (answer === null ) return null;

    function handleClick(){
        dispatch({ type: "nextQuestion" });
    }

    return <button className="btn btn-ui" onClick={handleClick}>NextButton</button>
}