import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage, getChatHistory } from '../utils/api';

const ChatbotPage = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      const history = await getChatHistory(user.id);
      if (history.data && history.data.length > 0) {
        setMessages(history.data);
      } else {
        // Welcome message
        setMessages([
          {
            id: 1,
            message: `Hi ${user.name}! 👋 I'm your mental wellness companion. I'm here to listen, support, and help you feel better. How are you doing today?`,
            sender: 'bot',
            timestamp: new Date().toISOString()
          }
        ]);
      }
    } catch (error) {
      // Fallback welcome message
      setMessages([
        {
          id: 1,
          message: `Hi ${user.name}! 👋 I'm your mental wellness companion. I'm here to listen, support, and help you feel better. How are you doing today?`,
          sender: 'bot',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      message: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);
    setTypingIndicator(true);

    try {
      const response = await sendChatMessage(inputMessage.trim(), user.id);
      
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          message: response.data.message || getDefaultResponse(inputMessage),
          sender: 'bot',
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, botMessage]);
        setTypingIndicator(false);
      }, 1000 + Math.random() * 1000); // Simulate thinking time
      
    } catch (error) {
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          message: getDefaultResponse(inputMessage),
          sender: 'bot',
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, botMessage]);
        setTypingIndicator(false);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('sad') || message.includes('depressed') || message.includes('down')) {
      return "I hear that you're feeling sad. 💙 It's okay to have these feelings, and I'm here with you. Would you like to talk about what's making you feel this way, or would you prefer some gentle suggestions to help lift your mood?";
    }
    
    if (message.includes('anxious') || message.includes('worried') || message.includes('nervous')) {
      return "Anxiety can feel overwhelming, but you're not alone. 🫂 Let's try a quick breathing exercise together: Breathe in for 4 counts... hold for 4... and breathe out for 4. You're safe right now. What's on your mind?";
    }
    
    if (message.includes('stress') || message.includes('overwhelmed') || message.includes('pressure')) {
      return "It sounds like you're carrying a lot right now. 💆‍♀️ Remember, it's okay to take things one step at a time. What's one small thing you could do right now to take care of yourself?";
    }
    
    if (message.includes('happy') || message.includes('good') || message.includes('great')) {
      return "That's wonderful to hear! 🌟 I'm so glad you're feeling good. What's been going well for you today? It's important to celebrate these positive moments!";
    }
    
    if (message.includes('help') || message.includes('support')) {
      return "I'm here to help! 🤝 Here are some ways I can support you: we can talk through your feelings, I can suggest coping strategies, share relaxation techniques, or just listen. What would be most helpful right now?";
    }
    
    if (message.includes('sleep') || message.includes('tired') || message.includes('insomnia')) {
      return "Sleep is so important for our mental health. 😴 If you're having trouble sleeping, try creating a calming bedtime routine, avoiding screens before bed, or doing some gentle stretches. What's your current sleep situation like?";
    }
    
    if (message.includes('thank') || message.includes('appreciate')) {
      return "You're so welcome! 💙 It means a lot to me that I could help. Remember, taking care of your mental health is a sign of strength, not weakness. I'm always here when you need support.";
    }
    
    // Default empathetic responses
    const defaultResponses = [
      "Thank you for sharing that with me. It takes courage to open up about how you're feeling. 💙 Can you tell me more about what's on your mind?",
      "I hear you, and your feelings are completely valid. 🤗 Remember that it's okay to not be okay sometimes. What would help you feel supported right now?",
      "That sounds challenging. You're doing the best you can, and that's enough. 🌱 Would you like to talk through this together, or would you prefer some gentle suggestions?",
      "I'm here to listen without judgment. Your mental health matters, and so do you. 💚 What's one thing that usually makes you feel a little better?",
      "Every feeling you have is valid and important. 🌈 You don't have to go through this alone. What kind of support would be most helpful today?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const quickReplies = [
    "I'm feeling anxious",
    "I'm having a bad day",
    "I feel overwhelmed",
    "I need motivation",
    "I'm grateful for something",
    "I want to feel better"
  ];

  const handleQuickReply = (reply) => {
    setInputMessage(reply);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-float">🤖</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Wellness Companion</h1>
          <p className="text-gray-600">I'm here to listen, support, and help you feel better 💙</p>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className="text-2xl">
                    {message.sender === 'user' ? '😊' : '🤖'}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                    <p className={`text-xs mt-1 opacity-70 ${
                      message.sender === 'user' ? 'text-purple-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {typingIndicator && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🤖</div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
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

          {/* Quick Replies */}
          <div className="px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-3">Quick replies:</p>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-6 border-t border-gray-100">
            <div className="flex space-x-4">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here... I'm here to listen 💙"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                rows={2}
                disabled={loading}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !inputMessage.trim()}
                className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '...' : 'Send 💌'}
              </button>
            </div>
          </div>
        </div>

        {/* Support Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-3">💙</div>
          <h3 className="font-bold text-blue-800 mb-2">Remember</h3>
          <p className="text-blue-700 text-sm">
            I'm here to provide support and encouragement, but I'm not a replacement for professional help. 
            If you're in crisis, please reach out to a mental health professional or crisis hotline.
          </p>
          <div className="mt-4 text-xs text-blue-600">
            <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
            <p><strong>National Suicide Prevention:</strong> 988</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;