import { makeAutoObservable, runInAction } from "mobx";

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

	constructor() {
		makeAutoObservable(this);
		this.stationStore = new StationStore(this);
		this.trackStore = new TrackStore(this);
		this.routeStore = new RouteStore(this);
		this.trainStore = new TrainStore(this);
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
