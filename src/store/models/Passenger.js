import { makeAutoObservable } from "mobx";

class Passenger {
	/**@type {number} */
	id;

	/**@type {string} */
	originName;

	/**@type {string} */
	destinationName;

	static idCounter = 0;

	constructor(origin, destination) {
		makeAutoObservable(this);

		this.id = Passenger.idCounter++;
		this.originName = origin;
		this.destinationName = destination;
	}
}

export default Passenger;
