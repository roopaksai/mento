import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const TestPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  // User-friendly questions inspired by PHQ-9 and DASS-21
  const questions = [
    {
      id: 1,
      text: "How often have you been feeling down or blue lately?",
      category: "mood",
      context: "It's okay to have rough days - we all do!"
    },
    {
      id: 2,
      text: "How much have you been enjoying the things you usually love?",
      category: "interest",
      context: "Sometimes our favorite activities don't feel the same."
    },
    {
      id: 3,
      text: "How has your sleep been recently?",
      category: "sleep",
      context: "Sleep affects everything - your energy, mood, and thinking."
    },
    {
      id: 4,
      text: "How often do you feel tired or low on energy?",
      category: "energy",
      context: "Energy levels naturally vary, but patterns matter."
    },
    {
      id: 5,
      text: "How comfortable do you feel about yourself these days?",
      category: "self_worth",
      context: "Self-compassion is a skill we can all work on."
    },
    {
      id: 6,
      text: "How easy has it been to focus on things lately?",
      category: "concentration",
      context: "Focus can be affected by many things - stress, sleep, emotions."
    },
    {
      id: 7,
      text: "How would you describe your appetite recently?",
      category: "appetite",
      context: "Eating patterns often reflect how we're feeling inside."
    },
    {
      id: 8,
      text: "How often do you feel restless or fidgety?",
      category: "restlessness",
      context: "Physical sensations often connect to our emotional state."
    },
    {
      id: 9,
      text: "How often do worrying thoughts pop into your mind?",
      category: "worry",
      context: "Everyone worries sometimes - it's about finding balance."
    },
    {
      id: 10,
      text: "How tense or wound up have you been feeling?",
      category: "tension",
      context: "Physical tension often reflects our mental state."
    }
  ];

  const responseOptions = [
    { value: 0, label: "Never", emoji: "😌", color: "bg-green-100 border-green-300" },
    { value: 1, label: "Sometimes", emoji: "🤔", color: "bg-yellow-100 border-yellow-300" },
    { value: 2, label: "Often", emoji: "😟", color: "bg-orange-100 border-orange-300" },
    { value: 3, label: "Always", emoji: "😔", color: "bg-red-100 border-red-300" }
  ];

  useEffect(() => {
    // Get user name from localStorage
    const name = localStorage.getItem('userName');
    if (!name) {
      navigate('/login');
      return;
    }
    setUserName(name);
  }, [navigate]);

  const handleAnswerSelect = (value) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: {
        question: questions[currentQuestion].text,
        answer: value,
        category: questions[currentQuestion].category
      }
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitAssessment();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitAssessment = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const userEmail = localStorage.getItem('userEmail');
      
      const assessmentData = {
        userId,
        userEmail,
        answers,
        completedAt: new Date().toISOString()
      };
      
      await apiService.submitAssessment(assessmentData);
      navigate('/report');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      // Continue to report page even if API fails (for demo purposes)
      navigate('/report');
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;
  const currentQuestionData = questions[currentQuestion];
  const currentAnswer = answers[currentQuestionData.id]?.answer;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-wellness">
        <div className="wellness-card text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            Processing your responses...
          </h2>
          <p className="text-gray-500 mt-2">Preparing your personalized insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-wellness py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Hey {userName}! 👋
          </h1>
          <p className="text-white/80 text-lg">
            Let's check in on how you've been feeling
          </p>
          <p className="text-white/60 text-sm mt-2">
            No right or wrong answers - just be honest with yourself
          </p>
        </div>

        {/* Progress Bar */}
        <div className="wellness-card mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{width: `${progressPercentage}%`}}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="wellness-card mb-8 fade-in">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              {currentQuestionData.text}
            </h2>
            <p className="text-gray-600 text-sm bg-blue-50 p-3 rounded-lg">
              💡 {currentQuestionData.context}
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-8">
            {responseOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleAnswerSelect(option.value)}
                className={`assessment-option ${
                  currentAnswer === option.value ? 'selected' : ''
                } ${option.color}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{option.emoji}</span>
                    <span className="font-medium text-gray-700">{option.label}</span>
                  </div>
                  {currentAnswer === option.value && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                currentQuestion === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              ← Previous
            </button>

            <button
              onClick={nextQuestion}
              disabled={currentAnswer === undefined}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                currentAnswer === undefined
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'wellness-button'
              }`}
            >
              {currentQuestion === questions.length - 1 ? 'Complete Assessment ✨' : 'Next →'}
            </button>
          </div>
        </div>

        {/* Encouragement */}
        <div className="text-center text-white/70">
          <p className="text-sm">
            🌟 You're doing great! Taking time for self-reflection is important.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestPage;