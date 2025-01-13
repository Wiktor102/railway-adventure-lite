import { MapContainer, GeoJSON, useMap, Pane } from "react-leaflet";
import mapGeoJson from "../../assets/data/slaskie.json";
import StationsController from "./Controllers/StationsController";
import TracksController from "./Controllers/TracksController";
import TrainController from "./Controllers/TrainController";

const Map = () => {
	return (
		<MapContainer center={[51.7, 19]} minZoom={8} zoom={9} maxZoom={14} className="map" zoomControl={false}>
			<MapController />
			<StationsController />
			<TracksController />
			<TrainController />
			<Pane name="popup" style={{ zIndex: 700 }} />
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

export default Map;
