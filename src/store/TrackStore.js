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
}

export default TrackStore;
