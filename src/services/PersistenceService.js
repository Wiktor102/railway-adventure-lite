import pako from "pako";

const LOCAL_STORAGE_KEY = "railway-adventure-save";

class PersistenceService {
	static saveToLocalStorage(gameStore) {
		const saveData = gameStore.toJSON();
		const jsonString = JSON.stringify(saveData);
		const compressed = pako.deflate(jsonString);
		const base64 = btoa(String.fromCharCode.apply(null, compressed));
		localStorage.setItem(LOCAL_STORAGE_KEY, base64);
	}

	static loadFromLocalStorage() {
		const saveData = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (!saveData) return null;

		try {
			// First try parsing as regular JSON (backwards compatibility)
			return JSON.parse(saveData);
		} catch {
			try {
				// If that fails, try decompressing
				const binary = atob(saveData);
				const bytes = new Uint8Array(binary.length);
				for (let i = 0; i < binary.length; i++) {
					bytes[i] = binary.charCodeAt(i);
				}
				const decompressed = pako.inflate(bytes, { to: "string" });
				return JSON.parse(decompressed);
			} catch (error) {
				return null;
			}
		}
	}

	static downloadSaveFile(gameStore) {
		const saveData = gameStore.toJSON();
		const jsonString = JSON.stringify(saveData);
		const compressed = pako.deflate(jsonString);
		const blob = new Blob([compressed], { type: "application/x-compressed" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		const dateString = new Date()
			.toISOString()
			.replace(/[^0-9]/g, "")
			.slice(2, 14);

		a.href = url;
		a.download = `ral-save-${dateString}.ralsave`;
		a.click();
		URL.revokeObjectURL(url);
	}

	static async loadFromFile() {
		return new Promise((resolve, reject) => {
			// Create file input element
			const fileInput = document.createElement("input");
			fileInput.type = "file";
			fileInput.accept = ".json,.ralsave";

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
				const isCompressed = file.name.endsWith(".ralsave");

				// Handle successful file read
				reader.onload = e => {
					try {
						// Try to parse the file contents as JSON
						const jsonData = JSON.parse(e.target.result);
						resolve(jsonData);
					} catch (error) {
						try {
							// Try to decompress the file contents
							const decompressed = pako.inflate(e.target.result, { to: "string" });
							const jsonData = JSON.parse(decompressed);
							resolve(jsonData);
						} catch (error) {
							reject(new Error("Invalid save file: " + error.message));
						}
					}
				};

				reader.onerror = () => {
					reject(new Error("Error reading file"));
				};

				if (isCompressed) {
					reader.readAsArrayBuffer(file);
				} else {
					reader.readAsText(file);
				}
			};

			fileInput.oncancel = () => {
				reject(new Error("File selection cancelled"));
			};

			fileInput.click();
		});
	}
}

export default PersistenceService;
