import { Marker } from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import { LatLng } from "leaflet";
import PropTypes from "prop-types";

// Linear interpolation between two points
const interpolatePosition = (start, end, fraction) => {
	return new LatLng(start.lat + (end.lat - start.lat) * fraction, start.lng + (end.lng - start.lng) * fraction);
};

// Calculate cumulative distances for each point
const calculatePathMetrics = path => {
	const distances = [0]; // First point starts at 0
	let totalLength = 0;

	for (let i = 0; i < path.length - 1; i++) {
		totalLength += path[i].latlng.distanceTo(path[i + 1].latlng);
		distances.push(totalLength);
	}

	return { totalLength, distances };
};

const MovingMarker = ({ path, speed = 50, ...props }) => {
	const [position, setPosition] = useState(path[0].latlng);
	const [, setIsComplete] = useState(false);

	const requestRef = useRef();
	const previousTimeRef = useRef();
	const progressRef = useRef(0);
	const currentSegmentRef = useRef(0); // Index of last passed path point
	const stopTimeoutRef = useRef();
	const isStoppedAtStationRef = useRef(false);
	const isResumingRef = useRef(false);
	const pathMetricsRef = useRef(calculatePathMetrics(path));

	const stopAnimation = () => {
		if (requestRef.current) {
			cancelAnimationFrame(requestRef.current);
			requestRef.current = undefined;
		}
		setIsComplete(true);
	};

	/*
	const resetAnimation = () => {
		progressRef.current = 0;
		currentSegmentRef.current = 0;
		previousTimeRef.current = undefined;
		isStoppedAtStationRef.current = false;
		isResumingRef.current = false;

		setIsComplete(false);
		setPosition(path[0].latlng);
	};
    */

	const animate = time => {
		if (isStoppedAtStationRef.current) {
			console.log("is stopped");
			requestRef.current = requestAnimationFrame(animate);
			return;
		}

		if (previousTimeRef.current == null || isResumingRef.current) {
			previousTimeRef.current = time;
			isResumingRef.current = false;
		}

		const deltaTime = (time - previousTimeRef.current) / 1000;
		previousTimeRef.current = time;

		// Update total distance traveled
		// Convert speed from km/h to m/s: (km/h) / 3.6 = m/s
		progressRef.current += deltaTime * (speed / 3.6);

		// Find current segment based on total distance
		let newSegment = currentSegmentRef.current;
		while (newSegment < path.length - 1 && progressRef.current > pathMetricsRef.current.distances[newSegment + 1]) {
			newSegment++;
		}

		const didJustUpdateSegment = newSegment !== currentSegmentRef.current;
		currentSegmentRef.current = newSegment;

		if (currentSegmentRef.current >= path.length - 1) {
			console.log("end of path");
			setPosition(path[path.length - 1].latlng);
			stopAnimation();
			return;
		}

		// Handle station stops
		if (path[currentSegmentRef.current].stop && didJustUpdateSegment) {
			isStoppedAtStationRef.current = true;
			stopTimeoutRef.current = setTimeout(() => {
				isStoppedAtStationRef.current = false;
				isResumingRef.current = true;
			}, path[currentSegmentRef.current].stop);
		}

		// Calculate fraction within current segment
		const segmentStartDist = pathMetricsRef.current.distances[currentSegmentRef.current];
		const segmentEndDist = pathMetricsRef.current.distances[currentSegmentRef.current + 1];
		const segmentLength = segmentEndDist - segmentStartDist;
		const segmentProgress = progressRef.current - segmentStartDist;
		const fraction = segmentProgress / segmentLength;

		const currentPos = interpolatePosition(
			path[currentSegmentRef.current].latlng,
			path[currentSegmentRef.current + 1].latlng,
			Math.min(fraction, 1)
		);
		setPosition([currentPos.lat, currentPos.lng]);
		requestRef.current = requestAnimationFrame(animate);
	};

	useEffect(() => {
		pathMetricsRef.current = calculatePathMetrics(path);
		// resetAnimation();
		requestRef.current = requestAnimationFrame(animate);

		return () => {
			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current);
			}

			if (stopTimeoutRef.current) {
				clearTimeout(stopTimeoutRef.current);
			}
		};
	}, [path, speed]);

	return <Marker position={position} {...props} />;
};

MovingMarker.propTypes = {
	path: PropTypes.arrayOf(PropTypes.shape({ latlng: PropTypes.instanceOf(LatLng), stop: PropTypes.number })).isRequired,
	speed: PropTypes.number, // Speed in kilometers per hour
	icon: PropTypes.object
};

export default MovingMarker;
