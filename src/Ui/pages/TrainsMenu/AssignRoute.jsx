import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";

// hooks
import { useGameStore } from "../../../store/GameStoreProvider";

// components
import { RouteTile } from "../RoutesMenu/RoutesMenu";
import IconButton from "../../common/IconButton/IconButton";
import ElevatedButton from "../../common/ElevatedButton/ElevatedButton";

// styles
import style from "./AssignRoute.component.scss";

const AssignRoute = observer(() => {
	const { routeStore, trainStore } = useGameStore();
	const [selectedRoute, setSelectedRoute] = useState(null);
	const { trainId } = useParams();
	const navigate = useNavigate();

	function assignRoute() {
		trainStore.getTrainById(+trainId).assignRoute(selectedRoute);
		navigate("/game/trains");
	}

	useEffect(() => {
		if (!trainStore.getTrainById(+trainId)) navigate("/game/trains");
	}, [navigate, trainId, trainStore]);

	useEffect(() => {
		routeStore.setHighlightedRoute(selectedRoute);
	}, [routeStore, selectedRoute]);

	useEffect(() => () => routeStore.setHighlightedRoute(null), [routeStore]);

	return (
		<>
			<Link to="/game/trains" className="back-button" style={{ float: "left" }}>
				<i className="fas fa-arrow-left"></i>
			</Link>
			<h2>Przypisz trasę</h2>
			<div className="assign-route-menu" data-style={style}>
				<Scrollbars>
					<ul>
						{routeStore.routes.map(route => (
							<RouteTile key={route.id} route={route}>
								<IconButton
									onClick={() => setSelectedRoute(route)}
									active={selectedRoute?.id === route.id}
									inverted
								>
									<i className="fas fa-check"></i>
								</IconButton>
							</RouteTile>
						))}
					</ul>
				</Scrollbars>
				<ElevatedButton onClick={assignRoute} disabled={!selectedRoute}>
					<i className="fas fa-check"></i> Przypisz trasę
				</ElevatedButton>
			</div>
		</>
	);
});

export default AssignRoute;
