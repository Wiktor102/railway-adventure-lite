import { makeAutoObservable } from "mobx";

class TrainStore {
	/** @type {import("./GameStore").default} */
	gameStore;

	/** @type {import("./models/Train").default[]} */
	trains = [];

	constructor(gameStore) {
		makeAutoObservable(this, { gameStore: false });
		this.gameStore = gameStore;
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
}

export default TrainStore;
