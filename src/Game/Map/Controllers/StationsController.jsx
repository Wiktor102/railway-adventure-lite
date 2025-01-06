import { useMemo } from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react-lite";
import { useMatch, useParams } from "react-router";
import { Circle, Pane, useMap, useMapEvent } from "react-leaflet";
import { Marker } from "@adamscybot/react-leaflet-component-marker";
import { latLng } from "leaflet";

// hooks and utilities
import useMapZoom from "../../../hooks/useMapZoom";
import { useGameStore } from "../../../store/GameStoreProvider";

// components
import StationPopup from "../components/StationPopup/StationPopup";

// classes
import Station from "../../../store/models/Station";

const StationsController = observer(() => {
	const { stationStore } = useGameStore();
	const { snappedStation, setSnappedStation, setShowedPopup } = stationStore;

	function onMouseOver({ latlng }, station) {
		const distance = latlng.distanceTo(latLng(station.coordinates));
		if (!snappedStation.station || distance < snappedStation.distance) {
			setSnappedStation({ station: station, distance });
		}
	}

	function onMouseOut(station) {
		if (snappedStation.station === station) {
			setSnappedStation({ station: null, distance: null });
		}
	}

	useMapEvent("click", () => {
		setShowedPopup(null);
	});

	return (
		<>
			<Pane name="station-markers">
				{stationStore.stations.map(station => (
					<StationMarker station={station} key={station.name} />
				))}
			</Pane>
			{stationStore.enableSnapping && (
				<Pane name="station-snap-areas">
					{stationStore.stations.map(station => (
						<StationSnapArea
							station={station}
							key={station.name}
							onMouseOver={onMouseOver}
							onMouseOut={onMouseOut}
						/>
					))}
				</Pane>
			)}
		</>
	);
});

StationsController.propTypes = {};

const StationMarker = observer(({ station }) => {
	const map = useMap();
	const zoom = useMapZoom();

	const { stationStore, showError } = useGameStore();
	const { snappedStation, showedPopup, setShowedPopup } = stationStore;
	const hover = snappedStation?.station?.name === station.name;

	const drawingRoute = useMatch("/game/routes/create");
	const buildingTrack = useMatch("/game/tracks/build/*");

	const { routeId } = useParams();
	const { routeStore } = useGameStore();

	function onClick(e) {
		setShowedPopup(showedPopup === station.name ? null : station.name);

		if (buildingTrack && !stationStore.enableSnapping) {
			stationStore.setSnappedStation({ station: station, distance: 0 });
			setTimeout(() => map.fire("click", e), 0); // This event is used by TrackDrawController
			return;
		}

		let error;
		if (drawingRoute) error = routeStore.addToCurrentRoute(station);
		if (routeId != null) console.log("editing route", routeId);
		error && showError(error);
	}

	let z = 22 * Math.pow((zoom - 5) / 10, 0.5);
	let showName = zoom >= 12;
	let sizeName = "smallest";

	switch (station.size) {
		case 1:
			if (zoom <= 11) return null;
			z = zoom * (zoom / 10);
			showName = zoom >= 13;
			break;
		case 2:
			sizeName = "small";
			if (zoom <= 10) return null;
			showName = zoom >= 12;
			break;
		case 3:
			sizeName = "medium";
			if (zoom <= 8) return null;
			z = zoom * (zoom / 5.2);
			showName = zoom >= 10;
			break;
		case 4:
			sizeName = "big";
			z = zoom * (zoom / 4.5);
			showName = true;
			break;
		case 5:
			sizeName = "biggest";
			z = zoom * (zoom / 3);
			showName = true;
			break;
	}

	return (
		<>
			<Marker
				position={station.coordinates}
				zIndexOffset={station.size >= 4 ? 500 * station.size : 0}
				icon={
					<div className={`station-pin ${hover && "hover"} ${sizeName} ${station.size === 4 && "big"}`}>
						<div className={`pin`} style={{ width: z + "px", outlineOffset: z / 5 + "px" }}></div>
						{showName && (
							<span
								style={{
									left: z + 2 + z / 3 + "px",
									top: z / -5 + "px",
									fontSize: `clamp(1rem, ${z * 0.2 * station.size}px, 1.3rem)`
								}}
							>
								{station.name}
							</span>
						)}
					</div>
				}
				eventHandlers={{
					click: onClick
				}}
			></Marker>
			{!drawingRoute && !buildingTrack && showedPopup === station.name && (
				<Marker
					position={station.coordinates}
					icon={<StationPopup station={station} />}
					pane="popup"
					bubblingMouseEvents={false}
				></Marker>
			)}
		</>
	);
});

StationMarker.propTypes = {
	station: PropTypes.instanceOf(Station).isRequired
};

function StationSnapArea({ station, onMouseOver, onMouseOut }) {
	const zoom = useMapZoom();
	const radius = useMemo(() => -75 * (zoom / 2) * station.size + 1000 * station.size, [zoom, station.size]);

	if (zoom <= 8 && station.size === 3) return null;
	if (zoom <= 10 && station.size === 2) return null;
	if (zoom <= 11 && station.size === 1) return null;

	return (
		<Circle
			center={station.coordinates}
			radius={radius}
			pathOptions={{ fillOpacity: 0, opacity: 0 }}
			eventHandlers={{
				mouseover: e => onMouseOver(e, station),
				mouseout: () => onMouseOut(station)
			}}
		/>
	);
}

StationSnapArea.propTypes = {
	station: PropTypes.instanceOf(Station).isRequired,
	onMouseOver: PropTypes.func,
	onMouseOut: PropTypes.func
};

export default StationsController;
