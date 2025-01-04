import { observer } from "mobx-react-lite";
import { ElevatedLinkButton } from "../../common/ElevatedButton/ElevatedButton";

// hooks
import { useGameStore } from "../../../store/GameStoreProvider";

// components
import IconButton, { IconLinkButton } from "../../common/IconButton/IconButton";

// style
import style from "./RoutesMenu.component.scss";
import tileStyle from "./RouteTile.component.scss";

const RoutesMenu = observer(() => {
	const { routeStore } = useGameStore();

	return (
		<div className="routes-menu" data-style={style}>
			<h2>Trasy</h2>
			<div>
				{routeStore.routes.length > 0 && (
					<ul className="routes-list">
						{routeStore.routes.map(route => (
							<RouteTile route={route} key={route.id}>
								<IconLinkButton to={"/game/routes/details/" + route.id} inverted>
									<i className="fas fa-pencil"></i>
								</IconLinkButton>
								<IconButton onClick={() => {}} inverted>
									<i className="fas fa-trash"></i>
								</IconButton>
							</RouteTile>
						))}
					</ul>
				)}
				{routeStore.routes.length === 0 && <div className="no-routes">Brak tras</div>}
				<ElevatedLinkButton to="create">
					<i className="fas fa-plus"></i> Stwórz trasę
				</ElevatedLinkButton>
			</div>
		</div>
	);
});

const RouteTile = observer(({ route, children }) => {
	return (
		<li data-style={tileStyle} className="route-tile">
			<p className="name" style={{ color: route.color }}>
				{route.name}
			</p>
			<p className="route">
				{route.stations[0]} - {route.stations.at(-1)}
			</p>
			<div className="stations">{route.stations.length} przystanków</div>
			<div className="buttons">{children}</div>
		</li>
	);
});

export { RouteTile };
export default RoutesMenu;
