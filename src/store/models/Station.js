import { makeAutoObservable } from "mobx";
import Passenger from "./Passenger";

class Station {
	/** @type {import("../GameStore").default} */
	gameStore;

	name;
	size;
	coordinates;

	/** @type {Map<String,import("./Track").default>} */
	neighbors = new Map();

	/** @type {Array<import("./Passenger").default>} */
	waitingPassengers = [];

	constructor({ geometry, properties }, gameStore) {
		makeAutoObservable(this, { coordinates: false, name: false, gameStore: false });

		this.gameStore = gameStore;
		this.name = properties.NAZWA_POS;
		this.size = properties.size;
		this.coordinates =
			geometry.coordinates[0] > geometry.coordinates[1] ? geometry.coordinates : geometry.coordinates.reverse();
	}

	/**
	 * @param {Station} station
	 * @param {Track} track
	 * @returns {void}
	 */
	addNeighbor(station, track) {
		this.neighbors.set(station.name, track);
	}

	/**
	 * @param {string} stationName
	 * @returns {void}
	 */
	deleteNeighbor(stationName) {
		this.neighbors.delete(stationName);
	}

	/**
	 * Generates a passenger and adds it as waiting at this station
	 * @returns {void}
	 */
	addPassenger = () => {
		function getDestinationSize() {
			const weight = [0, 10, 15, 25, 30, 20];
			const random = Math.random() * 100;
			let sum = 0;
			let size = 1;

			for (let i = 1; i <= 5; i++) {
				sum += weight[i];
				if (random <= sum) {
					size = i;
					break;
				}
			}

			return size;
		}

		let destinationSize = getDestinationSize();
		if (!this.gameStore.stationStore.connectedStationsBySize.has(destinationSize)) {
			destinationSize = 1;
			while (destinationSize < 6 && !this.gameStore.stationStore.connectedStationsBySize.has(destinationSize)) {
				destinationSize++;
			}

			if (destinationSize === 6) destinationSize = 1;
		}

		const availableDestinations = this.gameStore.stationStore.connectedStationsBySize
			.get(destinationSize)
			.filter(station => station.name !== this.name);
		if (availableDestinations.length === 0) return;

		const destinationIndex = Math.floor(Math.random() * availableDestinations.length);
		const destination = availableDestinations[destinationIndex];
		const passenger = new Passenger(this.name, destination.name, this.gameStore);
		this.waitingPassengers.push(passenger);
	};

	/**
	 * @param {import("./Train").default} train
	 * @returns {void}
	 */
	processPassengers = train => {
		const [newWaiting, passengersToEmbark] = this.waitingPassengers.reduce(
			([waiting, passengers], passenger) => {
				const stations = train.route.stations;
				if (this.direction === -1) stations.reverse();

				const i = stations.indexOf(passenger.destinationName);
				const currentIndex = stations.indexOf(train.route.currentStation);
				if (i === -1 || i < currentIndex) {
					waiting.push(passenger);
				} else {
					passengers.push(passenger);
				}

				return [waiting, passengers];
			},
			[[], []]
		);

		const remaining = train.embarkPassengers(passengersToEmbark);
		this.waitingPassengers = [...newWaiting, ...remaining];
	};

	toJSON() {
		return {
			originalData: {
				geometry: {
					coordinates: this.coordinates
				},
				properties: {
					NAZWA_POS: this.name,
					size: this.size
				}
			},
			neighbors: Array.from(this.neighbors.entries()).map(([name, track]) => ({
				stationName: name,
				trackId: track.id
			})),
			waitingPassengers: this.waitingPassengers.map(p => p.toJSON())
		};
	}

	fromJSON(data) {
		// Restore neighbors map
		this.neighbors.clear();
		data.neighbors.forEach(neighbor => {
			const station = this.gameStore.stationStore.getStationByName(neighbor.stationName);
			const track = this.gameStore.trackStore.tracks.find(t => t.id === neighbor.trackId);
			if (station && track) {
				this.neighbors.set(station.name, track);
			}
		});

		// Restore waiting passengers
		this.waitingPassengers = data.waitingPassengers.map(passengerData => {
			const passenger = new Passenger(passengerData.originName, passengerData.destinationName, this.gameStore);
			passenger.fromJSON(passengerData);
			return passenger;
		});
	}
}

export default Station;
