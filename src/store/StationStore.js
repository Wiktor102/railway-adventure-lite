import { makeAutoObservable, runInAction } from "mobx";
import stationsData from "../assets/data/stations.json";
import Station from "./models/Station";

/**
 * @typedef {Object} StationStoreSerialized
 * @property {Array<StationSerialized>} stations
 */

class StationStore {
	/** @type {GameStore} */
	gameStore;

	/** @type {Map<String,Station>} */
	stationsMap = new Map();

	snappedStation = { station: null, distance: null };
	enableSnapping = false;

	/** @type {string|null} */
	showedPopup = null;

	get stations() {
		return [...this.stationsMap.values()];
	}

	get connectedStations() {
		return this.stations
			.filter(station => station.neighbors.size > 0)
			.reduce((map, station) => {
				map.set(station.name, station);
				return map;
			}, new Map());
	}

	get connectedStationsBySize() {
		return this.stations
			.filter(station => station.neighbors.size > 0)
			.reduce((map, station) => {
				if (!map.has(station.size)) map.set(station.size, []);
				map.get(station.size).push(station);
				return map;
			}, new Map());
	}

	constructor(gameStore) {
		makeAutoObservable(this, { gameStore: false });

		this.gameStore = gameStore;
		this.stationsMap = stationsData.features.reduce((map, station) => {
			if (station.properties.NAZWA_POS.includes("Gr")) return map;
			const s = new Station(station, gameStore);
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

	setShowedPopup = station => {
		this.showedPopup = station;
	};

	/**
	 * @returns {StationStoreSerialized}
	 * */
	toJSON() {
		return {
			stations: this.stations.filter(station => station.waitingPassengers.length > 0).map(station => station.toJSON())
		};
	}

	/**
	 * @param {StationStoreSerialized} data
	 * @param {GameStore} gameStore
	 * @returns {StationStore}
	 */
	static fromJSON(data, gameStore) {
		const store = new StationStore(gameStore);

		runInAction(() => {
			data.stations.forEach(stationData => {
				const deserialized = Station.fromJSON(stationData, gameStore);
				const original = store.stationsMap.get(deserialized.name);
				original.waitingPassengers = deserialized.passengers;
			});
		});

		return store;
	}
}

export default StationStore;
