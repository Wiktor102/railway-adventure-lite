import { useState } from "react";
import { MapContainer, GeoJSON, useMap, useMapEvent } from "react-leaflet";
import mapGeoJson from "../../assets/data/slaskie.json";
import { DoubleTrack } from "./Tracks";
import StationsController from "./StationsController";

const Map = () => {
	return (
		<MapContainer center={[51.7, 19]} zoom={9} className="map">
			<MapController />
			<StationsController />
			<TrackController />
		</MapContainer>
	);
};

const MapController = () => {
	const map = useMap();

	function onBaseLayerAdded(e) {
		const layerBounds = Object.values(e.target._layers)[0].getBounds();
		map.fitBounds(layerBounds);
	}

	return (
		<>
			<GeoJSON
				data={mapGeoJson}
				eventHandlers={{ add: onBaseLayerAdded }}
				style={{
					stroke: false,
					color: "#35A453",
					fill: true,
					fillColor: "#35A453",
					fillOpacity: 1,
					interactive: false
				}}
			/>
		</>
	);
};

const TrackController = () => {
	const [startPoint, setStartPoint] = useState(null);
	const [endPoint, setEndPoint] = useState(null);

	useMapEvent("click", e => {
		if (startPoint === null) {
			setStartPoint(e.latlng);
		} else if (endPoint === null) {
			setEndPoint(e.latlng);
		} else {
			setStartPoint(e.latlng);
			setEndPoint(null);
		}
	});

	if (!startPoint || !endPoint) return null;
	return (
		<>
			<DoubleTrack start={startPoint} end={endPoint} />
		</>
	);
};

export default Map;
