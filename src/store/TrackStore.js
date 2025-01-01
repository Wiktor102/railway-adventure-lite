import { makeAutoObservable } from "mobx";

class TrackStore {
	/** @type {import("./GameStore").default} */
	gameStore;

	/** @type {import("./models/Track").default[]} */
	tracks = [];

	constructor(gameStore) {
		makeAutoObservable(this, { gameStore: false });
		this.gameStore = gameStore;
	}

	/**
	 * @param {Track} track
	 * @returns {void}
	 * */
	addTrack = track => {
		track.startStation.addNeighbor(track.endStation, track);
		track.endStation.addNeighbor(track.startStation, track);
		this.tracks.push(track);
	};

	/**
	 * @param {number} trackId
	 * @returns {void}
	 * */
	deleteTrack = trackId => {
		const track = this.tracks.find(t => t.id === trackId);
		track.startStation.deleteNeighbor(track.endStation.name);
		track.endStation.deleteNeighbor(track.startStation.name);
		this.tracks = this.tracks.filter(t => t.id !== trackId);
	};

	/**
	 * Checks if a track exists between two stations.
	 * @param {String} startStation - The start station name
	 * @param {String} endStation - The end station name
	 * @returns {boolean} Whether a track exists between the two stations.
	 */
	trackExists = (startStation, endStation) => {
		return this.tracks.some(track => {
			return (
				(track.startStation.name === startStation && track.endStation.name === endStation) ||
				(track.startStation.name === endStation && track.endStation.name === startStation)
			);
		});
	};
}

export default TrackStore;
