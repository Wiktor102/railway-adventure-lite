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
		this.tracks.push(track);
		this.gameStore.stationStore.getStationByName(track.startStation.name).addTrack(track);
		this.gameStore.stationStore.getStationByName(track.endStation.name).addTrack(track);
	};

	/**
	 * @param {number} trackId
	 * @returns {void}
	 * */
	deleteTrack = trackId => {
		const track = this.tracks.find(t => t.id === trackId);
		this.gameStore.stationStore.getStationByName(track.startStation.name).deleteTrack(trackId);
		this.gameStore.stationStore.getStationByName(track.endStation.name).deleteTrack(trackId);
		this.tracks = this.tracks.filter(t => t.id !== trackId);
	};
}

export default TrackStore;
