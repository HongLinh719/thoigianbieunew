export const DataService = {
    storageKey: 'kidScheduleData',

    save(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    },

    load() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : {
            tridung: { tasks: [], level: 1, experience: 0 },
            thaoVy: { tasks: [], level: 1, experience: 0 }
        };
    },

    saveChildProgress(childName, progress) {
        const data = this.load();
        data[childName] = { ...data[childName], ...progress };
        this.save(data);
    },

    getChildProgress(childName) {
        const data = this.load();
        return data[childName] || { tasks: [], level: 1, experience: 0 };
    }
};