import { observer } from "mobx-react-lite";
import { useGameStore } from "../../../store/GameStoreProvider";
import ElevatedButton from "../../common/ElevatedButton/ElevatedButton";
import style from "./NewRoute.component.scss";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";

const NewRoute = observer(() => {
	const { routeStore } = useGameStore();
	const navigate = useNavigate();

	useEffect(() => {
		if (!routeStore.currentRoute) routeStore.initCurrentRoute();
	}, []);

	function accept() {
		const success = routeStore.acceptCurrentRoute();
		if (!success) {
			alert("Trasa musi zawierać przynajmniej 2 przystanki");
		} else {
			navigate("/game/routes");
		}
	}

	if (!routeStore.currentRoute) return;
	return (
		<>
			<Link to="/game/routes" className="back-button" style={{ float: "left" }}>
				<i className="fas fa-arrow-left"></i>
			</Link>
			<div className="create-route-menu" data-style={style}>
				<h2>Stwórz trasę</h2>
				<div>
					<form>
						<input
							type="text"
							name="name"
							value={routeStore.currentRoute.name}
							onChange={({ target: t }) => routeStore.updateCurrentRouteProperty(t.name, t.value)}
						/>
						<div className="color-input-wrapper">
							<input
								type="color"
								name="color"
								value={routeStore.currentRoute.color}
								onChange={({ target: t }) => routeStore.updateCurrentRouteProperty(t.name, t.value)}
							/>
						</div>
					</form>
					<div className="stops-list-wrapper">
						<h3>Przystanki</h3>
						<ul className="stops-list">
							{routeStore.currentRoute.stations.map(station => (
								<li key={station.name}>
									<div className="decoration"></div>
									<p>{station.name}</p>
								</li>
							))}
						</ul>
					</div>
					<ElevatedButton onClick={accept} disabled={routeStore.currentRoute.stations.length < 2}>
						<i className="fas fa-check"></i> Stwórz trasę
					</ElevatedButton>
				</div>
			</div>
		</>
	);
});

export default NewRoute;
