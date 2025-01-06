import { observer } from "mobx-react-lite";
import { Link, useParams } from "react-router";

// assets
import singleTrackIcon from "../../assets/icons/single-track-slim.svg";
import moneyImg from "../../assets/icons/money.png";

// styles
import style from "./TracksMenu.component.scss";
import Track from "../../store/models/Track";

const TracksMenu = observer(() => {
	const { "*": splat } = useParams();
	// const trackWidth = +splat.split("/")[1];
	const trackWidth = +splat;

	function getLinkPath(newTrackWidth) {
		if (trackWidth === newTrackWidth) {
			return "/game/tracks";
		}

		return `/game/tracks/build/${newTrackWidth}`;
	}

	return (
		<div className="tracks-menu" data-style={style}>
			<h2>Buduj tory</h2>
			<ul>
				<li className={trackWidth === 1 ? "active" : ""}>
					<Link to={getLinkPath(1)}>
						<div className="img-container">
							<img src={singleTrackIcon} alt="Ikona pojedyńczego toru" />
						</div>
						<div className="label">Pojedyńczy tor</div>
						<div className="cost">
							<img src={moneyImg} alt="Ikona zielonych pieniędzy" /> {Track.prices[1]} / km
						</div>
					</Link>
				</li>
				<li className={trackWidth === 2 ? "active" : ""}>
					<Link to={getLinkPath(2)}>
						<div className="img-container">
							<img src={singleTrackIcon} alt="Ikona pojedyńczego toru" />
							<img src={singleTrackIcon} alt="Ikona pojedyńczego toru" />
						</div>
						<div className="label">Podwójny tor</div>
						<div className="cost">
							<img src={moneyImg} alt="Ikona zielonych pieniędzy" /> {Track.prices[2]} / km
						</div>
					</Link>
				</li>
				<li className={trackWidth === 3 ? "active" : ""}>
					<Link to={getLinkPath(3)}>
						<div className="img-container">
							<img src={singleTrackIcon} alt="Ikona pojedyńczego toru" />
							<img src={singleTrackIcon} alt="Ikona pojedyńczego toru" />
							<img src={singleTrackIcon} alt="Ikona pojedyńczego toru" />
						</div>
						<div className="label">Potrójny tor</div>
						<div className="cost">
							<img src={moneyImg} alt="Ikona zielonych pieniędzy" /> {Track.prices[3]} / km
						</div>
					</Link>
				</li>
			</ul>
		</div>
	);
});

export default TracksMenu;
