import RoutesMenu from "../Ui/pages/RoutesMenu/RoutesMenu";
import TrackDrawTips from "../Ui/pages/TrackDrawTips/TrackDrawTips";
import TracksMenu from "../Ui/pages/TracksMenu";
import trackIcon from "../assets/icons/single-track-slim.svg";

const routes = [
	{
		id: "tracks",
		icon: <img src={trackIcon} alt="" />,
		element: <TracksMenu />,
		tips: <TrackDrawTips />
	},
	{
		id: "routes",
		icon: <i className="fa-solid fa-route"></i>,
		element: <RoutesMenu />
	},
	{
		id: "trains",
		icon: <i className="fa-solid fa-train"></i>,
		element: <h2>Tabor</h2>
	},
	{
		id: "passengers",
		icon: <i className="fa-solid fa-users"></i>,
		element: <h2>Pasażerowie</h2>
	}
];

export default routes;
