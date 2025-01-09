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
		a.href = url;
		a.download = "railway-adventure-save.json";
		a.click();
		URL.revokeObjectURL(url);
	}

	static async loadFromFile(file) {
		const text = await file.text();
		return JSON.parse(text);
	}
}

export default PersistenceService;
