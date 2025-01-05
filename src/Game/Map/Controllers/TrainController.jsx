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

const END_STATION_STOP_DURATION = 2000;
const TrainMarker = observer(({ train }) => {
	const markerRef = useRef(null);
	const [reverse, setReverse] = useState(false);
	const timeoutRef = useRef();

	const path = useMemo(
		() =>
			train.route.path.flatMap((segment, i) => {
				const segmentLatlngs = toJS(segment.track.latlngs[segment.trackIndex]);
				return segmentLatlngs
					.map((latlng, j) => {
						const hasStop = j === segmentLatlngs.length - 1 && train.route.stations.includes(segment.to);
						const stop = hasStop ? { duration: END_STATION_STOP_DURATION, name: segment.to } : undefined;
						return { latlng, stop };
					})
					.slice(i === 0 ? 0 : 1);
			}),
		[train.route.path, train.route.stations]
	);

	const adjustedPath = useMemo(() => (reverse ? path.toReversed() : path), [path, reverse]);

	const onEnd = useCallback(() => {
		setReverse(r => !r);
		timeoutRef.current = setTimeout(() => {
			markerRef.current?.resetAnimation();
		}, END_STATION_STOP_DURATION);
	}, []);

	useEffect(() => () => clearTimeout(timeoutRef.current), []);

	return <MovingMarker path={adjustedPath} ref={markerRef} speed={train.speed * 3} eventHandlers={{ onEnd }} />;
});

export default TrainController;
