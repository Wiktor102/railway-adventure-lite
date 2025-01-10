const LOCAL_STORAGE_KEY = "railway-adventure-save";

class PersistenceService {
	static saveToLocalStorage(gameStore) {
		const saveData = gameStore.toJSON();
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(saveData));
	}

	static loadFromLocalStorage() {
		const saveData = localStorage.getItem(LOCAL_STORAGE_KEY);
		return saveData ? JSON.parse(saveData) : null;
	}

	static downloadSaveFile(gameStore) {
		const saveData = gameStore.toJSON();
		const blob = new Blob([JSON.stringify(saveData)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		const dateString = new Date()
			.toISOString()
			.replace(/[^0-9]/g, "")
			.slice(2, 14);

		a.href = url;
		a.download = `ral-save-${dateString}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	static async loadFromFile(file) {
		const text = await file.text();
		return JSON.parse(text);
	}
}

export default PersistenceService;
