import { CONFIG } from './config.js';
import { DataService } from './data.js';

export class UI {
    static updateTaskDisplay(childName) {
        const taskList = document.querySelector(`#${childName} .task-list`);
        const data = DataService.getChildProgress(childName);
        taskList.innerHTML = this.generateTasksHTML(data.tasks);
    }

    static updateLevelDisplay(childName) {
        const levelElement = document.querySelector(`#${childName}-level`);
        const data = DataService.getChildProgress(childName);
        const level = CONFIG.LEVELS[data.level];
        
        if (levelElement && level) {
            levelElement.textContent = `${level.title} - Cấp ${data.level}`;
        }
    }

    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-bell"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    static generateTasksHTML(tasks) {
        return tasks.map(task => `
            <div class="task ${task.rating || ''}" data-task-id="${task.id}">
                <div class="task-header">
                    <div class="task-time">${task.time}</div>
                    <div class="task-name">${task.name}</div>
                </div>
                <div class="rating-buttons">
                    ${this.generateRatingButtons(task)}
                </div>
            </div>
        `).join('');
    }

    static generateRatingButtons(task) {
        const ratings = [
            { value: 'good', icon: 'smile', text: 'Tốt' },
            { value: 'neutral', icon: 'meh', text: 'Bình thường' },
            { value: 'bad', icon: 'frown', text: 'Chưa tốt' }
        ];

        return ratings.map(rating => `
            <button class="rating-btn ${rating.value}-btn ${task.rating === rating.value ? 'active' : ''}"
                    onclick="rateTask('${task.id}', '${rating.value}')">
                <i class="fas fa-${rating.icon}"></i>
                ${rating.text}
            </button>
        `).join('');
    }
}