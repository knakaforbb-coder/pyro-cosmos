// PYRO COSMOS - Coach Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initFilters();
    initAthleteCards();
    initAlerts();
});

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const section = this.dataset.section;
            console.log('Navigate to:', section);
        });
    });
}

// Position Filters
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const athleteCards = document.querySelectorAll('.athlete-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.textContent;

            athleteCards.forEach(card => {
                const position = card.querySelector('.athlete-position')?.textContent;

                if (filter === '全員' || position === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.3s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Athlete Card Interactions
function initAthleteCards() {
    const cards = document.querySelectorAll('.athlete-card');

    cards.forEach(card => {
        card.addEventListener('click', function () {
            const name = this.querySelector('.athlete-name')?.textContent;
            console.log('View athlete:', name);
            // Could open a modal or navigate to detail page
            showAthleteModal(this);
        });
    });
}

function showAthleteModal(card) {
    const name = card.querySelector('.athlete-name')?.textContent;
    const position = card.querySelector('.athlete-position')?.textContent;

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'athlete-modal-overlay';
    modal.innerHTML = `
        <div class="athlete-modal">
            <div class="modal-header">
                <h2>${name}</h2>
                <span class="modal-position">${position}</span>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>詳細データを表示中...</p>
                <div class="modal-stats">
                    <div class="modal-stat">
                        <span class="label">今週の平均睡眠</span>
                        <span class="value">7.2時間</span>
                    </div>
                    <div class="modal-stat">
                        <span class="label">コンディション推移</span>
                        <span class="value">↑ 改善中</span>
                    </div>
                    <div class="modal-stat">
                        <span class="label">入力率</span>
                        <span class="value">92%</span>
                    </div>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn-message">メッセージ送信</button>
                <button class="btn-detail">詳細を見る</button>
            </div>
        </div>
    `;

    // Add styles
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.2s ease;
    `;

    const modalContent = modal.querySelector('.athlete-modal');
    modalContent.style.cssText = `
        background: #1E293B;
        border-radius: 20px;
        padding: 24px;
        width: 90%;
        max-width: 400px;
        animation: slideUp 0.3s ease;
    `;

    document.body.appendChild(modal);

    // Close handlers
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Alert Actions
function initAlerts() {
    const alertActions = document.querySelectorAll('.alert-action');

    alertActions.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const alertCard = this.closest('.alert-card');
            const name = alertCard.querySelector('.alert-name')?.textContent;
            console.log('View alert for:', name);
        });
    });
}

// Add keyframe animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .modal-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
        position: relative;
    }
    .modal-header h2 { font-size: 20px; }
    .modal-position {
        background: rgba(59, 130, 246, 0.2);
        color: #3B82F6;
        padding: 4px 12px;
        border-radius: 999px;
        font-size: 12px;
    }
    .modal-close {
        position: absolute;
        right: 0;
        top: 0;
        background: none;
        border: none;
        color: #94A3B8;
        font-size: 24px;
        cursor: pointer;
    }
    .modal-stats {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 16px;
    }
    .modal-stat {
        display: flex;
        justify-content: space-between;
        padding: 12px;
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
    }
    .modal-stat .label { color: #94A3B8; font-size: 13px; }
    .modal-stat .value { font-weight: 600; }
    .modal-actions {
        display: flex;
        gap: 12px;
        margin-top: 24px;
    }
    .modal-actions button {
        flex: 1;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }
    .btn-message {
        background: rgba(255,255,255,0.1);
        color: #F8FAFC;
    }
    .btn-detail {
        background: linear-gradient(135deg, #3B82F6, #2563EB);
        color: white;
    }
`;
document.head.appendChild(style);
