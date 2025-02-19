import { Marker } from "@adamscybot/react-leaflet-component-marker";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { observer } from "mobx-react-lite";
import { useMapEvent } from "react-leaflet";
import { latLng } from "leaflet";

// hooks and utilities
import { useGameStore } from "../../../store/GameStoreProvider";
import { pointNearestCircle } from "../../../utils/utils";

// components
import Track from "../../../store/models/Track";
import TrackCostIndicator from "../components/TrackCostIndicator/TrackCostIndicator";

const TrackDrawController = observer(() => {
	const { stationStore, trackStore, showError, subtractMoney } = useGameStore();
	const { snappedStation, toggleSnapping, setSnappedStation } = stationStore;
	const { addTrack, setBuildingTrack } = trackStore;

	const [startStation, setStartStation] = useState(null);
	const [endPoint, setEndPoint] = useState(null);

	const [selectedEndPoint, setSelectedEndPoint] = useState(null);
	const [isForbidden, setIsForbidden] = useState(false);

	const navigate = useNavigate();
	const { "*": splat } = useParams();
	const trackWidth = +splat;

	const Component = Track.getComponent(trackWidth);
	const cost = useMemo(() => {
		if (!startStation || !endPoint) return 0;
		return Math.round(Track.prices[trackWidth] * (latLng(startStation.coordinates).distanceTo(endPoint) / 1000));
	}, [endPoint, startStation, trackWidth]);

	function rejectTrack() {
		if (startStation == null) {
			navigate("/game/tracks");
		}

		setBuildingTrack(false);

		toggleSnapping(false);
		setSnappedStation({ station: null, distance: null }); // Need to reset manually

		setStartStation(null);
		setSelectedEndPoint(null);
	}

	function acceptTrack() {
		const exits = trackStore.trackExists(startStation.name, snappedStation.station.name);
		if (exits) {
			rejectTrack();
			showError("Tor pomiędzy wybranymi stacjami już istnieje");
			return;
		}

		const paySuccess = subtractMoney(cost);
		if (!paySuccess) return;

		const track = new Track(trackWidth, startStation, snappedStation.station);
		setStartStation(snappedStation.station);
		addTrack(track);
	}

	const handleClick = () => {
		if (!snappedStation.station) return;
		if (startStation === null) {
			setStartStation(snappedStation.station);
			setBuildingTrack(true);

			setSnappedStation({ station: null, distance: null }); // Need to reset manually
			toggleSnapping(true);
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

	useEffect(checkCollision, [startStation, endPoint, stationStore.stations, trackWidth, snappedStation.station?.name]);

	// TODO: convert to useMemo
	useEffect(() => {
		if (snappedStation.station && snappedStation.station.name !== startStation?.name) {
			setEndPoint(latLng(snappedStation.station.coordinates));
			return;
		}

		setEndPoint(selectedEndPoint);
	}, [selectedEndPoint, snappedStation, startStation?.name]);

	if (!startStation || !endPoint) return null;
	return (
		<>
			<Component
				start={latLng(startStation.coordinates)}
				end={endPoint}
				color={isForbidden ? "#ec3220" : snappedStation.station ? "#2572dd" : "#da8220"}
			/>
			<Marker position={endPoint} icon={<TrackCostIndicator cost={cost} />} interactive={false} />
		</>
	);
});

export default TrackDrawController;
