import Scrollbars from "react-custom-scrollbars-2";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useMap } from "react-leaflet";
import { NavLink } from "react-router";
import PropTypes from "prop-types";

// hooks
import { useGameStore } from "../../../../store/GameStoreProvider";

// styles
import style from "./StationPopup.component.scss";

const StationPopup = observer(({ station }) => {
	const { stationStore } = useGameStore();
	const { setShowedPopup } = stationStore;

	const [mouseIn, setMouseIn] = useState(false);
	const map = useMap();

	useEffect(() => {
		if (mouseIn) {
			map.scrollWheelZoom.disable();
		} else {
			map.scrollWheelZoom.enable();
		}

		return () => {
			map.scrollWheelZoom.enable();
		};
	}, [mouseIn, map]);

	const [tab, setTab] = useState("passengers");
	function onTabClick(e, tab) {
		e.stopPropagation();
		setTab(tab);
	}

	return (
		<div className="station-info" data-style={style}>
			<h5 className="name">{station.name}</h5>
			<button className="close" onClick={() => setShowedPopup(null)}>
				<i className="fas fa-times"></i>
			</button>
			<nav className="tabs">
				<ul>
					<li className={tab === "passengers" ? "active" : ""} onClick={e => onTabClick(e, "passengers")}>
						<i className="fas fa-users"></i> Pasażerowie
					</li>
					<li className={tab === "trains" ? "active" : ""} onClick={e => onTabClick(e, "trains")}>
						<i className="fas fa-train"></i> Pociągi
					</li>
				</ul>
			</nav>
			<Scrollbars
				className="scroll-container"
				onMouseOver={() => setMouseIn(true)}
				onMouseOut={() => setMouseIn(false)}
			>
				{tab === "passengers" && <PassengersTab station={station} />}
				{tab === "trains" && <TrainsTab station={station} />}
			</Scrollbars>
		</div>
	);
});

StationPopup.propTypes = {
	station: PropTypes.object.isRequired
};

const PassengersTab = observer(({ station }) => {
	const grouped = Object.groupBy(station.waitingPassengers, ({ destinationName }) => destinationName);
	const entries = Object.entries(grouped).sort((a, b) => b[1].length - a[1].length);

	if (entries.length === 0) {
		return (
			<div className="empty">
				<i className="fas fa-users"></i>
				<p>Obecnie nie czekają tu żadni podróżni</p>
			</div>
		);
	}
	return (
		<ul className="passengers-list">
			{entries.map(([destination, passengers]) => (
				<li key={destination}>
					<span>{destination}</span>
					<span>{passengers.length}</span>
				</li>
			))}
		</ul>
	);
});

const TrainsTab = observer(({ station }) => {
	const { trainStore } = useGameStore();
	const trainsAtStation = trainStore.trains.filter(train => train.currentStop?.name === station.name);

	if (trainsAtStation.length === 0) {
		return (
			<div className="empty">
				<i className="fas fa-train"></i>
				<p>Obecnie nie czeka tu żaden pociąg</p>
			</div>
		);
	}

	return (
		<ul className="train-list">
			{trainsAtStation.map(train => (
				<TrainListItem key={train.id} train={train} />
			))}
		</ul>
	);
});

const TrainListItem = observer(({ train }) => {
	const [minutes, setMinutes] = useState(99);
	const [seconds, setSeconds] = useState(99);
	const { gameSpeed } = useGameStore();

	useEffect(() => {
		function callback() {
			const now = Date.now();
			const stopDuration = train.currentStop.edge ? train.route.routeInterval : train.route.stopDuration;
			const totalDuration = stopDuration * 1000;
			const baseTime = train.currentStop.arrived;

			// Calculate elapsed time with game speed factor
			const acceleratedElapsed = (now - baseTime) * gameSpeed;
			const remaining = Math.max(0, totalDuration - acceleratedElapsed);

			setMinutes(String(Math.floor(remaining / 60000)).padStart(2, "0"));
			setSeconds(String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0"));
		}

		callback();
		const interval = setInterval(callback, 1000 / gameSpeed);
		return () => clearInterval(interval);
	}, [gameSpeed, train.currentStop, train.route.routeInterval, train.route.stopDuration]);

	return (
		<li>
			<NavLink to={`/game/routes/details/${train.route.id}`}>
				<i className="fas fa-train" style={{ color: train.route.color }}></i>
			</NavLink>
			<span className="direction">
				Kierunek: <b>{train.direction == 1 ? train.route.stations.at(-1) : train.route.stations[0]}</b>
			</span>
			<span className="passengers">
				Pasażerowie: <b>{train.passengers.length}</b>/{train.seats}
			</span>
			<span className="last">Odjazd za:</span>
			<span className="last">
				{minutes}:{seconds}
			</span>
		</li>
	);
});

export default StationPopup;
