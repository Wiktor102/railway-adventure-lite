import { makeAutoObservable } from "mobx";
import Train from "./models/Train";

/**
 * @typedef {Object} TrainStoreSerialized
 * @property {import("./models/Train").TrainSerialized[]} trains
 */

class TrainStore {
	/** @type {import("./GameStore").default} */
	gameStore;

	/** @type {import("./models/Train").default[]} */
	trains = [];

	constructor(gameStore, trains = []) {
		makeAutoObservable(this, { gameStore: false });
		this.gameStore = gameStore;

		trains.forEach(train => {
			if (!(train instanceof Train)) throw new Error("Invalid train data");
		});

		this.trains = trains;
	}

	/**
	 * @param {import("./models/Train").default} train
	 * @returns {void}
	 */
	addTrain = train => {
		this.trains.push(train);
	};

	/**
	 * @param {number} id
	 * @returns {import("./models/Train").default|undefined}
	 */
	getTrainById = id => {
		return this.trains.find(train => train.id === id);
	};

	/**
	 * @returns {TrainStoreSerialized}
	 */
	toJSON() {
		return {
			trains: this.trains.map(train => train.toJSON())
		};
	}

	/**
	 * @param {TrainStoreSerialized} data
	 * @param {import("./GameStore").default} gameStore
	 * @returns {TrainStore}
	 */
	static fromJSON(data, gameStore) {
		const trains = data.trains.map(trainData => Train.fromJSON(trainData, gameStore));
		return new TrainStore(gameStore, trains);
	}
}

export default TrainStore;
