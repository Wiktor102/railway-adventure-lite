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
	const { routeStore } = useGameStore();
	const navigate = useNavigate();

	const { routeId } = useParams();
	const route = useMemo(() => {
		if (routeId == null) {
			if (!routeStore.currentRoute) routeStore.initCurrentRoute();
			return routeStore.currentRoute;
		}

		return routeStore.routes.find(r => r.id === +routeId);
	}, [routeId, routeStore.currentRoute]);

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
							<input type="color" value={route.color} onChange={({ target: t }) => route.setName(t.value)} />
						</div>
					</form>
					<div className="stops-list-wrapper">
						<h3>Przystanki</h3>
						<ul className="stops-list">
							{route.stations.map(station => (
								<li key={station.name}>
									<div className="decoration"></div>
									<p>{station.name}</p>
								</li>
							))}
						</ul>
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
