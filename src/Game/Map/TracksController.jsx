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

	const renderWithRoutes = useMatch("/game/routes/*");
	const renderWithDraftRoute = useMatch("/game/routes/create");

	return (
		<>
			{renderDrawController && <TrackDrawController />}
			{trackStore.tracks.map((track, i) => {
				const C = track.getComponent();
				const colors = renderWithRoutes
					? track.lanes.map(l => {
							if (l == null) return "#2572dd";
							if (l.draft && !renderWithDraftRoute) return "#2572dd";
							return renderWithDraftRoute && !l.draft ? l.color + "a4" : l.color;
							// eslint-disable-next-line no-mixed-spaces-and-tabs
					  })
					: "#2572dd";

				const props = {
					start: latLng(track.startStation.coordinates),
					end: latLng(track.endStation.coordinates),
					color: colors
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
