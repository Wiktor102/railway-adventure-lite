import { observer } from "mobx-react-lite";
import { Link, useParams } from "react-router";

// assets
import trackIcon from "../../assets/icons/track.svg";

// styles
import style from "./TracksMenu.component.scss";

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
						<img src={trackIcon} alt="Ikona pojedyńczego toru" />
						<div className="label">Pojedyńczy tor</div>
					</Link>
				</li>
				<li className={trackWidth === 2 ? "active" : ""}>
					<Link to={getLinkPath(2)}>
						<img src={trackIcon} alt="Ikona podwójnego toru" />
						<div className="label">Podwójny tor</div>
					</Link>
				</li>
				<li className={trackWidth === 3 ? "active" : ""}>
					<Link to={getLinkPath(3)}>
						<img src={trackIcon} alt="Ikona potrójnego toru" />
						<div className="label">Potrójny tor</div>
					</Link>
				</li>
			</ul>
		</div>
	);
});

export default TracksMenu;
