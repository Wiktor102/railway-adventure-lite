import { makeAutoObservable } from "mobx";

// stores
import StationStore from "./StationStore";
import TrackStore from "./TrackStore";

class GameStore {
	stationStore;
	trackStore;
	pageState = {};

	constructor() {
		makeAutoObservable(this);
		this.stationStore = new StationStore(this);
		this.trackStore = new TrackStore(this);
	}
}

export default GameStore;
