import { useMemo } from "react";
import { NavLink } from "react-router";

// services
import PersistenceService from "../services/PersistenceService";

import background from "../assets/icons/background-bigger.jpeg";

import styles from "./Home.component.scss";

function HomePage() {
	const hasSave = useMemo(() => PersistenceService.loadFromLocalStorage() != null, []);

	return (
		<div className="home" data-style={styles}>
			<img src={background} alt="" className="background" />
			<div className="left-panel">
				<h1>Railway Adventure</h1>
				<h2>Lite</h2>
				<NavLink to="/game?load=new">
					<i className="fas fa-plus"></i> Nowa gra
				</NavLink>
				<NavLink
					to={hasSave ? "/game?load=browser" : ""}
					className={hasSave ? "" : "disabled"}
					aria-disabled={!hasSave}
				>
					<i className="fas fa-rotate"></i> Kontynuuj grę
				</NavLink>
				<NavLink to="/game?load=file">
					<i className="fas fa-file-import"></i> Wczytaj zapis
				</NavLink>
			</div>
		</div>
	);
}

export default HomePage;
