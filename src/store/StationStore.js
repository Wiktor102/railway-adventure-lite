import { makeAutoObservable } from "mobx";
import stationsData from "../assets/data/stations.json";
import Station from "./models/Station";

class StationStore {
	gameStore;
	stations = [];
	snappedStation = { station: null, distance: null };

	constructor(gameStore) {
		makeAutoObservable(this, { gameStore: false });

		this.gameStore = gameStore;
		this.stations = stationsData.features.reduce((arr, station) => {
			if (station.properties.NAZWA_POS.includes("Gr")) return arr;
			return [...arr, new Station(station)];
		}, []);
	}

	getStationByName(name) {
		return this.stations.find(station => station.name === name);
	}

	setSnappedStation = station => {
		this.snappedStation = station;
	};
}

export default StationStore;
