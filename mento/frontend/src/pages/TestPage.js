import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitTestResponses } from '../utils/api';
import { getQuestions } from '../utils/questions';

const TestPage = ({ user }) => {
  const navigate = useNavigate();
  const [questions] = useState(getQuestions());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);
  const [showProgress, setShowProgress] = useState(true);

  const handleResponse = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const testData = {
        user_id: user.id,
        responses: responses,
        completed_at: new Date().toISOString()
      };
      
      await submitTestResponses(testData);
      navigate('/results');
    } catch (error) {
      console.error('Failed to submit test:', error);
      // Handle error - maybe show a notification
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];
  const hasResponse = responses[question.id] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            How are you feeling today, {user.name}?
          </h1>
          <p className="text-gray-600 text-lg">
            Take your time. There are no right or wrong answers. 💙
          </p>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{question.emoji}</div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              {question.text}
            </h2>
            {question.subtitle && (
              <p className="text-gray-600 text-lg">
                {question.subtitle}
              </p>
            )}
          </div>

          {/* Response Options */}
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleResponse(question.id, index)}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                  responses[question.id] === index
                    ? 'border-purple-500 bg-purple-50 shadow-lg transform scale-105'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 hover:shadow-md'
                }`}
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 mb-1">
                      {option.label}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {option.description}
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    responses[question.id] === index
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300'
                  }`}>
                    {responses[question.id] === index && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="text-gray-500 text-sm">
            {hasResponse ? '✅ Answered' : '⏳ Please select an option'}
          </div>

          <button
            onClick={handleNext}
            disabled={!hasResponse || loading}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing...
              </div>
            ) : currentQuestion === questions.length - 1 ? (
              'Complete Assessment ✨'
            ) : (
              'Next →'
            )}
          </button>
        </div>

        {/* Encouragement */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            💡 Remember: This assessment helps us understand how to best support you
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestPage;