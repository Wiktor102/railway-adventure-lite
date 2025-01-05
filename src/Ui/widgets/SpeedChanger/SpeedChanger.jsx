import { observer } from "mobx-react-lite";

// hooks
import { useGameStore } from "../../../store/GameStoreProvider";

import style from "./SpeedChanger.component.scss";

const SpeedChanger = observer(() => {
	const { gameSpeed, setGameSpeed } = useGameStore();

	function changeGameSpeed() {
		setGameSpeed(gameSpeed === 3 ? 1 : gameSpeed + 1);
	}

	return (
		<div data-style={style} className="speed-changer">
			<i className="fas fa-gauge-simple"></i>
			<button onClick={changeGameSpeed}>
				<i className="fas fa-play active"></i>
				<i className={`fas fa-play ${gameSpeed >= 2 ? "active" : ""}`}></i>
				<i className={`fas fa-play ${gameSpeed >= 3 ? "active" : ""}`}></i>
			</button>
		</div>
	);
});

export default SpeedChanger;
