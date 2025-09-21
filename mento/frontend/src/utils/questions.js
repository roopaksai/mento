// Mental Health Assessment Questions
// Inspired by PHQ-9 and DASS-21 but reworded to be user-friendly and non-threatening

export const getQuestions = () => {
  return [
    // Mood & Energy Questions (PHQ-9 inspired)
    {
      id: 'mood_1',
      category: 'mood',
      text: "How has your energy been lately?",
      subtitle: "Think about the past two weeks",
      emoji: "⚡",
      options: [
        {
          emoji: "🌟",
          label: "Full of energy",
          description: "I feel energetic and ready to take on the day",
          score: 0
        },
        {
          emoji: "😊",
          label: "Pretty good energy",
          description: "Most days I feel quite energetic",
          score: 1
        },
        {
          emoji: "😐",
          label: "Sometimes tired",
          description: "Some days are good, others I feel drained",
          score: 2
        },
        {
          emoji: "😴",
          label: "Often feeling drained",
          description: "I feel tired most of the time",
          score: 3
        }
      ]
    },
    {
      id: 'mood_2',
      category: 'mood',
      text: "How much joy do you find in things you usually like?",
      subtitle: "Your hobbies, activities, or things that normally make you happy",
      emoji: "🌈",
      options: [
        {
          emoji: "😍",
          label: "Just as much as always",
          description: "I still really enjoy the things I love",
          score: 0
        },
        {
          emoji: "🙂",
          label: "Mostly the same",
          description: "I enjoy things, maybe slightly less than before",
          score: 1
        },
        {
          emoji: "😕",
          label: "Less than before",
          description: "Things don't feel as enjoyable as they used to",
          score: 2
        },
        {
          emoji: "😞",
          label: "Very little joy",
          description: "I don't really enjoy much anymore",
          score: 3
        }
      ]
    },
    {
      id: 'mood_3',
      category: 'mood',
      text: "How has your sleep been?",
      subtitle: "Think about falling asleep, staying asleep, or feeling rested",
      emoji: "🌙",
      options: [
        {
          emoji: "😴",
          label: "Sleeping well",
          description: "I fall asleep easily and wake up refreshed",
          score: 0
        },
        {
          emoji: "😊",
          label: "Pretty good sleep",
          description: "Minor issues but generally sleeping okay",
          score: 1
        },
        {
          emoji: "😐",
          label: "Some sleep troubles",
          description: "Sometimes hard to fall asleep or stay asleep",
          score: 2
        },
        {
          emoji: "😵",
          label: "Struggling with sleep",
          description: "Often can't sleep well or feel tired when I wake up",
          score: 3
        }
      ]
    },
    {
      id: 'mood_4',
      category: 'mood',
      text: "How do you feel about yourself lately?",
      subtitle: "Your self-worth and how you see yourself",
      emoji: "💭",
      options: [
        {
          emoji: "🌟",
          label: "Good about myself",
          description: "I generally feel positive about who I am",
          score: 0
        },
        {
          emoji: "😊",
          label: "Mostly positive",
          description: "I feel okay about myself most of the time",
          score: 1
        },
        {
          emoji: "😕",
          label: "Sometimes negative",
          description: "I sometimes feel bad about myself or that I'm failing",
          score: 2
        },
        {
          emoji: "😞",
          label: "Often negative",
          description: "I frequently feel like I'm not good enough or letting people down",
          score: 3
        }
      ]
    },

    // Anxiety & Stress Questions (DASS-21 inspired)
    {
      id: 'anxiety_1',
      category: 'anxiety',
      text: "How often do you feel worried or anxious?",
      subtitle: "About everyday things or future events",
      emoji: "💭",
      options: [
        {
          emoji: "😌",
          label: "Rarely worried",
          description: "I generally feel calm and relaxed",
          score: 0
        },
        {
          emoji: "🙂",
          label: "Sometimes worried",
          description: "I worry occasionally but can manage it",
          score: 1
        },
        {
          emoji: "😰",
          label: "Often worried",
          description: "I find myself worrying quite a bit",
          score: 2
        },
        {
          emoji: "😨",
          label: "Constantly worried",
          description: "I worry most of the time and it's hard to stop",
          score: 3
        }
      ]
    },
    {
      id: 'anxiety_2',
      category: 'anxiety',
      text: "How do you handle stressful situations?",
      subtitle: "When things get overwhelming or difficult",
      emoji: "🌊",
      options: [
        {
          emoji: "💪",
          label: "Handle stress well",
          description: "I can manage stress and bounce back quickly",
          score: 0
        },
        {
          emoji: "😊",
          label: "Cope pretty well",
          description: "Stress affects me but I can work through it",
          score: 1
        },
        {
          emoji: "😣",
          label: "Struggle sometimes",
          description: "Stress often feels overwhelming",
          score: 2
        },
        {
          emoji: "😵‍💫",
          label: "Feel overwhelmed",
          description: "Stress makes me feel like I can't cope",
          score: 3
        }
      ]
    },
    {
      id: 'anxiety_3',
      category: 'anxiety',
      text: "How is your concentration lately?",
      subtitle: "Focusing on work, reading, conversations, or activities",
      emoji: "🎯",
      options: [
        {
          emoji: "🧠",
          label: "Focus is great",
          description: "I can concentrate well on tasks",
          score: 0
        },
        {
          emoji: "😊",
          label: "Pretty good focus",
          description: "Minor difficulty but generally can concentrate",
          score: 1
        },
        {
          emoji: "😕",
          label: "Hard to focus",
          description: "I often find my mind wandering or getting distracted",
          score: 2
        },
        {
          emoji: "😵",
          label: "Can't concentrate",
          description: "It's very difficult to focus on anything for long",
          score: 3
        }
      ]
    },

    // Social & Life Satisfaction
    {
      id: 'social_1',
      category: 'social',
      text: "How do you feel about your relationships?",
      subtitle: "Friends, family, romantic relationships, or colleagues",
      emoji: "👥",
      options: [
        {
          emoji: "💕",
          label: "Very satisfied",
          description: "My relationships feel strong and supportive",
          score: 0
        },
        {
          emoji: "😊",
          label: "Generally good",
          description: "Most of my relationships are going well",
          score: 1
        },
        {
          emoji: "😐",
          label: "Could be better",
          description: "Some relationship issues or feeling disconnected",
          score: 2
        },
        {
          emoji: "😞",
          label: "Struggling with relationships",
          description: "I feel isolated or have conflicts with people close to me",
          score: 3
        }
      ]
    },
    {
      id: 'social_2',
      category: 'social',
      text: "How motivated do you feel about your daily activities?",
      subtitle: "Work, school, chores, or personal goals",
      emoji: "🎯",
      options: [
        {
          emoji: "🚀",
          label: "Very motivated",
          description: "I feel excited and driven to do things",
          score: 0
        },
        {
          emoji: "😊",
          label: "Pretty motivated",
          description: "I generally feel like doing what I need to do",
          score: 1
        },
        {
          emoji: "😐",
          label: "Low motivation",
          description: "It takes effort to get myself to do things",
          score: 2
        },
        {
          emoji: "😴",
          label: "Very low motivation",
          description: "I really struggle to get things done",
          score: 3
        }
      ]
    },
    {
      id: 'overall_1',
      category: 'overall',
      text: "Overall, how would you describe your current well-being?",
      subtitle: "Taking everything into account",
      emoji: "🌻",
      options: [
        {
          emoji: "🌟",
          label: "Feeling great",
          description: "Life feels good and I'm doing well overall",
          score: 0
        },
        {
          emoji: "😊",
          label: "Doing pretty well",
          description: "Some ups and downs but generally positive",
          score: 1
        },
        {
          emoji: "😐",
          label: "Getting by",
          description: "Things are okay but could be better",
          score: 2
        },
        {
          emoji: "😞",
          label: "Struggling",
          description: "I'm having a hard time and could use support",
          score: 3
        }
      ]
    }
  ];
};