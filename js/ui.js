import { CONFIG } from './config.js';
import { DataService } from './data.js';

export class UI {
    static updateTaskDisplay(childName) {
        const taskList = document.querySelector(`#${childName} .task-list`);
        const tasks = CONFIG.TASKS[childName];
        
        if (taskList && tasks) {
            taskList.innerHTML = tasks.map(task => `
                <task-item 
                    task-id="${task.id}" 
                    time="${task.time}" 
                    name="${task.name}"
                    audio-path="${task.audioPath}"
                ></task-item>
            `).join('');
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
                <i class="fas fa-bell"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    static playAudio(path) {
        const audio = new Audio(path);
        return audio.play();
    }
}