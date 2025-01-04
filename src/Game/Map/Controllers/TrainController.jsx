import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { toJS } from "mobx";

// hooks
import { useGameStore } from "../../../store/GameStoreProvider";

// components
import MovingMarker from "../MovingMarker/MovingMarker";

const TrainController = observer(() => {
	const { trainStore } = useGameStore();
	const trainsToRender = trainStore.trains.filter(train => train.route !== null);
	const trainsWithPath = useMemo(() => {
		return trainsToRender.map(train => ({
			train,
			path: train.route.path.flatMap((segment, i) => {
				const segmentLatlngs = toJS(segment.track.latlngs[segment.trackIndex]);
				return segmentLatlngs
					.map((latlng, j) => ({
						latlng,
						stop: j === segmentLatlngs.length - 1 ? 2000 : undefined
					}))
					.slice(i === 0 ? 0 : 1);
			})
		}));
	}, [trainsToRender]);

	return trainsWithPath.map(({ train, path }) => {
		return <MovingMarker key={train.id} path={path} speed={360} />;
	});
});

export default TrainController;
