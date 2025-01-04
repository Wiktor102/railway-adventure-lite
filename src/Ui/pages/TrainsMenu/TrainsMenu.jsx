import { observer } from "mobx-react-lite";

// hooks
import { useGameStore } from "../../../store/GameStoreProvider";

// components
import { ElevatedLinkButton } from "../../common/ElevatedButton/ElevatedButton";
import IconButton, { IconLinkButton } from "../../common/IconButton/IconButton";

// assets
import routeAddIcon from "../../../assets/icons/route-add.svg";
import routeRemoveIcon from "../../../assets/icons/route-remove.svg";

// styles
import style from "./TrainsMenu.component.scss";

const TrainsMenu = observer(() => {
	const { trainStore } = useGameStore();

	return (
		<>
			<h2>Tabor</h2>
			<div className="trains-menu" data-style={style}>
				{trainStore.trains.length > 0 && (
					<ul>
						{trainStore.trains.map(train => (
							<li key={train.id}>
								<img
									src="https://static.vecteezy.com/system/resources/previews/019/002/964/non_2x/electric-train-flat-icons-png.png"
									alt=""
								/>
								{!train.route && (
									<IconLinkButton className="add-route-btn" to={`/game/trains/${train.id}`} inverted>
										<img src={routeAddIcon} alt="Trasa z plusikiem" />
									</IconLinkButton>
								)}
								{train.route && (
									<IconButton className="remove-route-btn" inverted>
										<img src={routeRemoveIcon} alt="Przekreślona trasa" />
									</IconButton>
								)}
								{train.type === "carriage" && (
									<IconLinkButton className="carriage-config-btn" to={`/game/trains/${train.id}`} inverted>
										<i className="fas fa-cog"></i>
									</IconLinkButton>
								)}
								<IconLinkButton to={`/game/trains/${train.id}`} inverted>
									<i className="fas fa-hand-holding-dollar"></i>
								</IconLinkButton>
								<div className="data">
									<p className="speed">
										<span>
											<i className="fas fa-gauge"></i> Prędkość maksymalna{" "}
										</span>
										<b>{train.speed} km/h</b>
									</p>
									{train.type === "carriage" && (
										<p className="seats">
											<span>
												<i className="fas fa-weight-hanging"></i> Liczba wagonów{" "}
											</span>
											<b>
												{train.carriages.length} / {train.maxCarriages}
											</b>
										</p>
									)}
									<p className="seats">
										<span>
											<i className="fas fa-chair"></i> Miejsca siedzące{" "}
										</span>
										<b>{train.seats}</b>
									</p>
									<p className="route">
										<span>
											<i className="fas fa-route"></i> Trasa{" "}
										</span>
										<b>
											{train.route
												? train.route.stations[0] + " - " + train.route.stations.at(-1)
												: "Brak"}
										</b>
									</p>
								</div>
							</li>
						))}
					</ul>
				)}
				{trainStore.trains.length === 0 && (
					<div className="no-trains">
						<p>Nie masz jeszcze żadnych pociągów</p>
					</div>
				)}
				<ElevatedLinkButton to="buy/locomotive">
					<i className="fas fa-cart-shopping"></i> Kup pociąg
				</ElevatedLinkButton>
			</div>
		</>
	);
});

export default TrainsMenu;
