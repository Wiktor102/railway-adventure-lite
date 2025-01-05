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
import InfoRow from "../../common/InfoRow/InfoRow";
import Slider from "../../common/Slider/Slider";

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
						<Slider
							min={100}
							max={220}
							step={20}
							value={speed}
							renderedValue={speed + " km/h"}
							onChange={v => setSpeed(v)}
						>
							<i className="fas fa-gauge"></i> Prędkość
						</Slider>
						{locomotive && <BuyLocomotive speed={speed} setObject={setObject} />}
						{emu && <BuyEmu speed={speed} setObject={setObject} />}
						<InfoRow value={object.cost.toLocaleString("en-US").replace(/,/g, " ")}>
							<img src={moneyImg} alt="ikona pieniędzy" /> Koszt
						</InfoRow>
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
			<Slider
				min={3000}
				max={9000}
				step={1000}
				value={strength}
				renderedValue={strength + " kW"}
				onChange={v => setStrength(v)}
			>
				<i className="fas fa-dumbbell"></i> Moc
			</Slider>
			<InfoRow value={maxCarriages}>
				<i className="fas fa-weight-hanging"></i> Maksymalna liczba wagonów
			</InfoRow>
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
			<Slider min={2} max={8} step={1} value={segments} onChange={v => setSegments(v)}>
				<i className="fas fa-ruler-horizontal"></i> Liczba członów
			</Slider>
			<Slider min={50} max={82} step={4} value={seats} onChange={v => setSeats(v)}>
				<i className="fas fa-chair"></i> Liczba miejsc siedzących w członie
			</Slider>

			<InfoRow value={seats * segments}>
				<i className="fas fa-chair"></i> Łączna liczba miejsc
			</InfoRow>
		</>
	);
};

BuyEmu.propTypes = {
	speed: PropTypes.number,
	setObject: PropTypes.func
};

export default BuyTrain;
