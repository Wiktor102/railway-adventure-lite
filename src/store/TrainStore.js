import { makeAutoObservable } from "mobx";
import { CarriageTrain, UnitTrain } from "./models/Train";

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

	toJSON() {
		return {
			trains: this.trains.map(train => train.toJSON())
		};
	}

	fromJSON(data) {
		this.trains = data.trains
			.map(trainData => {
				let train;
				if (trainData.trainType === "carriage") {
					train = new CarriageTrain(
						{
							speed: trainData.maxSpeed,
							cost: trainData.price,
							strength: trainData.strength,
							maxCarriages: trainData.maxCarriages
						},
						this.gameStore
					);
				} else if (trainData.trainType === "unit") {
					train = new UnitTrain(
						{
							speed: trainData.maxSpeed,
							cost: trainData.price,
							segments: trainData.segments,
							seats: trainData.seats
						},
						this.gameStore
					);
				}

				if (train) {
					train.fromJSON(trainData);
				}
				return train;
			})
			.filter(Boolean);
	}
}

export default TrainStore;
