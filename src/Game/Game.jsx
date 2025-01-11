// hooks
import { useIsStoreLoading } from "../store/GameStoreProvider";

// components
import Ui from "../Ui/Ui";
import Map from "./Map/Map";
import LoadingScreen from "./LoadingScreen/LoadingScreen";

import style from "./Game.component.scss";

function Game() {
	const loading = useIsStoreLoading();
	if (loading) return <LoadingScreen />;

	return (
		<div className="game" data-style={style}>
			<Ui />
			<Map />
		</div>
	);
}

export default Game;
