import { makeAutoObservable } from "mobx";

// stores
import StationStore from "./StationStore";
import TrackStore from "./TrackStore";
import RouteStore from "./RouteStore";

class GameStore {
	stationStore;
	trackStore;
	routeStore;

	constructor() {
		makeAutoObservable(this);
		this.stationStore = new StationStore(this);
		this.trackStore = new TrackStore(this);
		this.routeStore = new RouteStore(this);
	}
}

export default GameStore;
