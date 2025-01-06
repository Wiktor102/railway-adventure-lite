import { autorun, makeAutoObservable, runInAction } from "mobx";
import { latLng } from "leaflet";

// stores
import StationStore from "./StationStore";
import TrackStore from "./TrackStore";
import RouteStore from "./RouteStore";
import TrainStore from "./TrainStore";

class GameStore {
	stationStore;
	trackStore;
	routeStore;
	trainStore;

	/**@type {number} */
	gameSpeed = 1;

	/**@type {number} */
	money = 30_000;

	/**@type {string|null} */
	error = null;
	_errorTimeout = null;

	_passengerSpawnInterval = { id: null, time: 0 };

	constructor() {
		makeAutoObservable(this, { _passengerSpawnInterval: false });
		this.stationStore = new StationStore(this);
		this.trackStore = new TrackStore(this);
		this.routeStore = new RouteStore(this);
		this.trainStore = new TrainStore(this);

		autorun(() => {
			if (this._passengerSpawnInterval.id) clearInterval(this._passengerSpawnInterval.id);
			// if (this._passengerSpawnInterval.time > 0) {
			// 	const elapsed = Date.now() - this._passengerSpawnInterval.time;
			// 	var remaining = (5000 - elapsed) / this.gameSpeed;
			// }

			const stationsToGenerateAt = [...this.stationStore.connectedStations.values()];
			const closeToConnected = stationsToGenerateAt.flatMap(station => {
				const loc = latLng(station.coordinates);
				return this.stationStore.stations.filter(other => {
					if (station.name === other.name || this.stationStore.connectedStations.has(other.name)) return false;
					const distance = loc.distanceTo(latLng(other.coordinates));
					return distance <= 6_500;
				});
			});
			stationsToGenerateAt.push(...closeToConnected);

			this._passengerSpawnInterval.id = setInterval(() => {
				// this._passengerSpawnInterval.time = Date.now();
				console.log("Passenger spawn");

				stationsToGenerateAt.forEach(station => {
					const maxNumber = 10 * station.size;
					const number = Math.floor(Math.random() * (maxNumber + 1));
					// console.log(`Spawning ${number} passengers at ${station.name}`);

					for (let i = 0; i < number; i++) {
						station.addPassenger();
					}
				});
			}, 5000);
		});
	}

	/**
	 * @param {number} amount
	 * @returns {void}
	 */
	setGameSpeed = speed => {
		this.gameSpeed = speed;
	};

	/**
	 * @param {number} amount
	 * @returns {void}
	 */
	addMoney = amount => {
		this.money += amount;
	};

	/**
	 * @param {number} amount
	 * @returns {boolean} success
	 */
	subtractMoney = amount => {
		if (this.money < amount) {
			this.showError("Brak funduszy!");
			return false;
		}

		this.money -= amount;
		return true;
	};

	showError = (message, time = 3) => {
		this.error = message;
		clearTimeout(this._errorTimeout);
		this._errorTimeout = setTimeout(() => {
			runInAction(() => {
				this.error = null;
			});
		}, time * 1000);
	};
}

export default GameStore;
