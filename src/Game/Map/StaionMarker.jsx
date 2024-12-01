import React, { useMemo, useState } from "react";
import { renderToString } from "react-dom/server";

import { DivIcon } from "leaflet";
import { Marker, Popup, useMap, useMapEvent } from "react-leaflet";

import pin from "../../assets/icons/pin.svg";
import PropTypes from "prop-types";
import Station from "../../store/models/Station";

function StationMarker({ station }) {
	const map = useMap();
	const [zoom, setZoom] = useState(map.getZoom());

	const icon = useMemo(() => {
		const z = Math.pow(zoom, 2) / 5;
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

export default StationMarker;
