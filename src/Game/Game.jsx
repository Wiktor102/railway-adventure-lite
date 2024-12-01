import Map from "./Map";

import style from "./Game.component.scss";

function Game() {
	return (
		<div className="game" data-style={style}>
			<Map />
		</div>
	);
}

export default Game;
