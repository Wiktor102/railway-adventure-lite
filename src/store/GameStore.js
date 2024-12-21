import { makeAutoObservable } from "mobx";

// stores
import StationStore from "./StationStore";
import TrackStore from "./TrackStore";

import trackIcon from "../assets/icons/track.svg";
import TracksMenu from "../Game/pages/TracksMenu";

class GameStore {
	stationStore;
	trackStore;
	view = GameStore.GAME_VIEWS.DEFAULT;
	mode = GameStore.GAME_MODES[GameStore.GAME_VIEWS.DEFAULT].DEFAULT;
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

	static GAME_VIEWS = {
		DEFAULT: Symbol("default"),
		TRACKS: Symbol("tracks")
	};

	static GAME_MODES = {
		[this.GAME_VIEWS.DEFAULT]: {
			DEFAULT: Symbol("default")
		},
		[this.GAME_VIEWS.TRACKS]: {
			DEFAULT: Symbol("default"),
			DRAW: Symbol("draw"),
			EDIT: Symbol("edit")
		}
	};

	constructor() {
		makeAutoObservable(this);
		this.stationStore = new StationStore(this);
		this.trackStore = new TrackStore(this);
	}

	setView(view) {
		this.view = view;
		this.pageState = {};
		this.setMode(GameStore.GAME_MODES[view].DEFAULT);
	}

	setMode(mode) {
		this.mode = mode;
	}
}

export default GameStore;
