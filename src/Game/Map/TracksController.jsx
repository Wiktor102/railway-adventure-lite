import { observer } from "mobx-react-lite";
import { useMatch } from "react-router";
import { latLng } from "leaflet";

// hooks
import { useGameStore } from "../../store/GameStoreProvider";

// components
import TrackDrawController from "./TrackDrawController";
import { TrackDeleteAction, TrackWithActions } from "./Tracks";

const TracksController = observer(() => {
	const { trackStore } = useGameStore();
	const renderDrawController = useMatch("/game/tracks/build/*");
	const renderWithActions = useMatch("/game/tracks");

	return (
		<>
			{renderDrawController && <TrackDrawController />}
			{trackStore.tracks.map((track, i) => {
				const C = track.getComponent();
				const props = {
					start: latLng(track.startStation.coordinates),
					end: latLng(track.endStation.coordinates),
					color: "blue"
				};

				if (renderWithActions) {
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
