import { makeAutoObservable } from "mobx";
import Track from "./models/Track";

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
}

export default TrackStore;
