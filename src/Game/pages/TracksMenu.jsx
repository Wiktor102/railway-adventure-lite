import { useEffect } from "react";
import { observer } from "mobx-react-lite";

import { useGameStore } from "../../store/GameStoreProvider";

import GameStore from "../../store/GameStore";

import trackIcon from "../../assets/icons/track.svg";
import style from "./TracksMenu.component.scss";
import { runInAction } from "mobx";

const TracksMenu = observer(() => {
	const gameStore = useGameStore();
	const selectedTrackWidth = gameStore.pageState.selectedTrackWidth;

	function handleClick(width) {
		runInAction(() => {
			gameStore.pageState.selectedTrackWidth = width;
		});
	}

	useEffect(() => {
		gameStore.setView(GameStore.GAME_VIEWS.TRACKS);
		return () => {
			gameStore.setView(GameStore.GAME_VIEWS.DEFAULT);
		};
	}, []);

	useEffect(() => {
		if (!gameStore.pageState.selectedTrackWidth) {
			gameStore.setMode(GameStore.GAME_MODES[GameStore.GAME_VIEWS.TRACKS].DEFAULT);
			return;
		}

		gameStore.setMode(GameStore.GAME_MODES[GameStore.GAME_VIEWS.TRACKS].DRAW);
	}, [gameStore.pageState.selectedTrackWidth]);

	return (
		<div className="tracks-menu" data-style={style}>
			<h2>Buduj tory</h2>
			<ul>
				<li className={selectedTrackWidth === 1 ? "selected" : ""} onClick={() => handleClick(1)} role="button">
					<img src={trackIcon} alt="Ikona pojedyńczego toru" />
					<div className="label">Pojedyńczy tor</div>
				</li>
				<li className={selectedTrackWidth === 2 ? "selected" : ""} onClick={() => handleClick(2)} role="button">
					<img src={trackIcon} alt="Ikona podwójnego toru" />
					<div className="label">Podwójny tor</div>
				</li>
				<li className={selectedTrackWidth === 3 ? "selected" : ""} onClick={() => handleClick(3)} role="button">
					<img src={trackIcon} alt="Ikona potrójnego toru" />
					<div className="label">Potrójny tor</div>
				</li>
			</ul>
		</div>
	);
});

export default TracksMenu;
