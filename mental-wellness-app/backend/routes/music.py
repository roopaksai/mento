from flask import Blueprint, request, jsonify

music_bp = Blueprint('music', __name__)

@music_bp.route('/recommendations/<severity_level>', methods=['GET'])
def get_music_recommendations(severity_level):
    """Get music recommendations based on severity level"""
    try:
        # Music recommendations based on mental health state
        music_library = {
            'low': {
                'title': 'Peaceful Moments',
                'description': 'Gentle sounds to maintain your positive energy',
                'tracks': [
                    {
                        'title': 'Ocean Waves',
                        'artist': 'Nature Sounds',
                        'duration': '10:00',
                        'url': 'https://www.youtube.com/watch?v=F77HUf_92h4',
                        'mood': 'calm'
                    },
                    {
                        'title': 'Morning Sunshine',
                        'artist': 'Uplifting Melodies',
                        'duration': '8:30',
                        'url': 'https://www.youtube.com/watch?v=sample1',
                        'mood': 'cheerful'
                    }
                ]
            },
            'moderate': {
                'title': 'Healing Journey',
                'description': 'Soothing music to help you through challenging times',
                'tracks': [
                    {
                        'title': 'Gentle Rain',
                        'artist': 'Peaceful Vibes',
                        'duration': '12:00',
                        'url': 'https://www.youtube.com/watch?v=sample2',
                        'mood': 'healing'
                    },
                    {
                        'title': 'Hope Rising',
                        'artist': 'Therapeutic Sounds',
                        'duration': '9:45',
                        'url': 'https://www.youtube.com/watch?v=sample3',
                        'mood': 'hopeful'
                    }
                ]
            },
            'high': {
                'title': 'Support & Comfort',
                'description': 'Deeply calming music for emotional support',
                'tracks': [
                    {
                        'title': 'Healing Frequencies',
                        'artist': 'Sound Therapy',
                        'duration': '15:00',
                        'url': 'https://www.youtube.com/watch?v=WvqBFHjOJdM',
                        'mood': 'therapeutic'
                    },
                    {
                        'title': 'Safe Harbor',
                        'artist': 'Comfort Music',
                        'duration': '20:00',
                        'url': 'https://www.youtube.com/watch?v=sample4',
                        'mood': 'safe'
                    }
                ]
            }
        }
        
        # Motivational quotes by severity
        quotes = {
            'low': [
                "Keep shining your light! 🌟",
                "You're doing amazing - keep it up!",
                "Your positive energy is inspiring!"
            ],
            'moderate': [
                "Every small step forward is progress 💙",
                "Be gentle with yourself - you're doing the best you can",
                "Tomorrow is a new day with new possibilities"
            ],
            'high': [
                "You are stronger than you know 💪",
                "Healing is not linear - be patient with yourself",
                "You matter, and you deserve support and care"
            ]
        }
        
        recommendations = music_library.get(severity_level, music_library['moderate'])
        daily_quotes = quotes.get(severity_level, quotes['moderate'])
        
        return jsonify({
            'severityLevel': severity_level,
            'musicRecommendations': recommendations,
            'dailyQuotes': daily_quotes,
            'activities': get_wellness_activities(severity_level)
        }), 200
        
    except Exception as e:
        print(f"Music recommendations error: {str(e)}")
        return jsonify({'error': 'An error occurred while fetching recommendations'}), 500

def get_wellness_activities(severity_level):
    """Get wellness activities based on severity level"""
    activities = {
        'low': [
            {
                'title': 'Gratitude Practice',
                'description': 'Write down 3 things you\'re grateful for',
                'duration': '5 minutes',
                'icon': '🙏'
            },
            {
                'title': 'Nature Walk',
                'description': 'Take a peaceful walk outdoors',
                'duration': '15-30 minutes',
                'icon': '🌳'
            }
        ],
        'moderate': [
            {
                'title': 'Deep Breathing',
                'description': '4-7-8 breathing technique for relaxation',
                'duration': '10 minutes',
                'icon': '🌬️'
            },
            {
                'title': 'Gentle Stretching',
                'description': 'Light yoga or stretching exercises',
                'duration': '15 minutes',
                'icon': '🧘'
            }
        ],
        'high': [
            {
                'title': 'Grounding Exercise',
                'description': '5-4-3-2-1 technique: 5 things you see, 4 you touch, etc.',
                'duration': '5-10 minutes',
                'icon': '🌍'
            },
            {
                'title': 'Self-Compassion',
                'description': 'Practice kind self-talk and self-care',
                'duration': 'As needed',
                'icon': '💙'
            }
        ]
    }
    
    return activities.get(severity_level, activities['moderate'])