export class DataService {
    static STORAGE_KEY = 'kidScheduleData';

    static load() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : {
                tridung: { tasks: [], level: 1, experience: 0 },
                thaoVy: { tasks: [], level: 1, experience: 0 }
            };
        } catch (error) {
            console.error('Error loading data:', error);
            return {
                tridung: { tasks: [], level: 1, experience: 0 },
                thaoVy: { tasks: [], level: 1, experience: 0 }
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
        return data[childName] || { tasks: [], level: 1, experience: 0 };
    }

    static saveChildProgress(childName, progress) {
        const data = this.load();
        data[childName] = progress;
        this.save(data);
    }

    static resetProgress(childName) {
        const data = this.load();
        data[childName] = { tasks: [], level: 1, experience: 0 };
        this.save(data);
    }

    static clearAllData() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}