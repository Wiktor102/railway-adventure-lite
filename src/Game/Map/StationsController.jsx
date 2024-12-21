import React, { useMemo, useState } from "react";
import { renderToString } from "react-dom/server";
import PropTypes from "prop-types";
import { observer } from "mobx-react-lite";
import { DivIcon } from "leaflet";
import { Circle, Marker, Pane, Popup, useMap, useMapEvent } from "react-leaflet";

// hooks and utilities
import useMapZoom from "../../hooks/useMapZoom";
import { useGameStore } from "../../store/GameStoreProvider";

// classes
import Station from "../../store/models/Station";

// assets
import pin from "../../assets/icons/pin.svg";

const StationsController = observer(() => {
	const { stationStore } = useGameStore();
	const { snappedStation, setSnappedStation } = stationStore;

	function onMouseOver({ latlng }, station) {
		const distance = latlng.distanceTo(station.coordinates);
		if (!snappedStation.station || distance < snappedStation.distance) {
			setSnappedStation({ station: station, distance });
		}
	}

	function onMouseOut(station) {
		if (snappedStation.station === station) {
			setSnappedStation({ station: null, distance: null });
		}
	}

	return (
		<>
			<Pane name="station-markers-pane" style={{ zIndex: 400 }}>
				{stationStore.stations.map(station => (
					<StationMarker station={station} key={station.name} />
				))}
			</Pane>
			<Pane name="station-colliders-pane">
				{stationStore.stations.map(station => (
					<StationCollider
						station={station}
						key={station.name}
						onMouseOver={onMouseOver}
						onMouseOut={onMouseOut}
					/>
				))}
			</Pane>
		</>
	);
});

StationsController.propTypes = {};

function StationMarker({ station }) {
	const map = useMap();
	const [zoom, setZoom] = useState(map.getZoom());

	const icon = useMemo(() => {
		const z = Math.pow(zoom, 2) / (zoom / -2 + 10);
		const jsx = (
			<div className="station-pin" style={{ left: -0.5 * z + "px", top: -0.5 * z + "px" }}>
				<img src={pin} alt="Oznaczenie stacji kolejkowej" style={{ width: z + "px" }} />
				{zoom > 11 && <span style={{ fontSize: `clamp(1rem, ${z * 0.6}px, 1.3rem)` }}>{station.name}</span>}
			</div>
		);

		return new DivIcon({
			className: `station-pin-container`,
			html: renderToString(jsx)
		});
	}, [zoom]);

	useMapEvent("zoom", () => {
		setZoom(map.getZoom());
	});

	return (
		<Marker position={station.coordinates} icon={icon}>
			<Popup>{station.name}</Popup>
		</Marker>
	);
}

StationMarker.propTypes = {
	station: PropTypes.instanceOf(Station).isRequired
};

function StationCollider({ station, onMouseOver, onMouseOut }) {
	const zoom = useMapZoom();
	const radius = useMemo(() => -75 * zoom + 2000, [zoom]);

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

StationCollider.propTypes = {
	station: PropTypes.instanceOf(Station).isRequired,
	onMouseOver: PropTypes.func,
	onMouseOut: PropTypes.func
};

export default StationsController;
