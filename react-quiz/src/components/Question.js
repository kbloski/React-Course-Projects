export default function Question({
    question,
    dispatch,
    answer
}){
    function handleClickOption( index ){
        dispatch({ type: 'newAnswer', payload: index})
    }
    const hasAnswered = answer !== null;

    return (
        <div>
            <h4>{question.question}</h4>
            <div className="questions">
                {question.options.map((option, index) => (
                    <Option
                        option={option}
                        className={`${index === answer && 'answer'} ${
                            hasAnswered ? (index === question.correctOption ? 'correct' : 'wrong') : ''}`}
                        disabled={ hasAnswered }
                        onClick={() => handleClickOption(index)}
                    />
                ))}
            </div>
            {JSON.stringify(question)}
        </div>
    );
}

function Option({option, onClick, disabled, className}){
    return <button 
        className={`btn btn-option ${className}`}
        disabled={disabled}
        key={option} 
        onClick={onClick}
    >
            {option}
        </button>
}