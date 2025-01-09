import { useState } from "react";
import PropTypes from 'prop-types'
import "./StarRating.scss"

StarRating.propTypes = {
    maxRating: PropTypes.number , 
    color: PropTypes.string,
    size: PropTypes.number ,
    className: PropTypes.string,
    messages: PropTypes.array,
    onSetRating: PropTypes.func
}

export default function StarRating(
    { 
        maxRating = 5 , 
        color = "#FCC419",
        size = 30,
        className='',
        messages=[],
        onSetRating
    }
){

    const [raiting, setRaiting] = useState(0);
    const [tempRating, setTemRating] = useState(0)

    function handleRating( num ){
        setRaiting( num )

        if (onSetRating) onSetRating( val => num)
    }

    return (
        <div className={`container ${className}`}>
            <div className="star-container">
                {Array.from({ length: maxRating }).map((_, index) => (
                    <Star
                        color={color}
                        size={size}
                        key={index}
                        onClick={() => handleRating(index + 1)}
                        onHoverIn={() => setTemRating(index + 1)}
                        onHoverOut={() => setTemRating(0)}
                        isFull={
                            tempRating ? index < tempRating : index < raiting
                        }
                    />
                ))}
            </div>
            <p className="textStyle" style={{ color, fontSize: size }}>
                {!tempRating && !!messages.length &&
                    messages[
                        Math.ceil((messages.length * raiting) / maxRating) - 1
                    ]}
                &nbsp;
                {tempRating ? tempRating : raiting || ""}
            </p>
        </div>
    );
}

function Star({ onClick, isFull = false, onHoverIn, onHoverOut, color = '#000', size=48}){

    const starStyle = {
        width: `${size}px`,
        height: `${size}px`,
    }

    return (
        <span className="star" 
            style={ starStyle }
            onClick={onClick}
            onMouseEnter={ onHoverIn }
            onMouseLeave={ onHoverOut }
        >
            {isFull ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill={ color }
                    stroke={ color }
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke={color}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="{2}"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                </svg>
            )}
        </span>
    );
    
}