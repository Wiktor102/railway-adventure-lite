import { makeAutoObservable, runInAction } from "mobx";
import stationsData from "../assets/data/stations.json";
import { latLng } from "leaflet";

// models
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

	/**
	 * Stations that have a connected track or are close to a such station
	 * @returns {Station[]}
	 */
	get activeStations() {
		const stationsToGenerateAt = [...this.connectedStations.values()];
		const closeToConnected = stationsToGenerateAt.flatMap(station => {
			const loc = latLng(station.coordinates);
			return this.stations.filter(other => {
				if (station.name === other.name || this.connectedStations.has(other.name)) return false;
				const distance = loc.distanceTo(latLng(other.coordinates));
				return distance <= 6_500;
			});
		});

		return [...stationsToGenerateAt, ...closeToConnected];
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

	generatePassengers = () => {
		console.log("Passenger spawn");
		const sizeMap = [0, 100, 500, 1000, 3000, 5000];

		this.activeStations.forEach(station => {
			if (station.waitingPassengers.length > sizeMap[station.size]) return true;
			const maxNumber = sizeMap[station.size] / 100;
			const number = Math.floor(Math.random() * (maxNumber + 1));
			// console.log(`Spawning ${number} passengers at ${station.name}`);

			for (let i = 0; i < number; i++) {
				station.addPassenger();
			}
		});
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
