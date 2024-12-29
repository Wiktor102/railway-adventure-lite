import { useMemo } from "react";
import PropTypes from "prop-types";
import { LayerGroup, Polyline } from "react-leaflet";
import { Marker } from "@adamscybot/react-leaflet-component-marker";
import { latLng } from "leaflet";

// hooks and utilities
import useMapZoom from "../../hooks/useMapZoom";
import { calculateKiteVertices } from "../../utils/utils";

// components
import IconButton from "../../Ui/common/IconButton/IconButton";

import tractActionStyles from "./TrackActions.component.scss";

function useTrackStyle() {
	const zoom = useMapZoom();

	return {
		fill: false,
		weight: Math.round(zoom / 3) * (zoom > 12 ? Math.pow(1.2, zoom - 12) : 1)
	};
}

function TrackWithActions({ children, actions }) {
	const { start, end } = children.props;
	const offset = latLng((start.lat + end.lat) / 2, (start.lng + end.lng) / 2);

	return (
		<LayerGroup>
			{children}
			<Marker position={offset} icon={actions} />
		</LayerGroup>
	);
}

TrackWithActions.propTypes = {
	children: PropTypes.element.isRequired,
	actions: PropTypes.element.isRequired
};

function TrackDeleteAction({ onClick }) {
	function handleClick(e) {
		e.stopPropagation();
		onClick(e);
	}

	return (
		<div className="track-action" data-style={tractActionStyles}>
			<IconButton onClick={handleClick}>
				<i className="fas fa-trash"></i>
			</IconButton>
		</div>
	);
}

TrackDeleteAction.propTypes = {
	onClick: PropTypes.func.isRequired
};

function SingleTrack({ start, end, color }) {
	const style = useTrackStyle(color);

	if (Array.isArray(color)) {
		if (color.length !== 1) console.warn("SingleTrack: color prop should be a string or an array with a single string");
		color = color[0];
	}

	return <Polyline positions={[start, end]} pathOptions={{ ...style, color }} />;
}

SingleTrack.propTypes = {
	start: PropTypes.object.isRequired,
	end: PropTypes.object.isRequired,
	color: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
};

function DoubleTrack({ start, end, color, separation = 1 }) {
	const zoom = useMapZoom();
	const style = useTrackStyle();

	if (!Array.isArray(color)) color = [color, color];
	if (color.length !== 2) console.warn("DoubleTrack: color prop should be a string or an array with two strings");

	const trackPoints = useMemo(() => {
		const distance = start.distanceTo(end);
		const tipLength = distance < 10000 ? distance * 0.2 : distance * 0.05;

		const offsetX = distance - tipLength * 2;
		const offsetY = -40 * zoom + (240 - 12 * -40) * separation;
		const { topLeft, topRight, bottomLeft, bottomRight } = calculateKiteVertices(start, end, offsetX, offsetY);
		return [start, bottomRight, topRight, end, topLeft, bottomLeft];
	}, [start, end, zoom, separation]);

	return (
		<>
			<Polyline
				positions={[trackPoints[0], trackPoints[1], trackPoints[2], trackPoints[3]]}
				pathOptions={{ ...style, color: color[0] }}
			/>
			<Polyline
				positions={[trackPoints[0], trackPoints[5], trackPoints[4], trackPoints[3]]}
				pathOptions={{ ...style, color: color[0] }}
			/>
		</>
	);
}

DoubleTrack.propTypes = {
	start: PropTypes.object.isRequired,
	end: PropTypes.object.isRequired,
	color: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
	separation: PropTypes.number
};

function TripleTrack({ start, end, color }) {
	if (!Array.isArray(color)) color = [color, color, color];
	if (color.length !== 3) console.warn("TripleTrack: color prop should be a string or an array with two strings");

	return (
		<>
			<DoubleTrack start={start} end={end} color={color.slice(0, 2)} separation={1.5} />
			<SingleTrack start={start} end={end} color={color[2]} />
		</>
	);
}

TripleTrack.propTypes = {
	start: PropTypes.object.isRequired,
	end: PropTypes.object.isRequired,
	color: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
};

export { TrackWithActions, SingleTrack, DoubleTrack, TripleTrack, TrackDeleteAction };
