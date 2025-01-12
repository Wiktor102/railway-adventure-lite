import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";

// hooks
import { useGameStore } from "../../../store/GameStoreProvider";

// services
import PersistenceService from "../../../services/PersistenceService";

import styles from "./QuitDialog.component.scss";

const Dialog = ({ heading, dialogRef, children }) => {
	return (
		<dialog ref={dialogRef} className="quit-dialog" data-style={styles}>
			<h2>{heading}</h2>
			{children}
		</dialog>
	);
};

Dialog.propTypes = {
	heading: PropTypes.string,
	dialogRef: PropTypes.object,
	children: PropTypes.node
};

const QuitDialog = ({ dialogRef, onClose }) => {
	const navigate = useNavigate();
	const gameStore = useGameStore();
	const [confirmation, setConfirmation] = useState(false);

	const handleSaveAndQuit = () => {
		const hasSave = PersistenceService.loadFromLocalStorage() != null;
		if (hasSave) {
			setConfirmation(true);
			return;
		}

		gameStore.saveToLocalStorage();
		navigate("/");
	};

	const handleSaveToFile = () => {
		gameStore.downloadSave();
	};

	const handleQuitWithoutSave = () => {
		navigate("/");
	};

	return (
		<Dialog heading={confirmation ? "Czy nadpisać?" : "Chcesz wyjść?"} dialogRef={dialogRef}>
			{!confirmation && (
				<div className="quit-dialog-buttons">
					<button className="save-quit-btn green" onClick={handleSaveAndQuit}>
						Zapisz i wyjdź
					</button>
					<button className="green" onClick={handleSaveToFile}>
						<i className="fas fa-download"></i>
					</button>
					<button className="red" onClick={handleQuitWithoutSave}>
						Wyjdź bez zapisywania
					</button>
					<button className="orange" onClick={onClose}>
						Anuluj
					</button>
				</div>
			)}
			{confirmation && (
				<div className="confirm-dialog-buttons">
					<button
						className="green"
						onClick={() => {
							handleSaveToFile();
							navigate("/");
						}}
					>
						Pobierz i wyjdź
					</button>
					<button
						className="red"
						onClick={() => {
							gameStore.saveToLocalStorage();
							navigate("/");
						}}
					>
						Nadpisz i wyjdź
					</button>
					<button
						className="orange"
						onClick={() => {
							setTimeout(() => setConfirmation(false), 1000);
							onClose();
						}}
					>
						Anuluj
					</button>
				</div>
			)}
		</Dialog>
	);
};

QuitDialog.propTypes = {
	dialogRef: PropTypes.object,
	onClose: PropTypes.func
};

export default QuitDialog;
