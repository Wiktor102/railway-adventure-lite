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
			element: <h2>Tory</h2>
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

	constructor() {
		makeAutoObservable(this);
		this.stationStore = new StationStore(this);
	}
}

export default GameStore;
