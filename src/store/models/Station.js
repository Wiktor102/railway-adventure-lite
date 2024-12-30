import { makeAutoObservable } from "mobx";

class Station {
	name;
	size;
	coordinates;

	/** @type {Map<String,import("./Track").default>} */
	neighbors = new Map();

	constructor({ geometry, properties }) {
		makeAutoObservable(this, { coordinates: false, name: false });

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
}

export default Station;
