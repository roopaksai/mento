# 🌟 Mental Wellness Platform - Mento# 🌟 Mento - Mental Health Suppor```

mento/                        # 🧹 CLEAN ROOT DIRECTORY

A comprehensive mental health assessment and support platform with both **user-facing** and **institutional** features.├── src/                      # Source code

├── public/                   # Static assets  

## 🏗️ Project Structure├── requirements/             # 🗂️ ALL CONFIG & SETUP FILES

│   ├── config/              # ⚙️ All configuration files

```│   │   ├── vite.config.js   # Vite build configuration

mento/│   │   ├── tailwind.config.js # Tailwind CSS configuration

├── frontend/                    # React Frontend│   │   ├── postcss.config.js # PostCSS configuration

│   ├── src/│   │   ├── .eslintrc.cjs    # ESLint rules

│   │   ├── components/         # Reusable UI components│   │   └── .env.example     # Environment template

│   │   ├── pages/             # Main application pages│   ├── setup.sh             # Setup script (Linux/Mac)

│   │   ├── utils/             # Helper functions & API calls│   ├── setup.ps1            # Setup script (Windows)

│   │   ├── App.js             # Main App component│   └── Dockerfile           # Container setup

│   │   └── index.js           # Entry point├── scripts/                  # Additional automation

│   ├── public/                # Static assets├── package.json              # Dependencies

│   └── package.json           # Frontend dependencies├── index.html               # HTML entry point

├── backend/                   # Flask Backend├── .env.example             # Environment template (for easy access)

│   ├── models/               # Database models└── Config reference files   # Minimal files that point to requirements/config/

│   ├── routes/               # API endpoints``` friendly, interactive mental health support web application built with React, Tailwind CSS, and Framer Motion for the SIH (Smart India Hackathon) project.

│   ├── utils/                # Backend utilities

│   ├── app.py                # Main Flask application## 🚀 Quick Start

│   └── requirements.txt      # Python dependencies

├── setup.py                  # Easy setup script### Prerequisites

└── README.md                 # This file- **Node.js** v16.0.0+ 

```- **npm** v8.0.0+



## 🚀 Features### Simple Setup



### User Side```bash

- **🕵️ Creative Login**: James Bond-themed authentication# 1. Clone the repository

- **📝 Mental Health Assessment**: PHQ-9 & DASS-21 inspired questionnairegit clone https://github.com/roopaksai/mento.git

- **📊 Analysis & Reports**: Personalized, encouraging resultscd mento

- **🎵 Music & Motivation**: Curated playlists and quotes

- **🤖 Supportive Chatbot**: Encouraging conversations and tips# 2. Install and start

npm install

### Institution Sidenpm run dev

- **🏥 Institution Integration**: Partner organization support```

- **🚨 Severity Alerts**: Automatic notifications for high-risk cases

- **💬 Anonymous Counseling**: Secure 1:1 chat sessions**That's it!** Open http://localhost:3000 in your browser.

- **📈 Analytics Dashboard**: Aggregate insights (privacy-compliant)

### Alternative Setup

## 🛠️ Tech Stack```bash

# Use setup scripts

- **Frontend**: React, Tailwind CSS, React Routerrequirements/setup.sh         # macOS/Linux

- **Backend**: Flask (Python), SQLiterequirements/setup.ps1        # Windows

- **APIs**: RESTful API design```

- **Authentication**: JWT tokens

- **Database**: SQLite (easily upgradeable to PostgreSQL)## 📁 Clean Project Structure



## 🎯 Quick Start```

mento/                        # 🧹 CLEAN ROOT DIRECTORY

### Prerequisites├── src/                      # Source code

- Node.js v16+ ├── public/                   # Static assets  

- Python 3.8+├── requirements/             # �️ Setup & deployment files

- npm or yarn│   ├── setup.sh             # Setup script (Linux/Mac)

│   ├── setup.ps1            # Setup script (Windows)

### Installation│   ├── Dockerfile           # Container setup

│   └── .env                 # Environment template

```bash├── scripts/                  # Additional automation

# Clone the repository├── package.json              # Dependencies

git clone https://github.com/roopaksai/mento.git├── index.html               # HTML entry point

cd mento└── Essential config files   # Only what's needed

```

# Install frontend dependencies

cd frontend## 🎯 What Makes This Clean

npm install

- **🧹 Minimal root directory** - Only essential files visible

# Install backend dependencies- **📂 All configs organized** - Everything in `requirements/config/`

cd ../backend- **🔗 Smart references** - Root config files point to organized ones

pip install -r requirements.txt- **⚡ Simple setup** - Just `npm install && npm run dev`

- **🔧 No config mess** - All configurations tucked away

# Start development servers

# Terminal 1: Frontend## 🛠️ Development Commands

cd frontend && npm start

| Command | Description |

# Terminal 2: Backend|---------|-------------|

cd backend && python app.py| `npm run dev` | Start development server (localhost:3000) |

```| `npm run build` | Build for production |

| `npm run preview` | Preview production build |

### Access

- **Frontend**: http://localhost:3000## 🎨 Tech Stack

- **Backend API**: http://localhost:5000

- **React 18** - Modern UI library

## 📋 Development Workflow- **Vite** - Lightning-fast development  

- **Tailwind CSS** - Utility-first styling

1. **Frontend Development**: Work in `frontend/src/`- **Framer Motion** - Smooth animations

2. **Backend Development**: Work in `backend/`

3. **Testing**: Use provided test data and scenarios## 🚀 Ready to Build

4. **Deployment**: Use provided Docker files or deploy separately

The project is set up for building:

## 🔧 Configuration- 🙋‍♀️ Friendly user registration

- 🌦️ Interactive mood testing

### Environment Variables- 🤖 Chatbot companion (Mr. Bean)

Create `.env` files in both frontend and backend:- 🧘‍♀️ Relaxation features

- 📊 Smart reporting system

**Frontend (.env)**

```---

REACT_APP_API_URL=http://localhost:5000

REACT_APP_ENVIRONMENT=development**Happy Coding! 🎉** Clean, simple, and ready to go! 😊
```

**Backend (.env)**
```
FLASK_ENV=development
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///mento.db
```

## 🎨 Customization

### Adding New Questions
1. Modify `backend/utils/questions.py`
2. Update scoring logic in `backend/utils/analysis.py`
3. Add UI components in `frontend/src/components/`

### Institution Integration
1. Add institution domains in `backend/models/institutions.py`
2. Configure notification settings in `backend/utils/notifications.py`

### Chatbot Responses
1. Extend responses in `backend/utils/chatbot.py`
2. Add new conversation flows as needed

## 🔒 Privacy & Security

- **Data Encryption**: All sensitive data encrypted
- **Anonymity**: User identity protected in institutional communications
- **GDPR Compliant**: Data deletion and export features
- **Secure Sessions**: JWT-based authentication

## 📞 Support

For questions or issues:
- **Email**: support@mentohealth.com
- **Issues**: GitHub Issues page
- **Documentation**: `/docs` folder

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

**Built with 💙 for mental wellness and institutional collaboration**