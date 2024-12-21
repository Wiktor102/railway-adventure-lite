import { useMemo } from "react";
import PropTypes from "prop-types";
import { LayerGroup, Polygon, Polyline } from "react-leaflet";
import { Marker } from "@adamscybot/react-leaflet-component-marker";
import { latLng } from "leaflet";

// hooks and utilities
import useMapZoom from "../../hooks/useMapZoom";
import { calculateKiteVertices } from "../../utils";

// components
import IconButton from "../Ui/IconButton/IconButton";

import tractActionStyles from "./TrackActions.component.scss";

function useTrackStyle(color) {
	const zoom = useMapZoom();

	return {
		fill: false,
		color: color === "blue" ? "#2572dd" : color === "red" ? "#ec3220" : "#da8220",
		weight: Math.round(zoom / 3) * (zoom > 12 ? Math.pow(1.2, zoom - 12) : 1)
	};
}

function TrackWithActions({ children, onAccept, onReject, onEdit }) {
	const { end } = children.props;
	const offset = latLng(end.lat + 0.007, end.lng);

	return (
		<LayerGroup>
			{children}
			<Marker position={offset} icon={<TrackActions onAccept={onAccept} onReject={onReject} onEdit={onEdit} />} />
		</LayerGroup>
	);
}

function TrackActions({ onAccept, onReject, onEdit }) {
	return (
		<div className="track-actions" data-style={tractActionStyles} onClick={e => e.stopPropagation()}>
			{onAccept && (
				<IconButton className="accept" onClick={onAccept}>
					<i className="fas fa-check"></i>
				</IconButton>
			)}
			{onReject && (
				<IconButton className="reject" onClick={onReject}>
					<i className="fas fa-times"></i>
				</IconButton>
			)}
			{onEdit && (
				<IconButton onClick={onEdit}>
					<i className="fas fa-pencil"></i>
				</IconButton>
			)}
		</div>
	);
}

function SingleTrack({ start, end, color }) {
	const style = useTrackStyle(color);

	return <Polyline positions={[start, end]} pathOptions={style} />;
}

SingleTrack.propTypes = {
	start: PropTypes.object.isRequired,
	end: PropTypes.object.isRequired,
	color: PropTypes.string
};

function DoubleTrack({ start, end, color, separation = 1 }) {
	const zoom = useMapZoom();
	const style = useTrackStyle(color);

	const trackPoints = useMemo(() => {
		const distance = start.distanceTo(end);
		const tipLength = distance * 0.05;

		const offsetX = distance - tipLength * 2;
		const offsetY = -40 * zoom + (240 - 12 * -40) * separation;
		const { topLeft, topRight, bottomLeft, bottomRight } = calculateKiteVertices(start, end, offsetX, offsetY);
		return [start, bottomRight, topRight, end, topLeft, bottomLeft];
	}, [start, end, zoom, separation]);

	return <Polygon positions={trackPoints} pathOptions={style} />;
}

DoubleTrack.propTypes = {
	start: PropTypes.object.isRequired,
	end: PropTypes.object.isRequired,
	color: PropTypes.string,
	separation: PropTypes.number
};

function TripleTrack({ start, end, color }) {
	return (
		<LayerGroup>
			<DoubleTrack start={start} end={end} color={color} separation={1.5} />
			<SingleTrack start={start} end={end} color={color} />
		</LayerGroup>
	);
}

TripleTrack.propTypes = {
	start: PropTypes.object.isRequired,
	end: PropTypes.object.isRequired,
	color: PropTypes.string
};

export { TrackWithActions, SingleTrack, DoubleTrack, TripleTrack };
