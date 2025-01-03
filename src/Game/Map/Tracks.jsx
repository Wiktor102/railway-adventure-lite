import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { LayerGroup, Polygon, Polyline } from "react-leaflet";
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

function TrackDeleteAction({ onClick, disabled = false }) {
	function handleClick(e) {
		e.stopPropagation();
		onClick(e);
	}

	return (
		<div className="track-action" data-style={tractActionStyles}>
			<IconButton onClick={handleClick} disabled={disabled}>
				<i className="fas fa-trash"></i>
			</IconButton>
		</div>
	);
}

TrackDeleteAction.propTypes = {
	onClick: PropTypes.func.isRequired,
	disabled: PropTypes.bool
};

function SingleTrack({ start, end, color, onClick, enableHover = false }) {
	if (!Array.isArray(color)) {
		color = [color];
	}
	if (color.length !== 1) console.warn("SingleTrack: color prop should be a string or an array with a single string");

	const style = useTrackStyle();
	const [hover, setHover] = useState(false);
	const adjustedColors = useMemo(() => {
		if (!hover) return color;
		return color.map(c => {
			const isHex = c.startsWith("#");
			if (isHex) {
				return c.replace(/[0-9a-f]{2}/gi, x => {
					const num = parseInt(x, 16);
					return Math.min(255, num + 20)
						.toString(16)
						.padStart(2, "0");
				});
			}
			return c;
		});
	}, [hover, color]);

	function hoverStart() {
		setHover(true);
	}

	function hoverEnd() {
		setHover(false);
	}

	return (
		<Polyline
			positions={[start, end]}
			pathOptions={{ ...style, color: adjustedColors[0] }}
			eventHandlers={enableHover ? { mouseover: hoverStart, mouseout: hoverEnd, click: onClick } : {}}
			interactive={enableHover}
		/>
	);
}

SingleTrack.propTypes = {
	start: PropTypes.object.isRequired,
	end: PropTypes.object.isRequired,
	color: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
	onClick: PropTypes.func,
	enableHover: PropTypes.bool
};

function DoubleTrack({ start, end, color, onClick, separation = 1, enableHover = false, setOptions }) {
	const rememberedColors = useMemo(() => (!Array.isArray(color) ? [color, color] : color), [color]);
	const [adjustedColors, setAdjustedColors] = useState(rememberedColors);
	const zoom = useMapZoom();
	const style = useTrackStyle();

	const trackPoints = useMemo(() => {
		const distance = start.distanceTo(end);
		const tipLength = distance < 10000 ? distance * 0.2 : distance * 0.05;

		const offsetX = distance - tipLength * 2;
		const offsetY = Math.max(-40 * zoom + (240 - 12 * -40) * separation, 80);
		const { topLeft, topRight, bottomLeft, bottomRight } = calculateKiteVertices(start, end, offsetX, offsetY);
		return [start, bottomRight, topRight, end, topLeft, bottomLeft];
	}, [start, end, zoom, separation]);

	const hoverDetectorPositions = useMemo(
		() => [trackPoints[0], trackPoints[1], trackPoints[2], trackPoints[3], trackPoints[4], trackPoints[5]],
		[trackPoints]
	);

	useEffect(() => {
		setOptions && setOptions({ hoverDetectorPositions });
	}, [hoverDetectorPositions]);

	return (
		<>
			{enableHover && (
				<DoubleTrackHoverDetector
					positions={hoverDetectorPositions}
					style={style}
					colors={rememberedColors}
					setAdjustedColors={setAdjustedColors}
					onClick={onClick}
				/>
			)}
			<Polyline
				positions={[trackPoints[0], trackPoints[1], trackPoints[2], trackPoints[3]]}
				pathOptions={{ ...style, color: (enableHover ? adjustedColors : rememberedColors)[0] }}
				interactive={false}
			/>
			<Polyline
				positions={[trackPoints[0], trackPoints[5], trackPoints[4], trackPoints[3]]}
				pathOptions={{ ...style, color: (enableHover ? adjustedColors : rememberedColors)[1] }}
				interactive={false}
			/>
		</>
	);
}

DoubleTrack.propTypes = {
	start: PropTypes.object.isRequired,
	end: PropTypes.object.isRequired,
	color: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
	onClick: PropTypes.func,
	separation: PropTypes.number,
	enableHover: PropTypes.bool,
	setOptions: PropTypes.func
};

function TripleTrack({ start, end, color, onClick, enableHover = false }) {
	const rememberedColors = useMemo(() => (!Array.isArray(color) ? [color, color, color] : color), [color]);
	const [adjustedColors, setAdjustedColors] = useState(rememberedColors);
	const [options, setOptions] = useState({});
	const style = useTrackStyle();

	return (
		<>
			{options && enableHover && (
				<DoubleTrackHoverDetector
					positions={options.hoverDetectorPositions}
					style={style}
					colors={rememberedColors}
					setAdjustedColors={setAdjustedColors}
					onClick={onClick}
				/>
			)}
			<SingleTrack start={start} end={end} color={(enableHover ? adjustedColors : rememberedColors)[2]} />
			<DoubleTrack
				start={start}
				end={end}
				color={enableHover ? adjustedColors : rememberedColors}
				separation={1.5}
				onClick={onClick}
				setOptions={setOptions}
			/>
		</>
	);
}

TripleTrack.propTypes = {
	start: PropTypes.object.isRequired,
	end: PropTypes.object.isRequired,
	color: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
	onClick: PropTypes.func,
	enableHover: PropTypes.bool
};

function DoubleTrackHoverDetector({ positions, style, colors, onClick, setAdjustedColors }) {
	const [hover, setHover] = useState(false);

	function hoverStart() {
		setHover(true);
	}

	function hoverEnd() {
		setHover(false);
	}

	useEffect(() => {
		if (!hover) {
			setAdjustedColors(colors);
			return;
		}

		const adjusted = colors.map(c => {
			const isHex = c.startsWith("#");
			if (isHex) {
				return c.replace(/[0-9a-f]{2}/gi, x => {
					const num = parseInt(x, 16);
					return Math.min(255, num + 20)
						.toString(16)
						.padStart(2, "0");
				});
			}
			return c;
		});
		setAdjustedColors(adjusted);
	}, [hover, colors, setAdjustedColors]);

	return (
		<Polygon
			positions={positions}
			pathOptions={{ fillColor: "#f000", color: "#0f00", weight: style.weight + 1 }}
			eventHandlers={{ mouseover: hoverStart, mouseout: hoverEnd, click: onClick }}
		/>
	);
}

DoubleTrackHoverDetector.propTypes = {
	positions: PropTypes.array.isRequired,
	style: PropTypes.object.isRequired,
	colors: PropTypes.array.isRequired,
	onClick: PropTypes.func.isRequired,
	setAdjustedColors: PropTypes.func.isRequired
};

export { TrackWithActions, SingleTrack, DoubleTrack, TripleTrack, TrackDeleteAction };
