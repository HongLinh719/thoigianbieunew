export class DataService {
    static STORAGE_KEY = 'kidScheduleData';

    static load() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : {
                tridung: { tasks: [], points: 0, lastUpdate: new Date().toISOString() },
                thaoVy: { tasks: [], points: 0, lastUpdate: new Date().toISOString() }
            };
        } catch (error) {
            console.error('Error loading data:', error);
            return {
                tridung: { tasks: [], points: 0, lastUpdate: new Date().toISOString() },
                thaoVy: { tasks: [], points: 0, lastUpdate: new Date().toISOString() }
            };
        }
    }

    static save(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    static getChildProgress(childName) {
        const data = this.load();
        // Kiểm tra và reset dữ liệu nếu sang ngày mới
        if (this.shouldResetData(data[childName]?.lastUpdate)) {
            data[childName] = {
                tasks: [],
                points: data[childName]?.points || 0,
                lastUpdate: new Date().toISOString()
            };
            this.save(data);
        }
        return data[childName] || { tasks: [], points: 0, lastUpdate: new Date().toISOString() };
    }

    static saveChildProgress(childName, progress) {
        const data = this.load();
        data[childName] = {
            ...progress,
            lastUpdate: new Date().toISOString()
        };
        this.save(data);
    }

    static shouldResetData(lastUpdate) {
        if (!lastUpdate) return true;

        const last = new Date(lastUpdate);
        const now = new Date();

        // Reset nếu khác ngày
        return last.getDate() !== now.getDate() ||
               last.getMonth() !== now.getMonth() ||
               last.getFullYear() !== now.getFullYear();
    }

    static resetDailyTasks(childName) {
        const data = this.load();
        const childData = data[childName];
        if (childData) {
            childData.tasks = [];
            childData.lastUpdate = new Date().toISOString();
            this.save(data);
        }
    }

    static getTreeProgress(childName) {
        const data = this.getChildProgress(childName);
        return {
            points: data.points || 0,
            level: Math.floor((data.points || 0) / 50) + 1,
            nextLevelPoints: (Math.floor((data.points || 0) / 50) + 1) * 50
        };
    }

    static addPoints(childName, points) {
        const data = this.load();
        if (data[childName]) {
            data[childName].points = (data[childName].points || 0) + points;
            this.save(data);
            return data[childName].points;
        }
        return 0;
    }

    static resetProgress(childName) {
        const data = this.load();
        data[childName] = {
            tasks: [],
            points: 0,
            lastUpdate: new Date().toISOString()
        };
        this.save(data);
    }

    static clearAllData() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}