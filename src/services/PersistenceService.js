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

	static async loadFromFile() {
		return new Promise((resolve, reject) => {
			// Create file input element
			const fileInput = document.createElement("input");
			fileInput.type = "file";
			fileInput.accept = "application/json";

			// Handle file selection
			fileInput.onchange = event => {
				const file = event.target.files[0];

				// Check if a file was selected
				if (!file) {
					reject(new Error("No file selected"));
					return;
				}

				// Create FileReader instance
				const reader = new FileReader();

				// Handle successful file read
				reader.onload = e => {
					try {
						// Try to parse the file contents as JSON
						const jsonData = JSON.parse(e.target.result);
						resolve(jsonData);
					} catch (error) {
						reject(new Error("Invalid JSON file: " + error.message));
					}
				};

				// Handle file read errors
				reader.onerror = () => {
					reject(new Error("Error reading file"));
				};

				// Read the file as text
				reader.readAsText(file);
			};

			// Handle cancel button click
			fileInput.oncancel = () => {
				reject(new Error("File selection cancelled"));
			};

			// Trigger the file selection dialog
			fileInput.click();
		});
	}
}

export default PersistenceService;
