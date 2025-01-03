import { makeAutoObservable } from "mobx";
import stationsData from "../assets/data/stations.json";
import Station from "./models/Station";

class StationStore {
	/** @type {GameStore} */
	gameStore;

	/** @type {Map<String,Station>} */
	stationsMap = new Map();

	snappedStation = { station: null, distance: null };
	enableSnapping = false;

	get stations() {
		return [...this.stationsMap.values()];
	}

	constructor(gameStore) {
		makeAutoObservable(this, { gameStore: false });

		this.gameStore = gameStore;
		this.stationsMap = stationsData.features.reduce((map, station) => {
			if (station.properties.NAZWA_POS.includes("Gr")) return map;
			const s = new Station(station);
			map.set(s.name, s);
			return map;
		}, new Map());
	}

	getStationByName(name) {
		return this.stations.find(station => station.name === name);
	}

	toggleSnapping = state => {
		this.enableSnapping = state ?? !this.enableSnapping;
	};

	setSnappedStation = station => {
		this.snappedStation = station;
	};
}

export default StationStore;
