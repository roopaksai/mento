import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (!name) {
      navigate('/login');
      return;
    }
    setUserName(name);
    
    // Initial welcome message
    setTimeout(() => {
      addMessage('bot', `Hi ${name}! 👋 I'm here to support you on your wellness journey. How are you feeling today?`);
    }, 1000);
  }, [navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (sender, text) => {
    const newMessage = {
      id: Date.now(),
      sender,
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Simple rule-based chatbot responses
  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Greeting patterns
    if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
      return "Hello! I'm glad you're here. How can I support you today? 😊";
    }
    
    // Feeling-related patterns
    if (message.includes('sad') || message.includes('down') || message.includes('depressed')) {
      return "I hear that you're feeling down. That takes courage to share. Remember, it's okay to have difficult days. Have you tried taking a few deep breaths or going for a short walk? Sometimes small steps can help. 💙";
    }
    
    if (message.includes('anxious') || message.includes('worried') || message.includes('stress')) {
      return "Anxiety can feel overwhelming, but you're not alone in this. Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. This can help bring you back to the present moment. 🌱";
    }
    
    if (message.includes('angry') || message.includes('frustrated') || message.includes('mad')) {
      return "Anger is a valid emotion. It often signals that something important to you is being threatened. Try taking 10 slow, deep breaths or write down what's bothering you. Physical movement like stretching can also help release tension. 🔥➡️❄️";
    }
    
    if (message.includes('tired') || message.includes('exhausted') || message.includes('energy')) {
      return "Feeling tired can be draining in more ways than one. Make sure you're getting enough sleep, staying hydrated, and eating nourishing foods. Sometimes fatigue is emotional too - be gentle with yourself. 😴✨";
    }
    
    if (message.includes('lonely') || message.includes('alone') || message.includes('isolated')) {
      return "Loneliness is hard, but reaching out here shows strength. Consider calling a friend, joining an online community, or even talking to a pet. Sometimes just acknowledging the feeling helps. You matter, and your feelings are valid. 🤗";
    }
    
    // Positive patterns
    if (message.includes('good') || message.includes('great') || message.includes('happy') || message.includes('better')) {
      return "That's wonderful to hear! 🌟 I'm so glad you're feeling positive. What's contributing to these good feelings? Celebrating the good moments is just as important as working through the difficult ones.";
    }
    
    // Help-seeking patterns
    if (message.includes('help') || message.includes('support') || message.includes('advice')) {
      return "I'm here to help! Here are some things that might support you: 🌈\n\n• Take 3 deep breaths right now\n• Write down one thing you're grateful for\n• Step outside for fresh air\n• Listen to calming music\n• Reach out to someone you trust\n\nWhat feels most helpful to you right now?";
    }
    
    if (message.includes('sleep') || message.includes('insomnia') || message.includes('can\'t sleep')) {
      return "Sleep troubles can affect everything. Try creating a bedtime routine: dim lights 1 hour before bed, avoid screens, try gentle stretching or reading. The 4-7-8 breathing technique can also help: breathe in for 4, hold for 7, exhale for 8. Sweet dreams! 🌙";
    }
    
    if (message.includes('motivation') || message.includes('unmotivated') || message.includes('stuck')) {
      return "Feeling unmotivated is normal, especially when we're struggling. Start incredibly small - even making your bed or drinking a glass of water counts as progress. What's one tiny thing you could do right now that would make you feel 1% better? 🌱";
    }
    
    // Self-care patterns
    if (message.includes('self-care') || message.includes('take care')) {
      return "Self-care isn't selfish - it's necessary! 💗 Here are some ideas:\n\n• Take a warm bath or shower\n• Listen to your favorite music\n• Call someone who makes you laugh\n• Do something creative\n• Spend time in nature\n• Practice saying kind things to yourself\n\nWhat sounds good to you?";
    }
    
    // Crisis patterns - Important!
    if (message.includes('hurt myself') || message.includes('suicide') || message.includes('end it all') || message.includes('kill myself')) {
      return "I'm really concerned about you. Please reach out to someone who can help right away:\n\n🆘 Crisis Text Line: Text HOME to 741741\n☎️ National Suicide Prevention Lifeline: 988\n🏥 Or go to your nearest emergency room\n\nYou matter, and there are people who want to help. Please don't go through this alone. 💙";
    }
    
    // Gratitude patterns
    if (message.includes('grateful') || message.includes('thankful') || message.includes('appreciate')) {
      return "Gratitude is such a powerful practice! 🙏 It's beautiful that you're recognizing the good in your life. Research shows that regular gratitude practice can improve mood and overall well-being. What are you most grateful for today?";
    }
    
    // Default responses for unclear messages
    const defaultResponses = [
      "I hear you. Can you tell me more about what's on your mind? 💭",
      "Thank you for sharing with me. What would be most helpful to talk about right now? 🤗",
      "I'm listening. How are you taking care of yourself today? 🌸",
      "That sounds important to you. What support do you need right now? 💙",
      "I appreciate you opening up. What's one small thing that might help you feel better? ✨"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = inputMessage.trim();
    addMessage('user', userMessage);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage);
      addMessage('bot', botResponse);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // 1-3 second delay
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickResponses = [
    "I'm feeling anxious",
    "I need motivation",
    "I'm having trouble sleeping",
    "I feel sad today",
    "I need self-care tips",
    "I feel better now"
  ];

  const handleQuickResponse = (response) => {
    setInputMessage(response);
  };

  return (
    <div className="min-h-screen bg-gradient-wellness">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Wellness Chat Companion 🤖💙
          </h1>
          <p className="text-white/80">
            A safe space to share your thoughts and get support
          </p>
        </div>

        {/* Chat Container */}
        <div className="wellness-card h-96 mb-4 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`chat-message ${message.sender} max-w-xs lg:max-w-md`}>
                  {message.sender === 'bot' && (
                    <div className="flex items-center mb-1">
                      <span className="text-lg mr-2">🤖</span>
                      <span className="text-xs text-gray-500">Wellness Bot</span>
                    </div>
                  )}
                  <div className="whitespace-pre-line">{message.text}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="chat-message bot">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">🤖</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping || !inputMessage.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-full transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Quick Response Buttons */}
        <div className="wellness-card mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick responses:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {quickResponses.map((response, index) => (
              <button
                key={index}
                onClick={() => handleQuickResponse(response)}
                className="p-3 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors"
              >
                {response}
              </button>
            ))}
          </div>
        </div>

        {/* Help Resources */}
        <div className="wellness-card">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="text-xl mr-2">🆘</span>
            Need immediate help?
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-red-50 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-1">Crisis Support</h4>
              <p className="text-red-700">National Suicide Prevention Lifeline: <strong>988</strong></p>
              <p className="text-red-700">Crisis Text Line: Text <strong>HOME to 741741</strong></p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-1">Professional Help</h4>
              <p className="text-blue-700">Consider reaching out to a licensed therapist</p>
              <p className="text-blue-700">Your primary care doctor can also help</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 text-center">
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/music')}
              className="wellness-button py-2 text-sm"
            >
              🎵 Music Therapy
            </button>
            <button
              onClick={() => navigate('/report')}
              className="wellness-button py-2 text-sm"
            >
              📊 View Report
            </button>
            <button
              onClick={() => navigate('/test')}
              className="wellness-button py-2 text-sm"
            >
              🔄 Retake Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;