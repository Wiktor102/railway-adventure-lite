import background from "../../assets/icons/background-bigger.jpeg";
import style from "./LoadingScreen.component.scss";

function LoadingScreen() {
	return (
		<div className="loading-screen" data-style={style}>
			<img src={background} alt="Tło z pociągiem jadącym podczas wschodu słońca" />
			<div className="spinner-container">
				<div className="ball-clip-rotate">
					<div></div>
				</div>
				<p>Trwa ładowanie</p>
			</div>
		</div>
	);
}

export default LoadingScreen;
