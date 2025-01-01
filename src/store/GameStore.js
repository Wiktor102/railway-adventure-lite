import { makeAutoObservable } from "mobx";

// stores
import StationStore from "./StationStore";
import TrackStore from "./TrackStore";
import RouteStore from "./RouteStore";

class GameStore {
	stationStore;
	trackStore;
	routeStore;

	/**@type {string|null} */
	error = null;
	_errorTimeout = null;

	constructor() {
		makeAutoObservable(this);
		this.stationStore = new StationStore(this);
		this.trackStore = new TrackStore(this);
		this.routeStore = new RouteStore(this);
	}

	showError = (message, time = 3) => {
		console.log("GameStore.showError", message);
		this.error = message;
		clearTimeout(this._errorTimeout);
		this._errorTimeout = setTimeout(() => {
			this.error = null;
		}, time * 1000);
	};
}

export default GameStore;
