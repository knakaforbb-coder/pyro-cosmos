// PYRO COSMOS - Main Application JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initMoodSelector();
    initSliders();
    initPainOptions();
    initSubmitCondition();
    initQuickEntry();
    initGreeting();
});

// ========== Navigation ==========
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const pageName = this.dataset.page;
            
            // Update nav
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Update pages
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === pageName + 'Page') {
                    page.classList.add('active');
                }
            });
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        });
    });
}

// ========== Mood Selector ==========
function initMoodSelector() {
    const moodOptions = document.querySelectorAll('.mood-option');
    
    moodOptions.forEach(option => {
        option.addEventListener('click', function() {
            moodOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            // Animation
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
}

// ========== Sliders ==========
function initSliders() {
    const sliderConfigs = [
        { id: 'sleepSlider', valueId: 'sleepValue', labels: ['悪い', '普通', '良い', '良い', '最高'] },
        { id: 'sleepHoursSlider', valueId: 'sleepHoursValue', format: (v) => v + '時間' },
        { id: 'fatigueSlider', valueId: 'fatigueValue', labels: ['なし', '軽い', 'やや疲れ', '疲れ', 'かなり疲労'] },
        { id: 'mentalSlider', valueId: 'mentalValue', labels: ['落ち込み', 'やや低下', '普通', '良好', '絶好調'] }
    ];
    
    sliderConfigs.forEach(config => {
        const slider = document.getElementById(config.id);
        const valueDisplay = document.getElementById(config.valueId);
        
        if (slider && valueDisplay) {
            slider.addEventListener('input', function() {
                const value = this.value;
                if (config.format) {
                    valueDisplay.textContent = config.format(value);
                } else if (config.labels) {
                    valueDisplay.textContent = config.labels[value - 1];
                }
                
                // Update gradient
                const percent = ((value - this.min) / (this.max - this.min)) * 100;
                this.style.background = `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${percent}%, var(--surface-primary) ${percent}%, var(--surface-primary) 100%)`;
            });
            
            // Trigger initial state
            slider.dispatchEvent(new Event('input'));
        }
    });
}

// ========== Pain Options ==========
function initPainOptions() {
    const painBtns = document.querySelectorAll('.pain-btn');
    const painLocation = document.getElementById('painLocation');
    
    painBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            painBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide location input
            if (this.dataset.pain !== 'none' && painLocation) {
                painLocation.classList.remove('hidden');
            } else if (painLocation) {
                painLocation.classList.add('hidden');
            }
        });
    });
}

// ========== Submit Condition ==========
function initSubmitCondition() {
    const submitBtn = document.getElementById('submitCondition');
    const successModal = document.getElementById('successModal');
    const closeBtn = document.getElementById('closeSuccessModal');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            // Collect data
            const data = collectConditionData();
            console.log('Condition Data:', data);
            
            // Save to localStorage
            saveConditionData(data);
            
            // Show success modal
            if (successModal) {
                successModal.classList.add('active');
                createConfetti();
            }
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate([50, 50, 50]);
            }
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            successModal.classList.remove('active');
            // Navigate to home
            document.querySelector('.nav-item[data-page="home"]').click();
        });
    }
}

function collectConditionData() {
    const selectedMood = document.querySelector('.mood-option.selected');
    const selectedPain = document.querySelector('.pain-btn.active');
    
    return {
        date: new Date().toISOString(),
        mood: selectedMood ? selectedMood.dataset.value : null,
        sleepQuality: document.getElementById('sleepSlider')?.value,
        sleepHours: document.getElementById('sleepHoursSlider')?.value,
        fatigue: document.getElementById('fatigueSlider')?.value,
        mental: document.getElementById('mentalSlider')?.value,
        weight: document.getElementById('weightInput')?.value,
        temperature: document.getElementById('tempInput')?.value,
        pain: selectedPain?.dataset.pain,
        painLocation: document.getElementById('painLocationInput')?.value,
        notes: document.getElementById('notesInput')?.value
    };
}

function saveConditionData(data) {
    const history = JSON.parse(localStorage.getItem('conditionHistory') || '[]');
    history.push(data);
    localStorage.setItem('conditionHistory', JSON.stringify(history));
    
    // Update streak
    updateStreak();
}

function updateStreak() {
    let streak = parseInt(localStorage.getItem('streak') || '0');
    const lastEntry = localStorage.getItem('lastEntryDate');
    const today = new Date().toDateString();
    
    if (lastEntry !== today) {
        streak++;
        localStorage.setItem('streak', streak.toString());
        localStorage.setItem('lastEntryDate', today);
    }
}

// ========== Confetti ==========
function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    if (!confettiContainer) return;
    
    confettiContainer.innerHTML = '';
    const colors = ['#3B82F6', '#F97316', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.cssText = `
            left: ${Math.random() * 100}%;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            animation-delay: ${Math.random() * 2}s;
            animation-duration: ${2 + Math.random() * 2}s;
        `;
        confettiContainer.appendChild(confetti);
    }
}

// ========== Quick Entry ==========
function initQuickEntry() {
    const quickMoodBtns = document.querySelectorAll('.mood-quick-select .mood-btn');
    
    quickMoodBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const mood = this.dataset.mood;
            
            // Navigate to condition page
            document.querySelector('.nav-item[data-page="condition"]').click();
            
            // Select corresponding mood
            setTimeout(() => {
                const moodMap = { 'great': '5', 'good': '4', 'okay': '3', 'tired': '2', 'bad': '1' };
                const moodOption = document.querySelector(`.mood-option[data-value="${moodMap[mood]}"]`);
                if (moodOption) {
                    moodOption.click();
                }
            }, 100);
        });
    });
    
    // Card click
    const quickEntryCard = document.getElementById('quickEntryCard');
    if (quickEntryCard) {
        quickEntryCard.addEventListener('click', function() {
            document.querySelector('.nav-item[data-page="condition"]').click();
        });
    }
}

// ========== Greeting ==========
function initGreeting() {
    const greetingSub = document.querySelector('.greeting-sub');
    if (!greetingSub) return;
    
    const hour = new Date().getHours();
    let greeting = 'こんばんは';
    
    if (hour >= 5 && hour < 12) {
        greeting = 'おはようございます';
    } else if (hour >= 12 && hour < 18) {
        greeting = 'こんにちは';
    }
    
    greetingSub.textContent = greeting;
}

// ========== Ripple Effect ==========
document.addEventListener('click', function(e) {
    const target = e.target.closest('.glass-card, .submit-btn, .menu-item');
    if (!target) return;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    
    target.style.position = 'relative';
    target.style.overflow = 'hidden';
    target.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
});
