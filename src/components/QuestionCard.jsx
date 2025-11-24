import React, { useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

const QuestionCard = ({ question, showAnswer, onAnswerSelect }) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleAnswerChange = (answer) => {
    setSelectedAnswer(answer);
    onAnswerSelect && onAnswerSelect(question.id, answer);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="bg-base-100 border border-base-300 rounded-xl shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
            {question.subject}
          </span>
          <span className="bg-base-200 text-base-content text-xs px-2 py-1 rounded">
            {question.topic}
          </span>
        </div>
        <button
          onClick={toggleBookmark}
          className={`ml-4 p-2 rounded-full ${
            isBookmarked ? 'text-error' : 'text-base-content/60 hover:text-error'
          }`}
        >
          {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
        </button>
      </div>

      <h3 className="text-lg font-medium text-base-content mb-4">
        {question.question}
      </h3>

      <div className="space-y-2 mb-4">
        {question.options.map((option, index) => {
          const letter = String.fromCharCode(65 + index);
          const isSelected = selectedAnswer === option;
          const isCorrect = showAnswer && option === question.correctAnswer;
          const isIncorrect = showAnswer && isSelected && option !== question.correctAnswer;

          return (
            <label
              key={index}
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'bg-primary/10 border-primary'
                  : 'hover:bg-base-200'
              } ${
                showAnswer && isCorrect ? 'bg-success/10 border-success' : ''
              } ${
                showAnswer && isIncorrect ? 'bg-error/10 border-error' : ''
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={isSelected}
                onChange={() => handleAnswerChange(option)}
                className="mr-3"
              />
              <span className="font-medium mr-3">{letter}.</span>
              <span className="flex-1">{option}</span>
              {showAnswer && isCorrect && (
                <span className="text-success font-bold ml-2">✓</span>
              )}
              {showAnswer && isIncorrect && (
                <span className="text-error font-bold ml-2">✗</span>
              )}
            </label>
          );
        })}
      </div>

      {showAnswer && (
        <div className="mt-2 p-3 bg-base-200 rounded-lg">
          <p className="text-base-content">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
