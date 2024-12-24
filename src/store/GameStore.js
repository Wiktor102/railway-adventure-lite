import { makeAutoObservable } from "mobx";

// stores
import StationStore from "./StationStore";
import TrackStore from "./TrackStore";

import trackIcon from "../assets/icons/track.svg";
import TracksMenu from "../Ui/pages/TracksMenu";

class GameStore {
	stationStore;
	trackStore;
	pageState = {};

	static MENU_ROUTES = [
		{
			id: "tracks",
			icon: <img src={trackIcon} alt="" />,
			element: <TracksMenu />
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
		this.trackStore = new TrackStore(this);
	}
}

export default GameStore;
