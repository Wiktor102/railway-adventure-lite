import { useState } from "react";
import { useMap, useMapEvent } from "react-leaflet";

function useMapZoom() {
	const map = useMap();
	const [zoom, setZoom] = useState(map.getZoom());
	useMapEvent("zoom", () => {
		setZoom(map.getZoom());
	});

	return zoom;
}

export default useMapZoom;
