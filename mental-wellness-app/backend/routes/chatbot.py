from flask import Blueprint, request, jsonify
import random

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('/message', methods=['POST'])
def handle_message():
    """Handle chatbot conversation"""
    try:
        data = request.get_json()
        message = data.get('message', '').lower().strip()
        user_id = data.get('userId')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Generate bot response
        bot_response = generate_response(message)
        
        # In real implementation, save conversation to database
        # conversation_model.save_message(user_id, message, bot_response)
        
        return jsonify({
            'response': bot_response,
            'timestamp': '2024-01-01T12:00:00Z',  # Current timestamp
            'supportive': True
        }), 200
        
    except Exception as e:
        print(f"Chatbot error: {str(e)}")
        return jsonify({'error': 'An error occurred while processing message'}), 500

def generate_response(message):
    """Generate contextual bot responses"""
    
    # Crisis keywords - highest priority
    crisis_keywords = ['suicide', 'kill myself', 'hurt myself', 'end it all', 'die']
    if any(keyword in message for keyword in crisis_keywords):
        return """I'm really concerned about you. Please reach out for immediate help:

🆘 **Crisis Resources:**
• National Suicide Prevention Lifeline: **988**
• Crisis Text Line: Text **HOME to 741741**
• Emergency Services: **911**

You matter, and there are people who want to help. Please don't go through this alone. 💙"""

    # Emotion-based responses
    if any(word in message for word in ['sad', 'depressed', 'down', 'blue']):
        responses = [
            "I hear that you're feeling down. That takes courage to share. Remember, sadness is a valid emotion, and it's okay to feel this way. Have you tried taking some deep breaths or going for a short walk? 💙",
            "Feeling sad can be really heavy. You're not alone in this. Sometimes it helps to acknowledge the feeling without judgment. What's one small thing that usually brings you a tiny bit of comfort? 🌱",
            "Thank you for sharing that with me. Sadness is part of the human experience. Have you been able to talk to anyone about how you're feeling? Sometimes connection can help ease the burden. 🤗"
        ]
        return random.choice(responses)
    
    if any(word in message for word in ['anxious', 'anxiety', 'worried', 'stress', 'nervous']):
        responses = [
            "Anxiety can feel overwhelming. Try this grounding technique: name 5 things you see, 4 things you can touch, 3 things you hear, 2 things you smell, and 1 thing you taste. This can help bring you back to the present moment. 🌱",
            "I understand anxiety can be really difficult. Your feelings are valid. Try taking slow, deep breaths: in for 4 counts, hold for 4, out for 4. Would you like to try this together? 🌬️",
            "Worry and stress are tough to carry. Remember that you've gotten through difficult times before. What's one coping strategy that has helped you in the past? 💪"
        ]
        return random.choice(responses)
    
    if any(word in message for word in ['angry', 'mad', 'frustrated', 'rage']):
        responses = [
            "Anger is a valid emotion - it often signals that something important to you feels threatened. Try taking 10 slow, deep breaths. Physical movement like stretching can also help release tension. 🔥➡️❄️",
            "I hear your frustration. Anger can be intense. Would it help to write down what's bothering you, or maybe do some physical activity to help release that energy? 💪",
            "Thank you for sharing your anger with me. It takes strength to acknowledge difficult emotions. What usually helps you when you're feeling this way? 🌪️➡️🌤️"
        ]
        return random.choice(responses)
    
    if any(word in message for word in ['tired', 'exhausted', 'fatigue', 'energy']):
        responses = [
            "Being tired can affect everything - your mood, thinking, and physical well-being. Are you getting enough sleep? Sometimes fatigue is emotional too. Be gentle with yourself. 😴✨",
            "Exhaustion is draining in so many ways. Make sure you're taking care of basics: water, food, rest. What's one small act of self-care you could do right now? 💧🍎😴",
            "Feeling low on energy is really challenging. Sometimes our bodies and minds need rest to recharge. What does rest look like for you today? 🔋"
        ]
        return random.choice(responses)
    
    if any(word in message for word in ['lonely', 'alone', 'isolated']):
        responses = [
            "Loneliness is a difficult feeling, but reaching out here shows courage. You're not as alone as you might feel. Is there someone in your life you could connect with, even briefly? 🤗",
            "I hear you. Loneliness can feel really heavy. Sometimes even small connections help - a text to a friend, a smile to a stranger, or talking to a pet. You matter. 💙",
            "Thank you for sharing that with me. Isolation is hard, but you took a step by talking here. What's one way you've connected with others in the past that felt good? 🌉"
        ]
        return random.choice(responses)
    
    # Positive emotions
    if any(word in message for word in ['good', 'great', 'happy', 'better', 'excellent']):
        responses = [
            "That's wonderful to hear! 🌟 I'm so glad you're feeling positive. What's contributing to these good feelings? Celebrating the good moments is important. 🎉",
            "I love hearing that! 😊 Positive feelings are precious. What's been going well for you? It's important to acknowledge and appreciate these moments. ✨",
            "That makes me happy! 🌈 It's beautiful when things feel good. What would you like to do to maintain this positive energy? 💫"
        ]
        return random.choice(responses)
    
    # Help-seeking
    if any(word in message for word in ['help', 'support', 'advice', 'what should i do']):
        return """I'm here to support you! 🌟 Here are some gentle suggestions:

• **Breathe**: Take 3 deep, slow breaths right now
• **Ground yourself**: Notice 3 things you can see around you
• **Be kind**: Speak to yourself like you would a good friend
• **Connect**: Reach out to someone you trust
• **Move**: Even a short walk can help
• **Create**: Write, draw, or make something
• **Rest**: Give yourself permission to pause

What feels most helpful to you right now? 💙"""

    # Sleep issues
    if any(word in message for word in ['sleep', 'insomnia', 'can\'t sleep', 'tired']):
        return """Sleep troubles can affect everything. Here are some gentle suggestions: 🌙

• **Wind down**: Dim lights 1 hour before bed
• **Breathe**: Try 4-7-8 breathing (in for 4, hold for 7, out for 8)
• **Environment**: Keep your room cool and dark
• **Routine**: Try to go to bed at the same time each night
• **Limit screens**: Blue light can interfere with sleep
• **Gentle movement**: Light stretching before bed

What part of sleep is most challenging for you? 😴"""

    # Self-care
    if any(word in message for word in ['self-care', 'take care', 'care for myself']):
        return """Self-care isn't selfish - it's necessary! 💗 Here are some gentle ideas:

• **Physical**: Warm bath, gentle movement, nourishing food
• **Emotional**: Journal, call a friend, practice gratitude
• **Mental**: Read, listen to music, try a puzzle
• **Spiritual**: Meditate, spend time in nature, reflect
• **Social**: Connect with loved ones, join a community activity
• **Creative**: Draw, write, make something with your hands

What type of self-care calls to you today? ✨"""

    # Gratitude
    if any(word in message for word in ['grateful', 'thankful', 'appreciate', 'blessing']):
        return """Gratitude is such a powerful practice! 🙏 It's beautiful that you're recognizing the good in your life. Research shows that gratitude can improve mood and overall well-being. What are you most grateful for today? Sometimes the smallest things can bring the biggest joy. ✨"""

    # Default supportive responses
    default_responses = [
        "I hear you. Thank you for sharing with me. What's most important for you to talk about right now? 💙",
        "It sounds like you have a lot on your mind. I'm here to listen. What would be most helpful to explore together? 🌱",
        "Thank you for trusting me with your thoughts. How are you taking care of yourself today? 🤗",
        "I appreciate you opening up. What kind of support would feel most helpful right now? ✨",
        "That sounds important. Can you tell me more about what's on your heart? 💫",
        "I'm glad you're here. What's one thing that would make today feel a little bit better for you? 🌈"
    ]
    
    return random.choice(default_responses)