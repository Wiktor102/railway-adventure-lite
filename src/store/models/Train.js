import { action, computed, makeAutoObservable, makeObservable, observable } from "mobx";
import Route from "./Route";
import Passenger from "./Passenger";

/**
 * @typedef {Object} TrainSerialized
 * @property {number} id
 * @property {number} maxSpeed
 * @property {number} price
 * @property {number|null} route
 * @property {number} direction
 * @property {Array<PassengerSerialized>} passengers
 *
 * @property {"carriage"|"unit"} type
 * @property {number|undefined} strength
 * @property {number|undefined} maxCarriages
 * @property {Object|undefined} carriages TODO: CarriageSerialized
 *
 * @property {number|undefined} segments
 * @property {number|undefined} seats
 */

class Train {
	static idCounter = 0;

	/** @type {import("../GameStore").default}*/
	gameStore;

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

	/** @type {number} 1 = normal; -1 = reversed*/
	direction = 1;

	/** @type {import("./Passenger").default[]}*/
	passengers = [];

	/** @type {{ name: string, arrived: number, edge: boolean }|null}*/
	currentStop = null;

	/** @type {number}*/
	get speed() {
		return this.maxSpeed;
	}

	constructor(data, type, gameStore) {
		makeObservable(this, {
			id: observable,
			type: observable,
			maxSpeed: observable,
			speed: computed,
			price: observable,
			route: observable,
			direction: observable,
			passengers: observable,
			currentStop: observable,
			assignRoute: action,
			onRouteStart: action,
			onRouteEnd: action,
			onStopReached: action,
			onStopDeparting: action,
			embarkPassengers: action,
			disembarkPassengers: action
		});

		this.gameStore = gameStore;
		this.type = type;
		this.maxSpeed = data.speed;
		this.price = data.cost;

		// load or defaults
		this.id = data.id ? data.id : Train.idCounter++;
		this.direction = data.direction || 1;

		if (data.id) {
			Train.idCounter = Math.max(Train.idCounter, data.id + 1);
		}

		if (data.passengers) {
			data.passengers.forEach(p => {
				if (!(p instanceof Passenger)) throw new Error("Received invalid passenger data!");
			});
			this.passengers = data.passengers;
		}

		if (data.route instanceof Route) {
			this.route = data.route;
		}
	}

	/**
	 * @param {import("./Route").default|null} route
	 * @returns {void}
	 * */
	assignRoute(route) {
		this.route = route;
	}

	// ------------------------------
	// ------------------------------
	// Route events handlers
	// ------------------------------

	onRouteStart = () => {
		const stationStore = this.gameStore.stationStore;
		const startStation = stationStore.getStationByName(this.route.stations[0]);
		startStation.processPassengers(this);
		this.currentStop = null;
	};

	onRouteEnd() {
		const stationStore = this.gameStore.stationStore;
		const endStation = stationStore.getStationByName(this.route.stations.at(this.direction == 1 ? -1 : 0));
		this.disembarkPassengers(endStation);
		this.currentStop = { name: endStation.name, arrived: Date.now(), edge: true };
		this.direction = -this.direction;
	}

	onStopReached = ({ name }) => {
		const stationStore = this.gameStore.stationStore;
		const station = stationStore.getStationByName(name);
		this.disembarkPassengers(station);
		this.currentStop = { name, arrived: Date.now(), edge: false };
	};

	onStopDeparting = ({ name }) => {
		const stationStore = this.gameStore.stationStore;
		const station = stationStore.getStationByName(name);
		station.processPassengers(this);
		this.currentStop = null;
	};

	// ------------------------------
	// ------------------------------
	// Passenger related methods
	// ------------------------------

	/**
	 * @param {import("./Passenger").default[]} passengers
	 * @returns {import("./Passenger").default[]} remaining passengers
	 * */
	embarkPassengers(passengers) {
		const availableSeats = this.seats - this.passengers.length;
		const fittingPassengers = passengers.slice(0, availableSeats);
		const remainingPassengers = passengers.slice(availableSeats);
		this.passengers.push(...fittingPassengers);

		fittingPassengers.forEach(p => p.pay(this.route));

		return remainingPassengers;
	}

	/**
	 * @param {import("./Station").default} station
	 * @returns {void}
	 * */
	disembarkPassengers(station) {
		const [, remaining] = this.passengers.reduce(
			(acc, p) => {
				if (p.destinationName === station.name) {
					acc[0].push(p);
				} else {
					acc[1].push(p);
				}

				return acc;
			},
			[[], []]
		);

		this.passengers = remaining;

		//* We assume these passengers are already at their destination
		// station.addPassengers(disembarked);
	}

	// ------------------------------
	// ------------------------------
	// Serialization
	// ------------------------------

	/**
	 * @returns {TrainSerialized}
	 */
	toJSON() {
		return {
			id: this.id,
			type: this.type,
			speed: this.maxSpeed,
			price: this.price,
			route: this.route?.id,
			direction: this.direction,
			passengers: this.passengers.map(p => p.toJSON())
		};
	}

	/**
	 * @param {TrainSerialized} data
	 * @param {import("../GameStore").default} gameStore
	 * @returns {Train}
	 * */
	static fromJSON(data, gameStore) {
		const route = gameStore.routeStore.getRouteById(data.route);
		const passengers = data.passengers.map(p => Passenger.fromJSON(p, gameStore));
		data = { ...data, route, passengers };

		if (data.type === "carriage") {
			return new CarriageTrain(data, gameStore);
		} else {
			return new UnitTrain(data, gameStore);
		}
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

	constructor(data, gameStore) {
		super(data, "carriage", gameStore);

		makeObservable(this, {
			strength: observable,
			maxCarriages: observable,
			carriages: observable,
			seats: computed
		});

		this.strength = data.strength;
		this.maxCarriages = data.maxCarriages;
	}

	/**
	 * @returns {TrainSerialized}
	 */
	toJSON() {
		return {
			...super.toJSON(),
			trainType: "carriage",
			strength: this.strength,
			maxCarriages: this.maxCarriages,
			carriages: this.carriages.map(c => ({
				speed: c.speed,
				seats: c.seats,
				price: c.price
			}))
		};
	}
}

class UnitTrain extends Train {
	/** @type {number} */
	segments;

	/** @type {number} */
	seats;

	constructor(data, gameStore) {
		super(data, "unit", gameStore);

		makeObservable(this, {
			segments: observable,
			seats: observable
		});

		this.segments = data.segments;
		this.seats = data.seats;
	}

	/**
	 * @returns {TrainSerialized}
	 */
	toJSON() {
		return {
			...super.toJSON(),
			trainType: "unit",
			segments: this.segments,
			seats: this.seats
		};
	}
}

export { CarriageTrain, UnitTrain };
export default Train;
