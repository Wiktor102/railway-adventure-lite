import TrackDrawTips from "../Ui/pages/TrackDrawTips/TrackDrawTips";
import TracksMenu from "../Ui/pages/TracksMenu";
import trackIcon from "../assets/icons/track.svg";

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
		element: <h2>Trasy</h2>
	},
	{
		id: "trains",
		icon: <i className="fa-solid fa-train"></i>,
		element: <h2>Tabor</h2>
	}
];

export default routes;
