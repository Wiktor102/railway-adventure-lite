import Scrollbars from "react-custom-scrollbars-2";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import PropTypes from "prop-types";
import { observer } from "mobx-react-lite";

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
				{tab === "trains" && <TrainsTab />}
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

const TrainsTab = observer(() => {
	return (
		<>
			<p>Trains tab</p>
		</>
	);
});

export default StationPopup;
