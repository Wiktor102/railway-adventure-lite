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

const findClosestPassedPointAndProgress = (path, pathMetrics, startPosition) => {
	if (!startPosition) return { index: 0, additionalProgress: 0 };

	let minDistance = Infinity;
	let closestIndex = 0;

	// Find closest point
	for (let i = 0; i < path.length; i++) {
		const distance = path[i].latlng.distanceTo(startPosition);
		if (distance < minDistance) {
			minDistance = distance;
			closestIndex = i;
		}
	}

	// Get the previous point as our reference
	const startIndex = Math.max(0, closestIndex - 1);

	// Calculate additional progress from the previous point to startPosition
	const additionalProgress = pathMetrics.distances[startIndex] + path[startIndex].latlng.distanceTo(startPosition);

	return { index: startIndex, additionalProgress };
};

const MovingMarker = ({ path, speed = 50, simulationSpeed = 1, eventHandlers = {}, startPosition, ref, ...props }) => {
	const { onStart, onStop, onStopEnd, onEnd } = eventHandlers;

	const [position, setPosition] = useState(startPosition || path[0].latlng);
	const [isPaused, setIsPaused] = useState(0); // Stores timestamp at which the marker was paused; 0 - not paused

	const requestRef = useRef();
	const previousTimeRef = useRef();
	const progressRef = useRef(0);
	const currentSegmentRef = useRef(0); // Index of last passed path point
	const stopTimeoutRef = useRef();
	const isResumingRef = useRef(false);
	const isEndedRef = useRef(false);
	const hasStartedRef = useRef(false); // Add this line
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
			if (isPaused) {
				requestRef.current = requestAnimationFrame(animate);
				return;
			}

			if (isResumingRef.current && typeof onStopEnd === "function") onStopEnd(path[currentSegmentRef.current].stop);
			if (previousTimeRef.current == null || isResumingRef.current) {
				previousTimeRef.current = time;
				isResumingRef.current = false;
			}

			const deltaTime = (time - previousTimeRef.current) / 1000;
			previousTimeRef.current = time;

			// Update total distance traveled
			// Convert speed from km/h to m/s: (km/h) / 3.6 = m/s
			progressRef.current += deltaTime * ((speed * simulationSpeed) / 3.6);

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
				typeof onStop === "function" && onStop(path[currentSegmentRef.current].stop);
				setIsPaused(Date.now());
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
		[isPaused, speed, simulationSpeed, path, cleanupAnimation, onStopEnd, stopAnimation, onStop]
	);

	const resetAnimation = useCallback(() => {
		cleanupAnimation();
		progressRef.current = 0;
		currentSegmentRef.current = 0;
		previousTimeRef.current = undefined;
		isResumingRef.current = false;
		isEndedRef.current = false;

		setIsPaused(false);
		setPosition(path[0].latlng);
		requestRef.current = requestAnimationFrame(animate);
		typeof onStart === "function" && onStart();
	}, [animate, cleanupAnimation, onStart, path]);

	// Handle animation start and clean-up
	useEffect(() => {
		if (!requestRef.current) {
			if (!hasStartedRef.current) {
				if (startPosition) {
					const { index, additionalProgress } = findClosestPassedPointAndProgress(
						path,
						pathMetricsRef.current,
						startPosition
					);
					currentSegmentRef.current = index;
					progressRef.current = additionalProgress;
				}

				hasStartedRef.current = true;
				typeof onStart === "function" && onStart();
			}

			requestRef.current = requestAnimationFrame(animate);
		}

		return cleanupAnimation;
	}, [animate, cleanupAnimation, onStart, startPosition, path]);

	// Handle path changes - recalculate distance(s)
	useEffect(() => {
		pathMetricsRef.current = calculatePathMetrics(path);
	}, [path]);

	// Handle Pause / unpause
	useEffect(() => {
		if (isPaused > 0) {
			stopTimeoutRef.current && clearTimeout(stopTimeoutRef.current);

			const elapsedTime = Date.now() - isPaused;
			const originalDuration = path[currentSegmentRef.current].stop.duration;
			const remainingTime = Math.max(0, (originalDuration - elapsedTime * simulationSpeed) / simulationSpeed);

			stopTimeoutRef.current = setTimeout(() => {
				setIsPaused(false);
				isResumingRef.current = true;
			}, remainingTime);
		}

		return () => stopTimeoutRef.current && clearTimeout(stopTimeoutRef.current);
	}, [simulationSpeed, path, isPaused]);

	useImperativeHandle(ref, () => ({ resetAnimation, position }), [position, resetAnimation]);

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
		onStart: PropTypes.func,
		onEnd: PropTypes.func,
		onStop: PropTypes.func,
		onStopEnd: PropTypes.func
	}),
	ref: PropTypes.object,
	speed: PropTypes.number, // Speed in kilometers per hour
	simulationSpeed: PropTypes.number, // Simulation speed multiplier
	icon: PropTypes.object,
	startPosition: PropTypes.instanceOf(LatLng)
};

export default MovingMarker;
