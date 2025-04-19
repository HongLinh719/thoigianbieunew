import { CONFIG } from './config.js';
import { DataService } from './data.js';

export class UI {
    static updateTaskDisplay(childName) {
        const taskList = document.querySelector(`#${childName} .task-list`);
        const tasks = CONFIG.TASKS[childName];
        const savedData = DataService.getChildProgress(childName);
        
        if (taskList && tasks) {
            taskList.innerHTML = `
                <div class="progress-section">
                    <div class="tree-container">
                        <img src="${this.getTreeImage(savedData.points || 0)}" alt="Tree Progress" class="tree-image">
                        <img src="images/water.gif" alt="Watering" class="water-animation" style="display: none;">
                    </div>
                    <div class="points-display">
                        <span class="points">${savedData.points || 0}</span> điểm
                        <div class="level">Cấp độ ${this.getCurrentLevel(savedData.points || 0)}</div>
                    </div>
                </div>
                ${tasks.map(task => {
                    const savedTask = savedData.tasks.find(t => t.id === task.id);
                    return `
                        <div class="task ${savedTask?.rating || ''}">
                            <div class="task-header">
                                <div class="task-time">${task.time}</div>
                                <div class="task-name">${task.name}</div>
                                <div class="task-controls">
                                    ${task.audioPath ? `
                                        <button class="play-audio" onclick="new Audio('${task.audioPath}').play()">
                                            <i class="fas fa-volume-up"></i>
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                            <div class="rating-buttons">
                                <button class="rating-btn good-btn ${savedTask?.rating === 'good' ? 'active' : ''}"
                                        onclick="UI.handleTaskRating('${childName}', '${task.id}', 'good')">
                                    Tốt
                                </button>
                                <button class="rating-btn neutral-btn ${savedTask?.rating === 'neutral' ? 'active' : ''}"
                                        onclick="UI.handleTaskRating('${childName}', '${task.id}', 'neutral')">
                                    Bình thường
                                </button>
                                <button class="rating-btn bad-btn ${savedTask?.rating === 'bad' ? 'active' : ''}"
                                        onclick="UI.handleTaskRating('${childName}', '${task.id}', 'bad')">
                                    Chưa tốt
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            `;
        }
    }

    static updateLevelDisplay(childName) {
        const child = document.querySelector(`#${childName}`);
        if (child) {
            const profile = child.querySelector('child-profile');
            if (profile) {
                const data = JSON.parse(localStorage.getItem('kidScheduleData') || '{}');
                const childData = data[childName] || { level: 1, experience: 0 };
                profile.setAttribute('level', childData.level);
                profile.setAttribute('points', childData.experience);
            }
        }
    }

    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'bell'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 2700);
    }

    static playAudio(path) {
        const audio = new Audio(path);
        return audio.play();
    }

    static async playAudioEffect(type) {
        try {
            if (CONFIG.AUDIO_EFFECTS[type]) {
                const audio = new Audio(CONFIG.AUDIO_EFFECTS[type]);
                await audio.play();
            }
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    }

    static getTaskStatus(childName) {
        const savedData = DataService.getChildProgress(childName);
        const totalTasks = CONFIG.TASKS[childName].length;
        const completedTasks = savedData.tasks.filter(t => t.rating === 'good').length;
        
        return {
            total: totalTasks,
            completed: completedTasks,
            percentage: Math.round((completedTasks / totalTasks) * 100)
        };
    }

    static async handleTaskRating(childName, taskId, rating) {
        const pin = prompt('Nhập mã PIN để xác nhận (****)');
        if (pin !== CONFIG.PIN) {
            this.showNotification('Mã PIN không đúng!', 'error');
            return;
        }

        const data = DataService.getChildProgress(childName);
        const oldPoints = data.points || 0;
        const taskData = data.tasks.find(t => t.id === taskId) || { id: taskId };
        const oldRating = taskData.rating;

        // Cập nhật rating và điểm
        taskData.rating = rating;
        data.points = this.calculatePoints(data.tasks);
        
        // Lưu dữ liệu
        const taskIndex = data.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) {
            data.tasks.push(taskData);
        } else {
            data.tasks[taskIndex] = taskData;
        }
        DataService.saveChildProgress(childName, data);

        // Hiển thị hiệu ứng và phát âm thanh
        if (rating === 'good') {
            await this.showGoodTaskEffects(childName);
            // Kiểm tra level up
            const oldLevel = this.getCurrentLevel(oldPoints);
            const newLevel = this.getCurrentLevel(data.points);
            if (newLevel > oldLevel) {
                await this.showLevelUpEffects(childName, newLevel);
            }
        } else if (rating === 'neutral') {
            this.showNeutralTaskEffects(childName);
        } else if (rating === 'bad') {
            this.showBadTaskEffects(childName);
        }

        // Cập nhật hiển thị
        this.updateTaskDisplay(childName);
        this.showWateringEffect();
    }

    static calculatePoints(tasks) {
        return tasks.reduce((total, task) => {
            return total + (CONFIG.POINTS[task.rating] || 0);
        }, 0);
    }

    static getCurrentLevel(points) {
        const levels = Object.entries(CONFIG.LEVEL_THRESHOLDS)
            .sort(([, a], [, b]) => b - a);
        
        for (const [level, threshold] of levels) {
            if (points >= threshold) {
                return parseInt(level);
            }
        }
        return 1;
    }

    static getTreeImage(points) {
        const treeStage = Math.min(7, Math.floor(points / 50));
        return CONFIG.TREE_STAGES[treeStage];
    }

    static async showGoodTaskEffects(childName) {
        // Hiển thị avatar và tin nhắn động viên
        this.showMotivationMessage(childName, 'good');
        
        // Phát âm thanh chúc mừng và pháo hoa
        await Promise.all([
            new Audio(CONFIG.AUDIO_MESSAGES["chúc mừng"]()).play(),
            new Audio(CONFIG.AUDIO_MESSAGES["pháo hoa"]()).play()
        ]);
    }

    static async showNeutralTaskEffects(childName) {
        this.showMotivationMessage(childName, 'neutral');
        await new Audio(CONFIG.AUDIO_MESSAGES["ngủ đêm qua"]()).play();
    }

    static async showBadTaskEffects(childName) {
        this.showMotivationMessage(childName, 'bad');
        await Promise.all([
            new Audio(CONFIG.AUDIO_MESSAGES["cố gắng"]()).play(),
            new Audio(CONFIG.AUDIO_MESSAGES["chưa tốt"]()).play()
        ]);
    }

    static async showLevelUpEffects(childName, newLevel) {
        const levelUpMessage = document.createElement('div');
        levelUpMessage.className = 'level-up-message';
        levelUpMessage.innerHTML = `
            <div class="level-up-content">
                <img src="images/gift.png" alt="Level Up Gift">
                <h2>Chúc mừng!</h2>
                <p>Bé đã đạt cấp độ ${newLevel}!</p>
            </div>
        `;
        document.body.appendChild(levelUpMessage);
        
        setTimeout(() => {
            levelUpMessage.remove();
        }, 3000);
    }

    static showMotivationMessage(childName, type) {
        const messages = CONFIG.MOTIVATION_MESSAGES[childName][type];
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        const motivationEl = document.createElement('div');
        motivationEl.className = 'motivation-message';
        motivationEl.innerHTML = `
            <div class="motivation-content ${type}">
                <img src="images/me_quynh.jpg" alt="Mẹ Quỳnh" class="avatar">
                <div class="message">${message}</div>
            </div>
        `;
        
        document.body.appendChild(motivationEl);
        setTimeout(() => {
            motivationEl.remove();
        }, 3000);
    }

    static showWateringEffect() {
        const waterAnim = document.querySelector('.water-animation');
        if (waterAnim) {
            waterAnim.style.display = 'block';
            setTimeout(() => {
                waterAnim.style.display = 'none';
            }, 2000);
        }
    }

    // Weekly challenge tracking functions
    static updateWeeklyChallenge(childName) {
        const savedData = DataService.getChildProgress(childName);
        const challengeElement = document.querySelector('.weekly-challenge');
        
        if (!challengeElement) return;
        
        // Get or initialize the challenge data
        if (!savedData.weeklyChallenge) {
            savedData.weeklyChallenge = {
                startDate: new Date().toISOString(),
                consecutive: 0,
                completed: false,
                reward: false
            };
            DataService.saveChildProgress(childName, savedData);
        }
        
        // Update the UI
        const challenge = savedData.weeklyChallenge;
        const progressText = document.getElementById('challenge-progress-text');
        if (progressText) {
            progressText.textContent = `${challenge.consecutive}/5`;
        }
        
        // Check if challenge is completed
        if (challenge.consecutive >= 5 && !challenge.completed) {
            this.completeChallenge(childName);
        }
    }
    
    static completeChallenge(childName) {
        const savedData = DataService.getChildProgress(childName);
        savedData.weeklyChallenge.completed = true;
        DataService.saveChildProgress(childName, savedData);
        
        // Show challenge completion message
        const challengeMessage = document.createElement('div');
        challengeMessage.className = 'level-up-message';
        challengeMessage.innerHTML = `
            <div class="level-up-content">
                <img src="images/gift.png" alt="Challenge Reward">
                <h2>Thử thách hoàn thành!</h2>
                <p>Bé đã hoàn thành thử thách tuần này!</p>
                <p>Bé nhận được 100 điểm thưởng và một phần quà đặc biệt!</p>
            </div>
        `;
        document.body.appendChild(challengeMessage);
        
        // Add bonus points
        savedData.points = (savedData.points || 0) + 100;
        DataService.saveChildProgress(childName, savedData);
        
        setTimeout(() => {
            challengeMessage.remove();
            this.updateTaskDisplay(childName);
        }, 3000);
    }
    
    static checkConsecutiveGoodDays(childName) {
        const today = new Date();
        const savedData = DataService.getChildProgress(childName);
        
        // Initialize lastUpdate if needed
        if (!savedData.lastUpdate) {
            savedData.lastUpdate = today.toISOString();
            savedData.consecutiveGoodDays = 0;
            DataService.saveChildProgress(childName, savedData);
            return 0;
        }
        
        // Calculate consecutive good days
        const lastUpdate = new Date(savedData.lastUpdate);
        const tasks = CONFIG.TASKS[childName];
        const todaysTasks = savedData.tasks.filter(t => 
            tasks.find(task => task.id === t.id) && t.rating === 'good'
        );
        
        // Check if most tasks were good today
        if (todaysTasks.length >= tasks.length * 0.75) {
            // Check if last update was yesterday
            const dayDiff = (today.getTime() - lastUpdate.getTime()) / (1000 * 3600 * 24);
            if (Math.round(dayDiff) === 1) {
                savedData.consecutiveGoodDays = (savedData.consecutiveGoodDays || 0) + 1;
            } else if (Math.round(dayDiff) > 1) {
                // Break the streak if more than one day passed
                savedData.consecutiveGoodDays = 1;
            }
        } else {
            // Reset streak if today wasn't good
            savedData.consecutiveGoodDays = 0;
        }
        
        // Update weekly challenge consecutive days
        if (savedData.weeklyChallenge) {
            savedData.weeklyChallenge.consecutive = Math.max(
                savedData.weeklyChallenge.consecutive || 0,
                savedData.consecutiveGoodDays
            );
        }
        
        savedData.lastUpdate = today.toISOString();
        DataService.saveChildProgress(childName, savedData);
        
        // Update the challenge UI
        this.updateWeeklyChallenge(childName);
        
        return savedData.consecutiveGoodDays;
    }
    
    // Admin Functions
    static resetTree() {
        const activeTab = document.querySelector('.tab.active');
        if (!activeTab) return;
        
        const childName = activeTab.getAttribute('data-child');
        if (!childName) return;
        
        if (confirm(`Bạn có chắc muốn xóa tiến trình của ${childName} không?`)) {
            const savedData = DataService.getChildProgress(childName);
            savedData.points = 0;
            DataService.saveChildProgress(childName, savedData);
            this.updateTaskDisplay(childName);
            this.showNotification('Đã xóa tiến trình cây', 'info');
        }
    }
    
    static addWaterCredits(amount) {
        const activeTab = document.querySelector('.tab.active');
        if (!activeTab) return;
        
        const childName = activeTab.getAttribute('data-child');
        if (!childName) return;
        
        const savedData = DataService.getChildProgress(childName);
        savedData.waterCredits = (savedData.waterCredits || 0) + amount;
        DataService.saveChildProgress(childName, savedData);
        this.showNotification(`Đã thêm ${amount} lượt tưới cây`, 'success');
    }
    
    static updateLevelDisplay() {
        const activeTab = document.querySelector('.tab.active');
        if (!activeTab) return;
        
        const childName = activeTab.getAttribute('data-child');
        if (!childName) return;
        
        const savedData = DataService.getChildProgress(childName);
        const level = this.getCurrentLevel(savedData.points || 0);
        
        const levelElement = document.getElementById('levelNumber');
        const starsElement = document.getElementById('levelStars');
        
        if (levelElement) {
            levelElement.textContent = level;
        }
        
        if (starsElement) {
            starsElement.innerHTML = '★'.repeat(level);
        }
    }
}

// Weekly Challenge System
let currentChallenge = {
    type: 'task-streak', // Can be 'task-streak', 'points', 'special-task'
    task: 'di_ngu', // Task ID for task-streak challenges
    target: 3, // Number of times needed
    progress: 0, // Current progress
    reward: {
        wateringCan: 2, // Extra watering cans
        points: 0 // Extra points
    },
    completed: false
};

function initWeeklyChallenge() {
    // Load saved challenge from localStorage if available
    const savedChallenge = localStorage.getItem('weeklyChallenge');
    if (savedChallenge) {
        currentChallenge = JSON.parse(savedChallenge);
    }
    updateChallengeDisplay();
    
    // Reset challenge if it's a new week
    const lastReset = localStorage.getItem('lastChallengeReset');
    const now = new Date();
    const startOfWeek = getStartOfWeek(now);
    
    if (!lastReset || new Date(lastReset).getTime() < startOfWeek.getTime()) {
        resetWeeklyChallenge();
        localStorage.setItem('lastChallengeReset', startOfWeek.toISOString());
    }
}

function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    return new Date(d.setDate(diff));
}

function resetWeeklyChallenge() {
    // Create a new random challenge
    const challengeTypes = [
        {
            type: 'task-streak',
            task: 'di_ngu',
            description: 'Hoàn thành <strong>3 nhiệm vụ</strong> Đi ngủ đúng giờ liên tiếp!',
            target: 3,
            reward: { wateringCan: 2, points: 0 }
        },
        {
            type: 'task-streak',
            task: 'thuc_day_ve_sinh_ca_nhan_di_hoc',
            description: 'Hoàn thành <strong>4 nhiệm vụ</strong> Thức dậy đúng giờ liên tiếp!',
            target: 4,
            reward: { wateringCan: 2, points: 50 }
        },
        {
            type: 'points',
            description: 'Đạt được <strong>100 điểm</strong> trong tuần này!',
            target: 100,
            reward: { wateringCan: 3, points: 0 }
        }
    ];
    
    const randomChallenge = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
    
    currentChallenge = {
        ...randomChallenge,
        progress: 0,
        completed: false
    };
    
    saveWeeklyChallenge();
    updateChallengeDisplay();
}

function updateChallengeProgress(taskId, rating) {
    if (currentChallenge.completed) return;
    
    if (currentChallenge.type === 'task-streak' && taskId === currentChallenge.task && rating === 'good') {
        currentChallenge.progress++;
        if (currentChallenge.progress >= currentChallenge.target) {
            completeChallenge();
        }
    } else if (currentChallenge.type === 'task-streak' && taskId === currentChallenge.task && rating !== 'good') {
        // Reset progress for streak challenges if failed
        currentChallenge.progress = 0;
    } else if (currentChallenge.type === 'points') {
        // Update based on points earned
        const pointValues = { good: 10, neutral: 5, bad: 0 };
        currentChallenge.progress += pointValues[rating];
        
        if (currentChallenge.progress >= currentChallenge.target) {
            completeChallenge();
        }
    }
    
    saveWeeklyChallenge();
    updateChallengeDisplay();
}

function completeChallenge() {
    currentChallenge.completed = true;
    
    // Apply rewards
    if (currentChallenge.reward.wateringCan) {
        // Add extra watering cans
        const currentWateringCans = parseInt(localStorage.getItem('wateringCans') || '0');
        localStorage.setItem('wateringCans', currentWateringCans + currentChallenge.reward.wateringCan);
    }
    
    if (currentChallenge.reward.points) {
        // Add bonus points
        const currentProfile = localStorage.getItem('activeProfile');
        const profileData = JSON.parse(localStorage.getItem(`profile_${currentProfile}`)) || { points: 0 };
        profileData.points += currentChallenge.reward.points;
        localStorage.setItem(`profile_${currentProfile}`, JSON.stringify(profileData));
    }
    
    // Show celebration
    showCongratulation('Chúc mừng! Bé đã hoàn thành thử thách tuần này!');
    
    // Play celebration sound
    const audio = document.getElementById('audio-congrats');
    audio.src = 'audio/firework.mp3';
    audio.play();
    
    // Trigger fireworks
    triggerFireworks();
    
    saveWeeklyChallenge();
    updateChallengeDisplay();
    updatePointsDisplay(); // Update points if reward included points
}

function updateChallengeDisplay() {
    // Update challenge description
    const challengeDesc = document.getElementById('current-challenge');
    if (challengeDesc) {
        if (currentChallenge.type === 'task-streak') {
            const taskName = getTaskName(currentChallenge.task);
            challengeDesc.innerHTML = `Hoàn thành <strong>${currentChallenge.target} nhiệm vụ</strong> ${taskName} liên tiếp!`;
        } else if (currentChallenge.description) {
            challengeDesc.innerHTML = currentChallenge.description;
        }
    }
    
    // Update progress
    const progressFill = document.getElementById('challenge-progress-fill');
    const progressText = document.getElementById('challenge-progress-text');
    
    if (progressFill && progressText) {
        const progressPercentage = Math.min(100, (currentChallenge.progress / currentChallenge.target) * 100);
        progressFill.style.width = `${progressPercentage}%`;
        progressText.textContent = `${currentChallenge.progress}/${currentChallenge.target}`;
    }
    
    // Update reward text
    const rewardText = document.getElementById('challenge-reward');
    if (rewardText) {
        let rewardString = '';
        
        if (currentChallenge.reward.wateringCan) {
            rewardString += `${currentChallenge.reward.wateringCan} lượt tưới nước đặc biệt`;
        }
        
        if (currentChallenge.reward.points) {
            if (rewardString) rewardString += ' và ';
            rewardString += `${currentChallenge.reward.points} điểm thưởng`;
        }
        
        rewardText.textContent = rewardString;
    }
    
    // Update status for completed challenge
    if (currentChallenge.completed) {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) progressBar.style.backgroundColor = '#ffc107';
        
        if (challengeDesc) {
            challengeDesc.innerHTML += ' <span style="color: green">✓ Đã hoàn thành!</span>';
        }
    }
}

function saveWeeklyChallenge() {
    localStorage.setItem('weeklyChallenge', JSON.stringify(currentChallenge));
}

function getTaskName(taskId) {
    // Map task IDs to readable names
    const taskNames = {
        'di_ngu': 'Đi ngủ đúng giờ',
        'thuc_day_ve_sinh_ca_nhan_di_hoc': 'Thức dậy đúng giờ',
        've_sinh_ca_nhan_buoi_toi': 'Vệ sinh cá nhân buổi tối',
        'doc_sach_to_mau_hoac_lam_toan': 'Đọc sách hoặc làm toán',
        'an_toi_tai_nha': 'Ăn tối tại nhà',
        'choi_tu_do': 'Chơi tự do'
    };
    
    return taskNames[taskId] || taskId;
}

// Admin controls
function initAdminControls() {
    // Create admin toggle
    const adminToggle = document.createElement('div');
    adminToggle.id = 'admin-toggle';
    adminToggle.innerHTML = '<i class="fas fa-cog"></i>';
    document.body.appendChild(adminToggle);
    
    // Toggle admin panel visibility
    adminToggle.addEventListener('click', function() {
        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel) {
            adminPanel.style.display = adminPanel.style.display === 'none' ? 'block' : 'none';
        }
    });
    
    // Add event listeners for admin buttons
    document.getElementById('btn-add-water')?.addEventListener('click', function() {
        const currentWateringCans = parseInt(localStorage.getItem('wateringCans') || '0');
        localStorage.setItem('wateringCans', currentWateringCans + 1);
        updateWateringCanDisplay();
        showMotivationMessage('Đã thêm 1 lượt tưới nước!');
    });
    
    document.getElementById('btn-reset-tree')?.addEventListener('click', function() {
        if (confirm('Bạn có chắc muốn đặt lại cây không?')) {
            localStorage.setItem('treeLevel', '1');
            updateTreeDisplay();
            showMotivationMessage('Đã đặt lại cây!');
        }
    });
    
    document.getElementById('btn-trigger-fireworks')?.addEventListener('click', function() {
        triggerFireworks();
    });
}

// Fireworks effect
function triggerFireworks() {
    // Create container for fireworks
    let fireworksContainer = document.getElementById('fireworks-container');
    if (!fireworksContainer) {
        fireworksContainer = document.createElement('div');
        fireworksContainer.id = 'fireworks-container';
        fireworksContainer.style.position = 'fixed';
        fireworksContainer.style.top = '0';
        fireworksContainer.style.left = '0';
        fireworksContainer.style.width = '100%';
        fireworksContainer.style.height = '100%';
        fireworksContainer.style.pointerEvents = 'none';
        fireworksContainer.style.zIndex = '9999';
        document.body.appendChild(fireworksContainer);
    }
    
    // Create 10 random fireworks
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createFirework(fireworksContainer);
        }, i * 300);
    }
    
    // Play sound
    const audio = document.getElementById('audio-congrats');
    audio.src = 'audio/firework.mp3';
    audio.play();
    
    // Remove container after animation completes
    setTimeout(() => {
        if (fireworksContainer.parentNode) {
            fireworksContainer.parentNode.removeChild(fireworksContainer);
        }
    }, 5000);
}

function createFirework(container) {
    const firework = document.createElement('div');
    const x = Math.random() * 100;
    const y = 30 + Math.random() * 40;
    
    firework.style.position = 'absolute';
    firework.style.left = `${x}%`;
    firework.style.top = `${y}%`;
    firework.style.width = '5px';
    firework.style.height = '5px';
    firework.style.borderRadius = '50%';
    firework.style.boxShadow = '0 0 10px 5px rgba(255, 165, 0, 0.8)';
    
    // Random color
    const hue = Math.floor(Math.random() * 360);
    firework.style.backgroundColor = `hsl(${hue}, 100%, 60%)`;
    
    // Animation
    firework.style.animation = 'firework 1s forwards';
    
    // Add keyframe animation if it doesn't exist
    if (!document.getElementById('fireworks-keyframes')) {
        const style = document.createElement('style');
        style.id = 'fireworks-keyframes';
        style.innerHTML = `
            @keyframes firework {
                0% { transform: scale(1); opacity: 1; }
                20% { transform: scale(30); opacity: 0.8; }
                100% { transform: scale(40); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    container.appendChild(firework);
    
    // Remove after animation
    setTimeout(() => {
        container.removeChild(firework);
    }, 1000);
}

// Initialize admin controls and weekly challenge when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    initWeeklyChallenge();
    initAdminControls();
    
    // Add tasks rating event listeners to update challenge progress
    document.querySelectorAll('.rating-btn').forEach(button => {
        button.addEventListener('click', function() {
            const taskId = this.closest('.task').dataset.id;
            const rating = this.dataset.rating;
            updateChallengeProgress(taskId, rating);
        });
    });
});