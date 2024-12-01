import { makeAutoObservable } from "mobx";
import StationStore from "./StationStore";

class GameStore {
	stationStore;

	constructor() {
		makeAutoObservable(this);
		this.stationStore = new StationStore(this);
	}
}

export default GameStore;
