// ====================================
// MENTO - Mental Health Support Website
// Interactive JavaScript for animations, 
// mood tracking, and user interactions
// ====================================

// Global variables for user data
let userData = {
    name: '',
    avatar: '',
    selectedMood: '',
    selectedColor: '',
    selectedActivity: ''
};

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupAvatarSelection();
    setupMoodButtons();
    setupColorMoodButtons();
    setupActivityButtons();
    setupSoundButtons();
    setupBreathingExercise();
    setupDoodleCanvas();
    setupChatBot();
    setupSmoothScrolling();
    addAnimationEffects();
}

// ====================================
// HERO SECTION & REGISTRATION
// ====================================

function greetUser() {
    const nameInput = document.getElementById('userName');
    const name = nameInput.value.trim();
    
    if (name) {
        userData.name = name;
        showNotification(`Nice to meet you, ${name}! 👋`, 'success');
        
        // Smooth scroll to mood test
        setTimeout(() => {
            document.getElementById('mood-test').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }, 1000);
    } else {
        showNotification('Please tell me your name first! 😊', 'warning');
        nameInput.focus();
    }
}

function setupAvatarSelection() {
    const avatarButtons = document.querySelectorAll('.avatar-btn');
    
    avatarButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove previous selection
            avatarButtons.forEach(btn => btn.classList.remove('ring-4', 'ring-happy', 'bg-happy/30'));
            
            // Add selection to clicked button
            this.classList.add('ring-4', 'ring-happy', 'bg-happy/30');
            
            userData.avatar = this.dataset.avatar;
            showNotification(`Great choice! ${this.dataset.avatar || '🎨'}`, 'success');
        });
    });
}

// ====================================
// MOOD TEST SECTION
// ====================================

function setupMoodButtons() {
    const moodButtons = document.querySelectorAll('.mood-btn');
    
    moodButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove previous selection
            moodButtons.forEach(btn => btn.classList.remove('ring-4', 'ring-blue-400', 'scale-105'));
            
            // Add selection animation
            this.classList.add('ring-4', 'ring-blue-400', 'scale-105');
            this.style.animation = 'glow 0.5s ease-in-out';
            
            userData.selectedMood = this.dataset.mood;
            showNotification(`You're feeling ${this.dataset.mood}! 🌈`, 'info');
            
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    });
}

function setupColorMoodButtons() {
    const colorButtons = document.querySelectorAll('.color-mood');
    
    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove previous selection
            colorButtons.forEach(btn => btn.classList.remove('ring-4', 'ring-offset-2'));
            
            // Add selection
            this.classList.add('ring-4', 'ring-offset-2');
            
            userData.selectedColor = this.dataset.color;
            showNotification(`${this.dataset.color} mood selected! 🎨`, 'info');
        });
    });
}

function setupActivityButtons() {
    const activityButtons = document.querySelectorAll('.activity-btn');
    
    activityButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove previous selection
            activityButtons.forEach(btn => btn.classList.remove('ring-4', 'ring-white'));
            
            // Add selection
            this.classList.add('ring-4', 'ring-white');
            
            userData.selectedActivity = this.dataset.activity;
            
            const activity = this.dataset.activity;
            let message = '';
            
            switch(activity) {
                case 'relax':
                    message = "Let's find your peace! 🧘‍♀️";
                    setTimeout(() => {
                        document.getElementById('relax').scrollIntoView({ behavior: 'smooth' });
                    }, 1000);
                    break;
                case 'talk':
                    message = "I'm here to listen! 💬";
                    setTimeout(() => {
                        document.getElementById('chat').scrollIntoView({ behavior: 'smooth' });
                    }, 1000);
                    break;
                case 'laugh':
                    message = "Let's brighten your day! 😄";
                    break;
            }
            
            showNotification(message, 'success');
        });
    });
}

// ====================================
// RELAXATION HUB
// ====================================

function setupSoundButtons() {
    const soundButtons = document.querySelectorAll('.sound-btn');
    const audioPlayer = document.getElementById('audioPlayer');
    const currentSoundSpan = document.getElementById('currentSound');
    const stopButton = document.getElementById('stopSound');
    
    let currentAudio = null;
    
    soundButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sound = this.dataset.sound;
            
            // Stop current audio if playing
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
            }
            
            // Remove previous active state
            soundButtons.forEach(btn => btn.classList.remove('ring-4', 'ring-calm'));
            
            // Add active state to clicked button
            this.classList.add('ring-4', 'ring-calm');
            
            // Show audio player
            audioPlayer.classList.remove('hidden');
            currentSoundSpan.textContent = sound.charAt(0).toUpperCase() + sound.slice(1);
            
            // Simulate audio playback (you can replace with actual audio files)
            showNotification(`Playing ${sound} sounds... 🎵`, 'info');
            
            // Create mock audio element for demo
            currentAudio = {
                pause: () => {
                    audioPlayer.classList.add('hidden');
                    soundButtons.forEach(btn => btn.classList.remove('ring-4', 'ring-calm'));
                    showNotification('Sound stopped 🔇', 'info');
                }
            };
        });
    });
    
    stopButton.addEventListener('click', function() {
        if (currentAudio) {
            currentAudio.pause();
        }
    });
}

function setupBreathingExercise() {
    const breathingCircle = document.getElementById('breathingCircle');
    const breathingText = document.getElementById('breathingText');
    const breathingBtn = document.getElementById('breathingBtn');
    
    let isBreathing = false;
    let breathingInterval;
    
    breathingBtn.addEventListener('click', function() {
        if (!isBreathing) {
            startBreathing();
        } else {
            stopBreathing();
        }
    });
    
    function startBreathing() {
        isBreathing = true;
        breathingBtn.textContent = 'Stop Breathing';
        breathingBtn.classList.add('bg-red-400', 'hover:bg-red-500');
        breathingBtn.classList.remove('bg-calm', 'hover:bg-green-600');
        
        let phase = 0; // 0: breathe in, 1: hold, 2: breathe out, 3: hold
        let count = 0;
        
        breathingInterval = setInterval(() => {
            switch(phase) {
                case 0: // Breathe in
                    if (count === 0) {
                        breathingText.textContent = 'Breathe in slowly... 💨';
                        breathingCircle.style.transform = 'scale(1.3)';
                        breathingCircle.style.backgroundColor = '#06d6a0';
                    }
                    if (count >= 4) {
                        phase = 1;
                        count = 0;
                    }
                    break;
                case 1: // Hold
                    if (count === 0) {
                        breathingText.textContent = 'Hold... ⏸️';
                    }
                    if (count >= 2) {
                        phase = 2;
                        count = 0;
                    }
                    break;
                case 2: // Breathe out
                    if (count === 0) {
                        breathingText.textContent = 'Breathe out slowly... 🌬️';
                        breathingCircle.style.transform = 'scale(1)';
                        breathingCircle.style.backgroundColor = '#8b5cf6';
                    }
                    if (count >= 4) {
                        phase = 3;
                        count = 0;
                    }
                    break;
                case 3: // Hold
                    if (count === 0) {
                        breathingText.textContent = 'Hold... ⏸️';
                    }
                    if (count >= 2) {
                        phase = 0;
                        count = 0;
                    }
                    break;
            }
            count++;
        }, 1000);
    }
    
    function stopBreathing() {
        isBreathing = false;
        clearInterval(breathingInterval);
        breathingBtn.textContent = 'Start Breathing';
        breathingBtn.classList.remove('bg-red-400', 'hover:bg-red-500');
        breathingBtn.classList.add('bg-calm', 'hover:bg-green-600');
        breathingText.textContent = 'Click to start breathing exercise';
        breathingCircle.style.transform = 'scale(1)';
        breathingCircle.style.backgroundColor = '';
    }
}

function setupDoodleCanvas() {
    const canvas = document.getElementById('doodleCanvas');
    const ctx = canvas.getContext('2d');
    const colorPickers = document.querySelectorAll('.color-picker');
    const clearButton = document.getElementById('clearCanvas');
    
    let isDrawing = false;
    let currentColor = '#ef4444'; // Default red
    
    // Set up canvas
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;
    
    // Color picker functionality
    colorPickers.forEach(picker => {
        picker.addEventListener('click', function() {
            currentColor = this.dataset.color;
            ctx.strokeStyle = currentColor;
            
            // Remove previous selection
            colorPickers.forEach(p => p.classList.remove('ring-4', 'ring-gray-400'));
            // Add selection
            this.classList.add('ring-4', 'ring-gray-400');
        });
    });
    
    // Drawing functionality
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
    
    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
    
    function stopDrawing() {
        if (isDrawing) {
            isDrawing = false;
            ctx.beginPath();
        }
    }
    
    function handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                        e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }
    
    // Clear canvas
    clearButton.addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        showNotification('Canvas cleared! 🎨', 'info');
    });
}

// ====================================
// CHATBOT FUNCTIONALITY
// ====================================

function setupChatBot() {
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    
    // Scroll to bottom of chat
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Add message to chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex items-start space-x-3 ${isUser ? 'justify-end' : ''}`;
        
        messageDiv.innerHTML = `
            ${isUser ? '' : '<div class="text-2xl">🤖</div>'}
            <div class="${isUser ? 'bg-purple-400 text-white' : 'bg-purple-100'} rounded-2xl px-4 py-2 max-w-xs">
                <p class="text-sm">${message}</p>
            </div>
            ${isUser ? '<div class="text-2xl">😊</div>' : ''}
        `;
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // Bot responses
    const botResponses = {
        greetings: [
            "Hello! I'm so happy to chat with you! 😊",
            "Hi there! How can I help brighten your day? 🌟",
            "Hey! It's great to see you here! 💙"
        ],
        support: [
            "I'm here for you. Remember, it's okay to not be okay sometimes. 🤗",
            "You're so brave for reaching out. What's on your mind today? 💙",
            "Take a deep breath with me. You're not alone in this journey. 🫁"
        ],
        jokes: [
            "Why don't scientists trust atoms? Because they make up everything! 😄",
            "What do you call a bear with no teeth? A gummy bear! 🐻",
            "Why did the scarecrow win an award? He was outstanding in his field! 🌾"
        ],
        relaxation: [
            "Try taking 5 deep breaths with me. Breathe in peace, breathe out stress. 🧘‍♀️",
            "How about listening to some calming rain sounds? I find them very soothing! 🌧️",
            "Let's do a quick mindfulness exercise. Notice 5 things you can see right now. 👀"
        ],
        default: [
            "That's interesting! Tell me more about how you're feeling. 💭",
            "I hear you. It sounds like you have a lot on your mind. 🤔",
            "Thank you for sharing that with me. How does that make you feel? 💙"
        ]
    };
    
    function getBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return getRandomResponse(botResponses.greetings);
        } else if (message.includes('support') || message.includes('help') || message.includes('sad') || message.includes('down')) {
            return getRandomResponse(botResponses.support);
        } else if (message.includes('joke') || message.includes('funny') || message.includes('laugh')) {
            return getRandomResponse(botResponses.jokes);
        } else if (message.includes('relax') || message.includes('calm') || message.includes('stress')) {
            return getRandomResponse(botResponses.relaxation);
        } else {
            return getRandomResponse(botResponses.default);
        }
    }
    
    function getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Global functions for chat
    window.sendMessage = function() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatInput.value = '';
            
            // Bot response after delay
            setTimeout(() => {
                const response = getBotResponse(message);
                addMessage(response);
            }, 1000 + Math.random() * 1000); // Random delay 1-2 seconds
        }
    };
    
    window.handleChatKeyPress = function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };
    
    window.quickReply = function(message) {
        addMessage(message, true);
        
        // Bot response
        setTimeout(() => {
            const response = getBotResponse(message);
            addMessage(response);
        }, 800);
    };
}

// ====================================
// ANIMATIONS & EFFECTS
// ====================================

function addAnimationEffects() {
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });
}

function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ====================================
// UTILITY FUNCTIONS
// ====================================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-all duration-300`;
    
    // Style based on type
    switch(type) {
        case 'success':
            notification.classList.add('bg-green-500', 'text-white');
            break;
        case 'warning':
            notification.classList.add('bg-yellow-500', 'text-white');
            break;
        case 'error':
            notification.classList.add('bg-red-500', 'text-white');
            break;
        default:
            notification.classList.add('bg-blue-500', 'text-white');
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ====================================
// RESPONSIVE MOBILE MENU
// ====================================

function setupMobileMenu() {
    // Add mobile menu toggle if needed
    const nav = document.querySelector('nav');
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        // Add mobile menu functionality here if needed
        console.log('Mobile view detected');
    }
}

// ====================================
// RESIZE HANDLER
// ====================================

window.addEventListener('resize', function() {
    setupMobileMenu();
    
    // Resize canvas if needed
    const canvas = document.getElementById('doodleCanvas');
    if (canvas) {
        // Maintain canvas aspect ratio on resize
        const container = canvas.parentElement;
        const containerWidth = container.offsetWidth;
        if (containerWidth < 300) {
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
        }
    }
});

// ====================================
// INITIAL SETUP
// ====================================

// Show welcome message
setTimeout(() => {
    showNotification('Welcome to Mento! Your mental health companion 🌟', 'success');
}, 1000);

console.log('🌟 Mento Mental Health Support Website Loaded Successfully! 🌟');