# 🌟 Mento - Mental Health Suppor```
mento/                        # 🧹 CLEAN ROOT DIRECTORY
├── src/                      # Source code
├── public/                   # Static assets  
├── requirements/             # 🗂️ ALL CONFIG & SETUP FILES
│   ├── config/              # ⚙️ All configuration files
│   │   ├── vite.config.js   # Vite build configuration
│   │   ├── tailwind.config.js # Tailwind CSS configuration
│   │   ├── postcss.config.js # PostCSS configuration
│   │   ├── .eslintrc.cjs    # ESLint rules
│   │   └── .env.example     # Environment template
│   ├── setup.sh             # Setup script (Linux/Mac)
│   ├── setup.ps1            # Setup script (Windows)
│   └── Dockerfile           # Container setup
├── scripts/                  # Additional automation
├── package.json              # Dependencies
├── index.html               # HTML entry point
├── .env.example             # Environment template (for easy access)
└── Config reference files   # Minimal files that point to requirements/config/
``` friendly, interactive mental health support web application built with React, Tailwind CSS, and Framer Motion for the SIH (Smart India Hackathon) project.

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16.0.0+ 
- **npm** v8.0.0+

### Simple Setup

```bash
# 1. Clone the repository
git clone https://github.com/roopaksai/mento.git
cd mento

# 2. Install and start
npm install
npm run dev
```

**That's it!** Open http://localhost:3000 in your browser.

### Alternative Setup
```bash
# Use setup scripts
requirements/setup.sh         # macOS/Linux
requirements/setup.ps1        # Windows
```

## 📁 Clean Project Structure

```
mento/                        # 🧹 CLEAN ROOT DIRECTORY
├── src/                      # Source code
├── public/                   # Static assets  
├── requirements/             # �️ Setup & deployment files
│   ├── setup.sh             # Setup script (Linux/Mac)
│   ├── setup.ps1            # Setup script (Windows)
│   ├── Dockerfile           # Container setup
│   └── .env                 # Environment template
├── scripts/                  # Additional automation
├── package.json              # Dependencies
├── index.html               # HTML entry point
└── Essential config files   # Only what's needed
```

## 🎯 What Makes This Clean

- **🧹 Minimal root directory** - Only essential files visible
- **📂 All configs organized** - Everything in `requirements/config/`
- **🔗 Smart references** - Root config files point to organized ones
- **⚡ Simple setup** - Just `npm install && npm run dev`
- **🔧 No config mess** - All configurations tucked away

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (localhost:3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🎨 Tech Stack

- **React 18** - Modern UI library
- **Vite** - Lightning-fast development  
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations

## 🚀 Ready to Build

The project is set up for building:
- 🙋‍♀️ Friendly user registration
- 🌦️ Interactive mood testing
- 🤖 Chatbot companion (Mr. Bean)
- 🧘‍♀️ Relaxation features
- 📊 Smart reporting system

---

**Happy Coding! 🎉** Clean, simple, and ready to go! 😊