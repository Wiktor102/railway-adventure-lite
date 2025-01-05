import { Marker } from "react-leaflet";
import { useState, useEffect, useRef, useCallback, useImperativeHandle } from "react";
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

const MovingMarker = ({ path, speed = 50, eventHandlers = {}, ref, ...props }) => {
	const { onEnd, onStop, onStopEnd } = eventHandlers;

	const [position, setPosition] = useState(path[0].latlng);

	const requestRef = useRef();
	const previousTimeRef = useRef();
	const progressRef = useRef(0);
	const currentSegmentRef = useRef(0); // Index of last passed path point
	const stopTimeoutRef = useRef();
	const isStoppedAtStationRef = useRef(false);
	const isResumingRef = useRef(false);
	const isEndedRef = useRef(false);
	const pathMetricsRef = useRef(calculatePathMetrics(path));

	const cleanupAnimation = useCallback(() => {
		if (requestRef.current) {
			cancelAnimationFrame(requestRef.current);
			requestRef.current = undefined;
		}

		if (stopTimeoutRef.current) {
			clearTimeout(stopTimeoutRef.current);
			stopTimeoutRef.current = undefined;
		}
	}, []);

	const stopAnimation = useCallback(() => {
		isEndedRef.current = true;
		cleanupAnimation();
		typeof onEnd === "function" && onEnd();
	}, [onEnd, cleanupAnimation]);

	const animate = useCallback(
		time => {
			if (isEndedRef.current) {
				cleanupAnimation();
				return;
			}
			if (isStoppedAtStationRef.current) {
				requestRef.current = requestAnimationFrame(animate);
				return;
			}

			if (previousTimeRef.current == null || isResumingRef.current) {
				typeof onStopEnd === "function" && onStopEnd();
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
				setPosition(path[path.length - 1].latlng);
				stopAnimation();
				return;
			}

			// Handle station stops
			if (path[currentSegmentRef.current].stop && didJustUpdateSegment) {
				isStoppedAtStationRef.current = true;
				typeof onStop === "function" && onStop(path[currentSegmentRef.current].stop);
				stopTimeoutRef.current = setTimeout(() => {
					isStoppedAtStationRef.current = false;
					isResumingRef.current = true;
				}, path[currentSegmentRef.current].stop.duration);
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
		},
		[stopAnimation, onStop, onStopEnd, path, speed, cleanupAnimation]
	);

	const resetAnimation = useCallback(() => {
		cleanupAnimation();
		progressRef.current = 0;
		currentSegmentRef.current = 0;
		previousTimeRef.current = undefined;
		isStoppedAtStationRef.current = false;
		isResumingRef.current = false;
		isEndedRef.current = false;
		setPosition(path[0].latlng);
		requestRef.current = requestAnimationFrame(animate);
	}, [animate, path, cleanupAnimation]);

	useEffect(() => {
		pathMetricsRef.current = calculatePathMetrics(path);

		// Only start animation if it's not already running
		if (!requestRef.current) {
			requestRef.current = requestAnimationFrame(animate);
		}

		return cleanupAnimation;
	}, [path, speed, animate, cleanupAnimation]);

	useImperativeHandle(ref, () => ({ resetAnimation }), [resetAnimation]);

	return <Marker position={position} {...props} />;
};

MovingMarker.propTypes = {
	path: PropTypes.arrayOf(
		PropTypes.shape({
			latlng: PropTypes.instanceOf(LatLng),
			stop: PropTypes.shape({ duration: PropTypes.number })
		})
	).isRequired,
	eventHandlers: PropTypes.shape({
		onEnd: PropTypes.func,
		onStop: PropTypes.func,
		onStopEnd: PropTypes.func
	}),
	ref: PropTypes.object,
	speed: PropTypes.number, // Speed in kilometers per hour
	icon: PropTypes.object
};

export default MovingMarker;
