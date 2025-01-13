import Scrollbars from "react-custom-scrollbars-2";
import styles from "./PassengerMenu.component.scss";
import { NavLink, useMatch } from "react-router";
import { observer } from "mobx-react-lite";
import { useGameStore } from "../../../store/GameStoreProvider";

// components
import AccordionContainer from "../../common/AccordionContainer/AccordionContainer";

const PassengerMenu = () => {
	const trainsTab = useMatch("/game/passengers/on-trains");

	return (
		<>
			<h2>Pasażerowie</h2>
			<div className="passenger-menu" data-style={styles}>
				<nav className="tabs">
					<ul>
						<li>
							<NavLink to="/game/passengers/at-stations">
								<i className="fas fa-school"></i> Oczekujący
							</NavLink>
						</li>
						<li>
							<NavLink to="/game/passengers/on-trains">
								<i className="fas fa-train"></i> W pociągach
							</NavLink>
						</li>
					</ul>
				</nav>
				<Scrollbars>
					{!trainsTab && <PassengersAtStations />}
					{trainsTab && <PassengersInTrains />}
				</Scrollbars>
			</div>
		</>
	);
};

const PassengersAtStations = observer(() => {
	const { stationStore } = useGameStore();
	const stationsToDisplay = stationStore.stations
		.filter(station => station.waitingPassengers.length > 0)
		.sort((a, b) => b.waitingPassengers.length - a.waitingPassengers.length);

	if (stationsToDisplay.length === 0) {
		return (
			<div className="empty">
				<i className="fas fa-school-circle-xmark"></i>
				<p>Brak oczekujących pasażerów</p>
			</div>
		);
	}

	return (
		<ul className="passengers-outer-list">
			{stationsToDisplay.map(station => (
				<li key={station.name}>
					<AccordionContainer header={station.name} label={station.waitingPassengers.length}>
						<InnerPassengerList passengers={station.waitingPassengers} />
					</AccordionContainer>
				</li>
			))}
		</ul>
	);
});

const PassengersInTrains = observer(() => {
	const { trainStore } = useGameStore();
	const trainsToDisplay = trainStore.trains
		.filter(train => train.passengers.length > 0)
		.sort((a, b) => b.passengers.length - a.passengers.length);

	if (trainsToDisplay.length === 0) {
		return (
			<div className="empty">
				<i className="fas fa-train"></i>
				<p>Brak pasażerów w pociągach</p>
			</div>
		);
	}

	return (
		<ul className="passengers-outer-list">
			{trainsToDisplay.map(train => (
				<li key={train.id}>
					<AccordionContainer
						header={<span style={{ color: train.route.color }}>Pociąg nr. {train.id + 1}</span>}
						label={train.passengers.length}
					>
						<InnerPassengerList passengers={train.passengers} />
					</AccordionContainer>
				</li>
			))}
		</ul>
	);
});

const InnerPassengerList = observer(({ passengers }) => {
	const groupedByDestination = Object.groupBy(passengers, p => p.destinationName);

	// Convert to array of entries and sort by passenger count (descending)
	const sortedEntries = Object.entries(groupedByDestination).sort(([, a], [, b]) => b.length - a.length);

	return (
		<ul className="passenger-inner-list">
			{sortedEntries.map(([stationName, passengers]) => (
				<li key={stationName}>
					<span className="destination">{stationName}</span>
					<b>{passengers.length}</b>
				</li>
			))}
		</ul>
	);
});

export default PassengerMenu;
