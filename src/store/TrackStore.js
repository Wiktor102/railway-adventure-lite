import { makeAutoObservable } from "mobx";

class TrackStore {
	gameStore;

	/** @type {Track[]} */
	tracks = [];

	constructor(gameStore) {
		makeAutoObservable(this, { gameStore: false });
		this.gameStore = gameStore;
	}

	addTrack = track => {
		this.tracks.push(track);
	};

	deleteTrack = trackId => {
		this.tracks = this.tracks.filter(t => t.id !== trackId);
	};
}

export default TrackStore;
