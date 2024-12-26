import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { useMapEvent } from "react-leaflet";
import { useGameStore } from "../../store/GameStoreProvider";
import Track from "../../store/models/Track";
import { latLng } from "leaflet";
import { pointNearestCircle } from "../../utils/utils";
import { useParams } from "react-router";

const TrackDrawController = observer(() => {
	const { stationStore, trackStore } = useGameStore();
	const { snappedStation } = stationStore;
	const { addTrack } = trackStore;

	const [startStation, setStartStation] = useState(null);
	const [endPoint, setEndPoint] = useState(null);

	const [selectedEndPoint, setSelectedEndPoint] = useState(null);
	const [isForbidden, setIsForbidden] = useState(false);
	const { "*": splat } = useParams();
	const trackWidth = +splat;

	const Component = Track.getComponent(trackWidth);

	function rejectTrack() {
		setStartStation(null);
		setSelectedEndPoint(null);
	}

	function acceptTrack() {
		const track = new Track(trackWidth, startStation, snappedStation.station);
		setStartStation(snappedStation.station);
		addTrack(track);
	}

	const handleClick = () => {
		if (!snappedStation.station) return;
		if (startStation === null) {
			setStartStation(snappedStation.station);
		} else if (snappedStation.station.name !== startStation.name) {
			acceptTrack();
		}
	};

	const mouseMoveCounter = useRef(0);
	const handleMouseMove = ({ latlng }) => {
		if (mouseMoveCounter.current % 4 === 0 && startStation) {
			setSelectedEndPoint(latlng);
		}

		mouseMoveCounter.current++;
	};

	const checkCollision = () => {
		if (!startStation || !endPoint) {
			setIsForbidden(false);
			return;
		}

		const collisionRadiusMeters = 200 + 350 * trackWidth;
		const hasCollision = stationStore.stations.some(station => {
			if (station === startStation || snappedStation.station?.name === station.name) return false;
			const point = pointNearestCircle(latLng(startStation.coordinates), endPoint, latLng(station.coordinates));
			return point.distanceTo(latLng(station.coordinates)) < collisionRadiusMeters;
		});

		setIsForbidden(hasCollision);
	};

	useMapEvent("click", handleClick);
	useMapEvent("mousemove", handleMouseMove);
	useMapEvent("contextmenu", rejectTrack);

	useEffect(checkCollision, [startStation, endPoint, stationStore.stations, trackWidth]);

	// TODO: convert to useMemo
	useEffect(() => {
		if (snappedStation.station && snappedStation.station.name !== startStation?.name) {
			setEndPoint(latLng(snappedStation.station.coordinates));
			return;
		}

		setEndPoint(selectedEndPoint);
	}, [selectedEndPoint, snappedStation]);

	if (!startStation || !endPoint) return null;
	return (
		<>
			<Component
				start={latLng(startStation.coordinates)}
				end={endPoint}
				color={isForbidden ? "red" : snappedStation.station ? "blue" : "orange"}
			/>
		</>
	);
});

export default TrackDrawController;
