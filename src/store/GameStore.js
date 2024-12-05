import { makeAutoObservable } from "mobx";
import StationStore from "./StationStore";

import trackIcon from "../assets/icons/track.svg";

class GameStore {
	stationStore;
	mode = "default";

	static MENU_ROUTES = [
		{
			id: "tracks",
			icon: <img src={trackIcon} alt="" />,
			element: <h1>Tracks</h1>
		},
		{
			id: "routes",
			icon: <i className="fa-solid fa-route"></i>,
			element: <h1>Routes</h1>
		},
		{
			id: "trains",
			icon: <i className="fa-solid fa-train"></i>,
			element: <h1>Trains</h1>
		}
	];

	constructor() {
		makeAutoObservable(this);
		this.stationStore = new StationStore(this);
	}
}

export default GameStore;
