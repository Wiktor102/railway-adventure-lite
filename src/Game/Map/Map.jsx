import { MapContainer, GeoJSON, useMap, LayerGroup } from "react-leaflet";
import { useGameStore } from "../../store/GameStoreProvider";
import mapGeoJson from "../../assets/data/slaskie.json";
import { observer } from "mobx-react-lite";
import StationMarker from "./StaionMarker";

const Map = observer(() => {
	const { stationStore } = useGameStore();

	return (
		<MapContainer center={[51.7, 19]} zoom={9} className="map">
			<MapController />
			<LayerGroup>
				{stationStore.stations.map(station => (
					<StationMarker station={station} key={station.name} />
				))}
			</LayerGroup>
		</MapContainer>
	);
});

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
