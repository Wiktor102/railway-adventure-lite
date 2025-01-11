import { useNavigate } from "react-router";
import { useGameStore } from "../../../store/GameStoreProvider";
import PropTypes from "prop-types";

import styles from "./QuitDialog.component.scss";

const QuitDialog = ({ dialogRef, onClose }) => {
	const navigate = useNavigate();
	const gameStore = useGameStore();

	const handleSaveAndQuit = () => {
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
		<dialog ref={dialogRef} className="quit-dialog" data-style={styles}>
			<h2>Wyjść z gry?</h2>
			<div className="dialog-buttons">
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
		</dialog>
	);
};

QuitDialog.propTypes = {
	dialogRef: PropTypes.object,
	onClose: PropTypes.func
};

export default QuitDialog;
