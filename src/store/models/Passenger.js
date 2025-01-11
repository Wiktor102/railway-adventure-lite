import { makeAutoObservable } from "mobx";

/**
 * @typedef {Object} PassengerSerialized
 * @property {number} id
 * @property {string} originName
 * @property {string} destinationName
 */

class Passenger {
	/**@type {import("../GameStore").default} */
	gameStore;

	/**@type {number} */
	id;

	/**@type {string} */
	originName;

	/**@type {string} */
	destinationName;

	static idCounter = 0;

	constructor(origin, destination, gameStore) {
		makeAutoObservable(this, { gameStore: false });

		this.gameStore = gameStore;
		this.id = Passenger.idCounter++;
		this.originName = origin;
		this.destinationName = destination;
	}

	/**
	 * @param {import("./Route").default} route
	 * @returns {void}
	 */
	pay = route => {
		const stationIndex = route.stations.indexOf(this.originName);
		if (stationIndex === -1) return;

		const destinationIndex = route.stations.indexOf(this.destinationName);
		if (destinationIndex === -1) return;

		const segments = route.path.slice(
			Math.min(stationIndex, destinationIndex),
			Math.max(stationIndex, destinationIndex)
		);

		const distance = segments.reduce((acc, segment) => acc + segment.track.length, 0);
		const price = (distance * route.pricePerKm) / 1000; // Convert to km

		this.gameStore.addMoney(Math.round(price));
	};

	/**
	 * @returns {PassengerSerialized}
	 */
	toJSON() {
		return {
			id: this.id,
			originName: this.originName,
			destinationName: this.destinationName
		};
	}

	/**
	 * @param {PassengerSerialized} data
	 * @param {import("../GameStore").default} gameStore
	 * @returns {Passenger}
	 */
	static fromJSON(data, gameStore) {
		return new Passenger(data.originName, data.destinationName, gameStore);
	}
}

export default Passenger;
