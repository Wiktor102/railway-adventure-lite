import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toJS } from "mobx";

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
	const [reverse, setReverse] = useState(false);

	const markerRef = useRef(null);
	const timeoutRef = useRef();

	const path = useMemo(
		() =>
			route.path.flatMap((segment, i) => {
				const segmentLatlngs = toJS(segment.track.latlngs[segment.trackIndex]);
				return segmentLatlngs
					.map((latlng, j) => {
						const hasStop = j === segmentLatlngs.length - 1 && train.route.stations.includes(segment.to);
						const stop = hasStop ? { duration: route.stopDuration * 1000, name: segment.to } : undefined;
						return { latlng, stop };
					})
					.slice(i === 0 ? 0 : 1);
			}),
		[route.path, route.stopDuration, train.route.stations]
	);

	const adjustedPath = useMemo(() => (reverse ? path.toReversed() : path), [path, reverse]);

	const onEnd = useCallback(() => {
		setIsEnd(Date.now());
		setReverse(r => !r);
	}, []);

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

	// console.log(path);
	// return null;
	return (
		<MovingMarker
			key={train.id}
			path={adjustedPath}
			ref={markerRef}
			speed={train.speed}
			simulationSpeed={gameSpeed}
			eventHandlers={{ onEnd }}
		/>
	);
});

export default TrainController;
