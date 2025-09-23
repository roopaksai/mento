@echo off
echo 🚀 Starting Mental Wellness App (MERN Stack)
echo.

echo 📦 Installing dependencies...
cd backend
call npm install
cd ..\frontend
call npm install
cd ..

echo.
echo 🗄️ Initializing database...
cd backend
call npm run init-db
cd ..

echo.
echo 🌟 Setup complete! Starting applications...
echo.

start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
start "Frontend App" cmd /k "cd frontend && npm start"

echo.
echo ✅ Applications starting...
echo 🔗 Frontend: http://localhost:3000
echo 🔗 Backend: http://localhost:5000
echo 👤 Admin Login: admin@mentalwell.com / admin123
echo.
pause