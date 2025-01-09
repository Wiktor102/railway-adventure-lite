import { makeAutoObservable } from "mobx";

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

	toJSON() {
		return {
			id: this.id,
			originName: this.originName,
			destinationName: this.destinationName
		};
	}

	fromJSON(data) {
		this.id = data.id;
		this.originName = data.originName;
		this.destinationName = data.destinationName;
	}
}

export default Passenger;
