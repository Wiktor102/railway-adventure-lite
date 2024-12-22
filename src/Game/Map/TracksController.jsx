import { observer } from "mobx-react-lite";
import { useGameStore } from "../../store/GameStoreProvider";
import { latLng } from "leaflet";

// components
import GameStore from "../../store/GameStore";
import TrackDrawController from "./TrackDrawController";
import { TrackDeleteAction, TrackWithActions } from "./Tracks";

const TracksController = observer(() => {
	const { trackStore, mode, ...gameStore } = useGameStore();

	return (
		<>
			{mode === GameStore.GAME_MODES[GameStore.GAME_VIEWS.TRACKS].DRAW && <TrackDrawController />}
			{trackStore.tracks.map((track, i) => {
				const C = track.getComponent();
				const props = {
					start: latLng(track.startStation.coordinates),
					end: latLng(track.endStation.coordinates),
					color: "blue"
				};

				if (mode === GameStore.GAME_MODES[GameStore.GAME_VIEWS.TRACKS].DEFAULT) {
					return (
						<TrackWithActions
							actions={<TrackDeleteAction onClick={() => trackStore.deleteTrack(track.id)} />}
							key={i}
						>
							<C {...props} />
						</TrackWithActions>
					);
				}

				return <C key={i} {...props} />;
			})}
		</>
	);
});

export default TracksController;
