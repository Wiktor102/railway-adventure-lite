import { useMemo } from "react";
import { Polygon } from "react-leaflet";

// hooks and utilities
import useMapZoom from "../../hooks/useMapZoom";
import { calcDistance, calculateKiteVertices } from "../../utils";

function useTrackStyle() {
	const zoom = useMapZoom();

	return {
		fill: false,
		color: "#da8220",
		weight: Math.round(zoom / 3) * (zoom > 12 ? Math.pow(1.2, zoom - 12) : 1)
	};
}

function DoubleTrack({ start, end }) {
	const zoom = useMapZoom();
	const style = useTrackStyle();

	const trackPoints = useMemo(() => {
		const distance = calcDistance(start, end);
		const tipLength = distance * 0.05;

		const offsetX = distance - tipLength * 2;
		const offsetY = -40 * zoom + (240 - 12 * -40);
		const { topLeft, topRight, bottomLeft, bottomRight } = calculateKiteVertices(start, end, offsetX, offsetY);
		return [start, bottomRight, topRight, end, topLeft, bottomLeft];
	}, [start, end, zoom]);

	return <Polygon positions={trackPoints} pathOptions={style} />;
}

export { DoubleTrack };
