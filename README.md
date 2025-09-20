# 🌟 Mento - Mental Health Support Web App

A friendly, interactive mental health support web application built with React, Tailwind CSS, and Framer Motion for the SIH (Smart India Hackathon) project.

##  Quick Start

### Prerequisites
- **Node.js** v16.0.0+ 
- **npm** v8.0.0+

### Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/roopaksai/mento.git
cd mento

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

**That's it!** Open http://localhost:3000 in your browser.

### Alternative Setup Methods

**Windows PowerShell:**
```powershell
scripts\setup.ps1
```

**macOS/Linux:**
```bash
chmod +x scripts/setup.sh && scripts/setup.sh
```

**Using Make:**
```bash
scripts/make install && scripts/make dev
```

## 🎯 Project Overview

Mento provides mental health support through:

- **🙋‍♀️ Friendly Registration** - Interactive onboarding with avatars
- **🌦️ Mood Testing** - Fun, child-friendly mood assessment  
- **🤖 Chatbot Companion** - Playful AI buddy (Mr. Bean 😄)
- **🧘‍♀️ Relaxation Hub** - Calming sounds, breathing exercises
- **💡 Smart Suggestions** - Positive, motivating recommendations
- **📊 Dual Reports** - Admin & user-friendly analytics

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (localhost:3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code quality |

## 📁 Project Structure

```
mento/
├── src/                   # Source code
│   ├── components/        # React components (to be built)
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # React entry point
│   └── input.css         # Tailwind CSS styles
├── public/               # Static assets
│   └── favicon.svg       # App icon
├── scripts/              # Setup and build scripts
├── .env                  # Environment variables
└── package.json          # Dependencies and scripts
```

## 🎨 Tech Stack

- **React 18** - Modern UI library
- **Vite** - Lightning-fast development  
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

## � Design System

### Colors
- **Primary**: Blue gradient (#0ea5e9 → #0284c7)
- **Mood Colors**: Happy 🟡, Calm 🟢, Stressed 🔴, Neutral ⚫

### Animations
- Breathing circles (meditation)
- Button hover effects 
- Page transitions
- Floating mascots

## 🔧 Configuration

Copy `.env.example` to `.env` and customize:

```env
VITE_APP_NAME=Mento
VITE_CHATBOT_NAME=Mr. Bean
VITE_ENABLE_CHATBOT=true
VITE_ENABLE_AUDIO=true
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel**: `npx vercel --prod`
- **Netlify**: Upload `dist/` folder
- **Docker**: `docker build -t mento-app .`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- SIH 2024 Team
- Mental Health Awareness Initiative
- Open Source Community

---

**Happy Coding! 🎉** Let's build something that makes people smile! 😊 
