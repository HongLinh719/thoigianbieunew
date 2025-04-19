import { CONFIG } from './config.js';
import { DataService } from './data.js';

export class UI {
    static updateTaskDisplay(childName) {
        const taskList = document.querySelector(`#${childName} .task-list`);
        const tasks = CONFIG.TASKS[childName];
        const savedData = DataService.getChildProgress(childName);
        
        if (taskList && tasks) {
            taskList.innerHTML = tasks.map(task => {
                const savedTask = savedData.tasks.find(t => t.id === task.id);
                return `
                    <task-item 
                        task-id="${task.id}" 
                        time="${task.time}" 
                        name="${task.name}"
                        audio-path="${task.audioPath}"
                        rating="${savedTask?.rating || ''}"
                    ></task-item>
                `;
            }).join('');
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
        const data = DataService.getChildProgress(childName);
        const taskData = data.tasks.find(t => t.id === taskId) || { id: taskId };
        const oldRating = taskData.rating;
        taskData.rating = rating;

        // Update tasks array
        const taskIndex = data.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) {
            data.tasks.push(taskData);
        } else {
            data.tasks[taskIndex] = taskData;
        }

        // Play appropriate sound effect
        if (rating === 'good') {
            await this.playAudioEffect('good');
            this.showNotification('Tuyệt vời! Bé đã hoàn thành tốt nhiệm vụ! 🌟', 'success');
        } else if (rating === 'bad') {
            await this.playAudioEffect('bad');
            this.showNotification('Cố gắng hơn vào lần sau nhé! 💪', 'warning');
        }

        // Save progress
        DataService.saveChildProgress(childName, data);
        this.updateTaskDisplay(childName);
    }
}