import { observer } from "mobx-react-lite";
import { useGameStore } from "../../store/GameStoreProvider";
import { latLng } from "leaflet";

// components
import GameStore from "../../store/GameStore";
import TrackDrawController from "./TrackDrawController";

const TracksController = observer(() => {
	const { trackStore, mode, ...gameStore } = useGameStore();
	return (
		<>
			{mode === GameStore.GAME_MODES[GameStore.GAME_VIEWS.TRACKS].DRAW && <TrackDrawController />}
			{trackStore.tracks.map((track, i) => {
				const C = track.getComponent();
				return (
					<C key={i} start={latLng(track.startStation.coordinates)} end={latLng(track.endStation.coordinates)} />
				);
			})}
		</>
	);
});

export default TracksController;
