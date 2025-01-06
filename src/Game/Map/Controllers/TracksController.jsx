import { observer } from "mobx-react-lite";
import { useMatch, useParams } from "react-router";
import { latLng } from "leaflet";

// hooks
import { useGameStore } from "../../../store/GameStoreProvider";

// components
import TrackDrawController from "./TrackDrawController";
import { TrackDeleteAction, TrackWithActions } from "../Tracks";

const TracksController = observer(() => {
	const { trackStore, routeStore } = useGameStore();

	const renderWithActions = useMatch("/game/tracks");
	const renderDrawController = useMatch("/game/tracks/build/*");
	const { "*": splat } = useParams();
	const trackWidth = +splat;

	const renderWithRoutes = useMatch("/game/routes/*");
	const renderWithDraftRoute = useMatch("/game/routes/create");

	function getTrackColors(track) {
		if (!renderWithRoutes && !routeStore.highlightedRoute) {
			return "#2572dd";
		}

		return track.lanes.map(l => {
			if (!renderWithRoutes && l?.id !== routeStore.highlightedRoute.id) return "#2572dd";
			if (!renderWithRoutes && l?.id === routeStore.highlightedRoute.id) return routeStore.highlightedRoute.color;

			if (l == null) return "#2572dd";
			if (l.draft && !renderWithDraftRoute) return "#2572dd";
			return renderWithDraftRoute && !l.draft ? l.color + "a4" : l.color;
		});
	}

	function setTrackOptions(info) {
		const track = this;
		if (track.width === 2) track.setLatlngs([info.leftTrackPoints, info.rightTrackPoints]);
		else if (track.width === 3) {
			const centerTrackPoints = [track.startStation.coordinates, track.endStation.coordinates].map(c => latLng(c));
			track.setLatlngs([info.leftTrackPoints, centerTrackPoints, info.rightTrackPoints]);
		}
	}

	return (
		<>
			{renderDrawController && <TrackDrawController />}
			{trackStore.tracks.map((track, i) => {
				const C = track.getComponent();
				const colors = getTrackColors(track);

				const props = {
					start: latLng(track.startStation.coordinates),
					end: latLng(track.endStation.coordinates),
					color: colors,
					enableHover: renderDrawController && track.width !== trackWidth,
					onClick: () => {
						if (!renderDrawController || track.width === trackWidth) return;
						track.updateWidth(trackWidth);
					},
					setOptions: track.width > 1 ? setTrackOptions.bind(track) : undefined
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
