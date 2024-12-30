import { observer } from "mobx-react-lite";
import { ElevatedLinkButton } from "../../common/ElevatedButton/ElevatedButton";

// hooks
import { useGameStore } from "../../../store/GameStoreProvider";

// components
import IconButton, { IconLinkButton } from "../../common/IconButton/IconButton";

// style
import style from "./RoutesMenu.component.scss";

const RoutesMenu = observer(() => {
	const { routeStore } = useGameStore();

	return (
		<div className="routes-menu" data-style={style}>
			<h2>Trasy</h2>
			<ul className="routes-list">
				{routeStore.routes.map(route => (
					<li key={route.id}>
						<p className="name" style={{ color: route.color }}>
							{route.name}
						</p>
						<p className="route">
							{route.stations[0].name} - {route.stations.at(-1).name}
						</p>
						<div className="stations">{route.stations.length} przystanków</div>
						<div className="buttons">
							<IconLinkButton to={"/game/routes/details/" + route.id}>
								<i className="fas fa-pencil"></i>
							</IconLinkButton>
							<IconButton onClick={() => {}}>
								<i className="fas fa-trash"></i>
							</IconButton>
						</div>
					</li>
				))}
			</ul>
			<div>
				<ElevatedLinkButton to="create">
					<i className="fas fa-plus"></i> Stwórz trasę
				</ElevatedLinkButton>
			</div>
		</div>
	);
});

export default RoutesMenu;
