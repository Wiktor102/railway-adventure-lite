import React from "react";
import { GameStoreProvider } from "../store/GameStoreProvider";
import Map from "./Map/Map";

import style from "./Game.component.scss";

function Game() {
	return (
		<GameStoreProvider>
			<div className="game" data-style={style}>
				<Map />
			</div>
		</GameStoreProvider>
	);
}

export default Game;
