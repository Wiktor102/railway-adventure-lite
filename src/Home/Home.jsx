import { NavLink } from "react-router";

import styles from "./Home.component.scss";

function HomePage(props) {
	return (
		<div className="home" data-style={styles}>
			<h1>Railway Adventure</h1>
			<h2>Lite</h2>
			<NavLink to="/game">Start game</NavLink>
		</div>
	);
}

export default HomePage;
