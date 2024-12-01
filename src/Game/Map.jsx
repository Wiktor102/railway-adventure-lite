import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import mapGeoJson from "../assets/data/slaskie.json";

function Map() {
	return (
		<MapContainer center={[51.7, 19]} zoom={9} className="map">
			<MapController />
		</MapContainer>
	);
}

function MapController() {
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
}

export default Map;
