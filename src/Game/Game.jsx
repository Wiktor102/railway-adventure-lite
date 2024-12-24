import { GameStoreProvider } from "../store/GameStoreProvider";

import Map from "./Map/Map";
import Ui from "./Ui/Ui";

import style from "./Game.component.scss";

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
