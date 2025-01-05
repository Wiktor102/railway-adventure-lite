import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link, NavLink, useMatch, useNavigate } from "react-router";
import Scrollbars from "react-custom-scrollbars-2";

// hooks
import { useGameStore } from "../../../store/GameStoreProvider";

// model classes
import { CarriageTrain, UnitTrain } from "../../../store/models/Train";

// component
import ElevatedButton from "../../common/ElevatedButton/ElevatedButton";

// assets
import locomotiveIcon from "../../../assets/icons/locomotive.svg";
import moneyImg from "../../../assets/icons/money.png";
import emuIcon from "../../../assets/icons/emu.svg";

// styles
import style from "./BuyTrain.component.scss";

const BuyTrain = () => {
	const { trainStore } = useGameStore();

	const [speed, setSpeed] = useState(160);
	const [object, setObject] = useState({ cost: 0 });

	const locomotive = useMatch("/game/trains/buy/locomotive");
	const emu = useMatch("/game/trains/buy/emu");
	const navigate = useNavigate();

	function buy() {
		// TODO: Handle money

		if (locomotive) {
			trainStore.addTrain(new CarriageTrain(object));
		} else if (emu) {
			trainStore.addTrain(new UnitTrain(object));
		}

		navigate("/game/trains");
	}

	return (
		<>
			<Link to="/game/trains" className="back-button" style={{ float: "left" }}>
				<i className="fas fa-arrow-left"></i>
			</Link>
			<h2>Kup pociąg</h2>
			<div className="buy-train-menu" data-style={style}>
				<Scrollbars>
					<div className="inner-wrapper">
						<nav className="tabs">
							<ul>
								<li>
									<NavLink to="/game/trains/buy/locomotive">Lokomotywa</NavLink>
								</li>
								<li>
									<NavLink to="/game/trains/buy/emu">Zespół trakcyjny</NavLink>
								</li>
							</ul>
						</nav>
						<img src={locomotive ? locomotiveIcon : emuIcon} alt="" />
						<div className="range-input-container">
							<label htmlFor="speed">
								<i className="fas fa-gauge"></i> Prędkość
							</label>
							<p>{speed} km/h</p>
							<input
								type="range"
								id="speed"
								min={100}
								max={220}
								step={20}
								value={speed}
								onChange={e => setSpeed(e.target.value)}
							/>
						</div>
						{locomotive && <BuyLocomotive speed={speed} setObject={setObject} />}
						{emu && <BuyEmu speed={speed} setObject={setObject} />}
						<div className="range-input-container">
							<label htmlFor="cost">
								<img src={moneyImg} alt="ikona pieniędzy" /> Koszt
							</label>
							<p id="cost">{object.cost.toLocaleString("en-US").replace(/,/g, " ")}</p>
						</div>
					</div>
				</Scrollbars>
				<ElevatedButton onClick={buy}>
					<i className="fas fa-cart-shopping"></i> Kup
				</ElevatedButton>
			</div>
		</>
	);
};

const BuyLocomotive = ({ speed, setObject }) => {
	const [strength, setStrength] = useState(3000);
	const maxCarriages = Math.round(strength / (speed * 5));

	useEffect(() => {
		setObject({
			speed: speed,
			strength: strength,
			maxCarriages: maxCarriages,
			cost: strength * 30 * (speed / 120)
		});
	}, [strength, speed, setObject, maxCarriages]);

	return (
		<>
			<div className="range-input-container">
				<label htmlFor="segments">
					<i className="fas fa-dumbbell"></i> Moc
				</label>
				<p>{strength} kW</p>
				<input
					type="range"
					id="segments"
					min={3000}
					max={9000}
					step={1000}
					value={strength}
					onChange={e => setStrength(e.target.value)}
				/>
			</div>
			<div className="range-input-container">
				<label htmlFor="segments">
					<i className="fas fa-weight-hanging"></i> Maksymalna liczba wagonów
				</label>
				<p>{maxCarriages}</p>
			</div>
		</>
	);
};

BuyLocomotive.propTypes = {
	speed: PropTypes.number,
	setObject: PropTypes.func
};

const BuyEmu = ({ speed, setObject }) => {
	const [segments, setSegments] = useState(4);
	const [seats, setSeats] = useState(62);

	useEffect(() => {
		const locomotivePrice = 6000;
		const segmentsPrice = (segments - 2) * 1800;
		const seatingPrice = segments * seats * 150;

		setObject({
			speed: speed,
			segments: segments,
			seats: seats * segments,
			cost: (locomotivePrice + segmentsPrice + seatingPrice) * (speed / 100)
		});
	}, [segments, seats, speed, setObject]);

	return (
		<>
			<div className="range-input-container">
				<label htmlFor="segments">
					<i className="fas fa-ruler-horizontal"></i> Liczba członów
				</label>
				<p>{segments}</p>
				<input
					type="range"
					id="segments"
					min={2}
					max={8}
					step={1}
					value={segments}
					onChange={e => setSegments(e.target.value)}
				/>
			</div>

			<div className="range-input-container">
				<label htmlFor="seats">
					<i className="fas fa-chair"></i> Liczba miejsc siedzących w członie
				</label>
				<p>{seats}</p>
				<input
					type="range"
					id="seats"
					min={50}
					max={82}
					step={4}
					value={seats}
					onChange={e => setSeats(e.target.value)}
				/>
			</div>
			<div className="range-input-container">
				<label htmlFor="seats-total">
					<i className="fas fa-chair"></i> Łączna liczba miejsc
				</label>
				<p id="seats-total">{seats * segments}</p>
			</div>
		</>
	);
};

BuyEmu.propTypes = {
	speed: PropTypes.number,
	setObject: PropTypes.func
};

export default BuyTrain;
