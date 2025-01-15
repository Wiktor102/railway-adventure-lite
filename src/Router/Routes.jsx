import trackIcon from "../assets/icons/single-track-slim.svg";

const routes = [
	{
		id: "tracks",
		icon: <img src={trackIcon} alt="" />
	},
	{
		id: "routes",
		icon: <i className="fa-solid fa-route"></i>
	},
	{
		id: "trains",
		icon: <i className="fa-solid fa-train"></i>
	},
	{
		id: "passengers",
		icon: <i className="fa-solid fa-users"></i>
	}
];

export default routes;
