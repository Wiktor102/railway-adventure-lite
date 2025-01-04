import { computed, makeAutoObservable, makeObservable, observable } from "mobx";

const trainProps = {
	id: observable,
	type: observable,
	maxSpeed: observable,
	speed: computed,
	price: observable,
	route: observable
};

class Train {
	static idCounter = 0;

	/** @type {number} */
	id;

	/** @type {"carriage"|"unit"} */
	type;

	/** @type {number}*/
	maxSpeed;

	/** @type {number}*/
	price;

	/** @type {import("./Route").default}*/
	route = null;

	/** @type {number}*/
	get speed() {
		return this.maxSpeed;
	}

	constructor(data, type) {
		this.type = type;

		this.maxSpeed = data.speed;
		this.price = data.cost;
		this.id = Train.idCounter++;
	}
}

// eslint-disable-next-line no-unused-vars
class Carriage {
	/** @type {number}*/
	seats;

	/** @type {number}*/
	speed;

	/** @type {number}*/
	price;

	constructor(data) {
		makeAutoObservable(this);
		this.speed = data.speed;
		this.seats = data.seats;
		this.price = data.cost;
	}
}

class CarriageTrain extends Train {
	/** @type {number} */
	strength;

	/** @type {number} */
	maxCarriages;

	/** @type {Carriage[]} */
	carriages = [];

	get speed() {
		return Math.min(this.maxSpeed, ...this.carriages.map(c => c.speed));
	}

	get seats() {
		return this.carriages.reduce((acc, c) => acc + c.seats, 0);
	}

	constructor(data) {
		super(data, "carriage");

		makeObservable(this, {
			...trainProps,
			strength: observable,
			maxCarriages: observable,
			carriages: observable,
			seats: computed
		});

		this.strength = data.strength;
		this.maxCarriages = data.maxCarriages;
	}
}

class UnitTrain extends Train {
	/** @type {number} */
	segments;

	/** @type {number} */
	seats;

	constructor(data) {
		super(data, "unit");

		makeObservable(this, {
			...trainProps,
			segments: observable,
			seats: observable
		});

		this.segments = data.segments;
		this.seats = data.seats;
	}
}

export { CarriageTrain, UnitTrain };
export default Train;
