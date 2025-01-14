export default function Question({
    question
}){
    return <div>
        <h4>{question.question}</h4>
        <div className="questions">
            { question.options.map( option => <Option option={option} />)}
        </div>
        { JSON.stringify(question)}
    </div>;
}

function Option({option}){
    return <button className="btn btn-option" key={option}>
            {option}
        </button>
}