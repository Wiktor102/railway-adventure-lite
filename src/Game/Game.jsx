import { GameStoreProvider } from "../store/GameStoreProvider";

import Map from "./Map/Map";

import style from "./Game.component.scss";
import Ui from "../Ui/Ui";

function Game() {
	return (
		<GameStoreProvider>
			<div className="game" data-style={style}>
				<Ui />
				<Map />
			</div>
		</GameStoreProvider>
	);
}

export default Game;
