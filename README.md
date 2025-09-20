# 🌟 Mento - Mental Health Support Web App

A friendly, interactive mental health support web application built with React, Tailwind CSS, and Framer Motion for the SIH (Smart India Hackathon) project.

## 🎯 Project Overview

Mento is designed to provide mental health support through:
- **Friendly Registration** - Interactive onboarding with avatars
- **Mood Testing** - Fun, child-friendly mood assessment
- **Chatbot Companion** - Playful AI buddy (Mr. Bean 😄)
- **Relaxation Hub** - Calming sounds, breathing exercises, videos
- **Personalized Suggestions** - Positive, motivating recommendations
- **Admin/User Reports** - Dual reporting system for different audiences

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed on your system:
- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/roopaksai/mento.git
   cd mento
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your preferred settings.

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
mento/
├── public/                 # Static assets
├── src/                   # Source code
│   ├── components/        # React components (to be created)
│   │   ├── Registration/  # User onboarding
│   │   ├── MoodTest/     # Mood assessment
│   │   ├── Chatbot/      # AI companion
│   │   ├── Relaxation/   # Calming activities
│   │   └── Reports/      # User/Admin reports
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── assets/           # Images, sounds, etc.
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # React entry point
│   └── input.css         # Tailwind CSS styles
├── .env                  # Environment variables
├── .env.example         # Environment template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
└── package.json         # Dependencies and scripts
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |
| `npm install` | Install all dependencies |
| `npm start` | Alias for `npm run dev` |

## 🎨 Tech Stack

### Core Technologies
- **React 18** - UI library with modern hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

### UI & Animations
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icons
- **React Confetti** - Celebration effects

### Development Tools
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🎯 Features to Implement

### 1. Registration Section
- [ ] Friendly name input with "Mr. Bean" persona
- [ ] Avatar selection (cartoon faces, pets, colors)
- [ ] Animated onboarding flow

### 2. Mood Test Section
- [ ] Weather-based mood questions ☀️🌧️🌩️
- [ ] Color-based mood picker 🎨
- [ ] Activity preference buttons (relax/talk/laugh)
- [ ] Animated button interactions

### 3. Chatbot Buddy
- [ ] Floating mascot design
- [ ] Playful companion interface
- [ ] Simple chat simulation
- [ ] Animated responses

### 4. Relaxation Hub
- [ ] Sound player (rain, ocean, birds, lo-fi)
- [ ] Breathing animation circle
- [ ] Video placeholder cards
- [ ] Doodle/coloring board

### 5. Personalized Suggestions
- [ ] Positive mood interpretation
- [ ] Activity recommendation cards
- [ ] Motivational messaging

### 6. Reports System
- [ ] Admin view: Clear status indicators
- [ ] User view: Motivational insights
- [ ] Visual progress tracking

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#0ea5e9 to #0284c7)
- **Mood Colors**: 
  - Happy: #fbbf24 (yellow)
  - Calm: #06d6a0 (green)
  - Stressed: #ef4444 (red)
  - Neutral: #6b7280 (gray)

### Typography
- **Headings**: Inter (clean, modern)
- **Fun Elements**: Comic Neue (playful)

### Animations
- Breathing circles (4s ease-in-out)
- Button hover effects (scale + glow)
- Page transitions (fade/slide)
- Float animations for mascots

## 🌍 Cross-Platform Setup

### Windows
```powershell
# PowerShell
npm install
npm run dev
```

### macOS/Linux
```bash
# Terminal
npm install
npm run dev
```

### Docker (Optional)
```bash
# Build and run with Docker
docker build -t mento-app .
docker run -p 3000:3000 mento-app
```

## 🔧 Configuration

### Environment Variables
```env
VITE_APP_NAME=Mento
VITE_CHATBOT_NAME=Mr. Bean
VITE_ENABLE_CHATBOT=true
VITE_ENABLE_AUDIO=true
VITE_DEBUG_MODE=true
```

### Tailwind Customization
The `tailwind.config.js` includes:
- Custom color palette for moods
- Animation keyframes for breathing
- Component classes for buttons and cards
- Responsive breakpoints

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npx vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- SIH 2024 Team
- Mental Health Awareness Initiative
- Open Source Community

---

**Happy Coding! 🎉** Build something that makes people smile and feel better! 😊 
