import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router";

// hooks
import { useGameStore } from "../../../store/GameStoreProvider";

// components
import ElevatedButton from "../../common/ElevatedButton/ElevatedButton";

// styles
import style from "./RouteDetails.component.scss";

const RouteDetails = observer(() => {
	const { routeStore, stationStore, showError } = useGameStore();
	const navigate = useNavigate();

	const { routeId } = useParams();
	const route = useMemo(() => {
		if (routeId == null) {
			if (!routeStore.currentRoute) routeStore.initCurrentRoute();
			return routeStore.currentRoute;
		}

		return routeStore.routes.find(r => r.id === +routeId);
	}, [routeId, routeStore.currentRoute]);

	// useEffect(() => () => routeStore.discardCurrentRoute(), [routeStore.discardCurrentRoute]);

	function toggleStop(stationName) {
		const hasStation = route.stations.includes(stationName);
		let error;
		if (hasStation) {
			error = route.removeStation(stationName);
		} else {
			error = route.addStation(stationName, stationStore.stationsMap);
		}

		error && showError(error);
	}

	function accept() {
		const success = routeStore.acceptCurrentRoute();
		if (!success) {
			alert("Trasa musi zawierać przynajmniej 2 przystanki");
		} else {
			navigate("/game/routes");
		}
	}

	if (!route) return null;
	return (
		<>
			<Link to="/game/routes" className="back-button" style={{ float: "left" }}>
				<i className="fas fa-arrow-left"></i>
			</Link>
			<div className="route-details-menu" data-style={style}>
				<h2>{routeId ? "Szczegóły trasy" : "Stwórz trasę"}</h2>
				<div>
					<form>
						<input type="text" value={route.name} onChange={({ target: t }) => route.setName(t.value)} />
						<div className="color-input-wrapper">
							<input type="color" value={route.color} onChange={({ target: t }) => route.setColor(t.value)} />
						</div>
					</form>
					<div className="stops-list-wrapper">
						<h3>Trasa</h3>
						{route.stations.length > 0 && (
							<>
								<div className="arrow-container">
									<div className="tip"></div>
									<div className="middle"></div>
									<div className="bottom"></div>
								</div>
								<ul className="stops-list">
									{route.path.map((segment, i) => {
										const isStop = route.stations.includes(segment.from);
										return (
											<li className={isStop ? "" : "shadow"} key={segment.from + segment.to}>
												<div className="decoration"></div>
												<p>{segment.from}</p>
												{i > 0 && (
													<button onClick={() => toggleStop(segment.from)}>
														<i className={`${isStop ? "fas" : "far"} fa-stop-circle`}></i>
														{isStop ? "\u00A0Usuń przystanek" : "Dodaj przystanek"}
													</button>
												)}

												{i === 0 && (
													<button onClick={() => toggleStop(segment.from)}>
														<i className="fas fa-trash"></i> Usuń
													</button>
												)}
											</li>
										);
									})}
									{route.stations.length > 0 && (
										<li>
											<div className="decoration"></div>
											<p>{route.stations.at(-1)}</p>
											<button onClick={() => toggleStop(route.stations.at(-1))}>
												<i className="fas fa-trash"></i> Usuń
											</button>
										</li>
									)}
								</ul>
							</>
						)}
						{route.stations.length === 0 && (
							<div className="empty">
								Kliknij na stację początkową, następnie wybierz przystaniki pośrednie
							</div>
						)}
					</div>
					<div className="info-wrapper">
						<h3>Informacje</h3>
						<p>Przystanki: {route.stations.length}</p>
						<p>Długość: {(route.distance / 1000).toFixed(1)} km</p>
					</div>
					{route.draft && (
						<ElevatedButton onClick={accept} disabled={route.stations.length < 2}>
							<i className="fas fa-check"></i> Stwórz trasę
						</ElevatedButton>
					)}
				</div>
			</div>
		</>
	);
});

export default RouteDetails;
