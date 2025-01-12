import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { divIcon } from "leaflet";

// hooks
import { useGameStore } from "../../../store/GameStoreProvider";

// components
import MovingMarker from "../MovingMarker/MovingMarker";

const TrainController = observer(() => {
	const { trainStore } = useGameStore();
	const trainsToRender = trainStore.trains.filter(train => train.route !== null);

	return trainsToRender.map(train => {
		return <TrainMarker key={train.id} train={train} />;
	});
});

const TrainMarker = observer(({ train }) => {
	/**@type {import("../../../store/models/Route").default} */
	const route = useMemo(() => train.route, [train]);
	const { gameSpeed } = useGameStore();

	const [isEnd, setIsEnd] = useState(0);

	const markerRef = useRef(null);
	const timeoutRef = useRef();

	const adjustedPath = useMemo(
		() => (train.direction === -1 ? route.fullPath?.toReversed() : route.fullPath),
		[route.fullPath, train.direction]
	);

	const onEnd = useCallback(() => {
		train.onRouteEnd();
		setIsEnd(Date.now());
	}, [train]);

	// Handle restarting the animation (and waiting)
	useEffect(() => {
		if (isEnd > 0) {
			const normalInterval = route.routeInterval * 1000;
			const timePassed = Date.now() - isEnd;
			const remainingTime = normalInterval - timePassed;

			timeoutRef.current = setTimeout(() => {
				setIsEnd(0);
				markerRef.current?.resetAnimation();
			}, remainingTime / gameSpeed);
		}

		return () => clearTimeout(timeoutRef.current);
	}, [gameSpeed, isEnd, route.routeInterval]);

	const icon = useMemo(() => {
		return new divIcon({
			html: getTrainPinSvgString(route.color, (train.passengers.length / train.seats) * 100),
			iconSize: [38, 51],
			iconAnchor: [38 / 2, 51]
		});
	}, [route.color, train.passengers.length, train.seats]);

	if (!adjustedPath) return null;
	return (
		<MovingMarker
			key={train.id}
			path={adjustedPath}
			ref={markerRef}
			speed={train.speed}
			simulationSpeed={gameSpeed}
			icon={icon}
			eventHandlers={{
				onStart: train.onRouteStart,
				onEnd,
				onStop: train.onStopReached,
				onStopEnd: train.onStopDeparting
			}}
		/>
	);
});

function getTrainPinSvgString(color, percentage = 0) {
	return `
    <?xml version="1.0" encoding="utf-8"?>
    <svg width="384px" height="512px" viewBox="0 0 384 512" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
      <defs>
        <path d="M384 0L384 0L384 512L0 512L0 0L384 0Z" id="path_1" />
        <clipPath id="clip_1">
          <use xlink:href="#path_1" clip-rule="evenodd" fill-rule="evenodd" />
        </clipPath>
      </defs>
      <g id="location-pin-solid">
        <path d="M384 0L384 0L384 512L0 512L0 0L384 0Z" id="location-pin-solid" fill="none" stroke="none" />
        <mask id="overlay">
            <path d="M384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2C117 435 0 279.4 0 192C0 86 86 0 192 0C298 0 384 86 384 192L384 192Z" id="Shape" fill="white" stroke="none" clip-path="url(#clip_1)" />
        </mask>
        <path d="M384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2C117 435 0 279.4 0 192C0 86 86 0 192 0C298 0 384 86 384 192L384 192Z" id="Shape" fill="${
			color ?? "#10527A"
		}" stroke="none" clip-path="url(#clip_1)" />
        <rect width="100%" height="${percentage}%" y="${100 - percentage}%" fill="#0000003F" mask="url(#overlay)" />
        <path d="M53 160C53 82.6801 115.456 20 192.5 20C269.544 20 332 82.6801 332 160C332 237.32 269.544 300 192.5 300C115.456 300 53 237.32 53 160Z" id="Oval" fill="#ffffff" fill-rule="evenodd" stroke="none" clip-path="url(#clip_1)" />
        <path d="M144.579 66C124.937 66 109 81.873 109 101.438L109 195.938C109 213.656 122.046 228.311 139.057 230.969L122.009 247.949C119.414 250.533 121.267 255 124.937 255L139.65 255C142.8 255 145.802 253.745 148.026 251.53L168.299 231.375L215.738 231.375L235.974 251.53C238.198 253.745 241.2 255 244.35 255L259.063 255C262.77 255 264.623 250.533 261.991 247.949L244.943 230.969C261.991 228.348 275 213.656 275 195.938L275 101.438C275 81.873 259.063 66 239.421 66L144.579 66L144.579 66ZM132.72 101.438C132.72 94.9037 138.019 89.625 144.579 89.625L239.458 89.625C246.018 89.625 251.317 94.9037 251.317 101.438L251.317 136.875C251.317 143.409 246.018 148.688 239.458 148.688L144.579 148.688C138.019 148.688 132.72 143.409 132.72 136.875L132.72 101.438L132.72 101.438ZM192.019 172.313C201.844 172.313 209.808 180.245 209.808 190.031C209.808 199.817 201.844 207.75 192.019 207.75C182.194 207.75 174.229 199.817 174.229 190.031C174.229 180.245 182.194 172.313 192.019 172.313L192.019 172.313Z" id="Shape" fill="${
			color ?? "#10527A"
		}" fill-rule="evenodd" stroke="none" clip-path="url(#clip_1)" />
      </g>
    </svg>
    `;
}

export default TrainController;
