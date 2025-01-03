import { observer } from "mobx-react-lite";
import { useMatch, useParams } from "react-router";
import { latLng } from "leaflet";

// hooks
import { useGameStore } from "../../store/GameStoreProvider";

// components
import TrackDrawController from "./TrackDrawController";
import { TrackDeleteAction, TrackWithActions } from "./Tracks";

const TracksController = observer(() => {
	const { trackStore } = useGameStore();

	const renderWithActions = useMatch("/game/tracks");
	const renderDrawController = useMatch("/game/tracks/build/*");
	const { "*": splat } = useParams();
	const trackWidth = +splat;

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
					color: colors,
					enableHover: renderDrawController && track.width !== trackWidth,
					onClick: () => {
						if (!renderDrawController || track.width === trackWidth) return;
						track.width = trackWidth;
					}
				};

				if (renderWithActions) {
					return (
						<TrackWithActions
							actions={
								<TrackDeleteAction
									onClick={() => trackStore.deleteTrack(track.id)}
									disabled={track.hasRoute}
								/>
							}
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
