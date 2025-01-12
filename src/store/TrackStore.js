import { makeAutoObservable } from "mobx";
import Track from "./models/Track";

/**
 * @typedef {Object} TrackStoreSerialized
 * @property {TrackSerialized[]} tracks
 */

class TrackStore {
	/** @type {import("./GameStore").default} */
	gameStore;

	/** @type {import("./models/Track").default[]} */
	tracks = [];

	/** @type {boolean} */
	buildingTrack = false;

	constructor(gameStore, tracks = []) {
		makeAutoObservable(this, { gameStore: false });

		this.gameStore = gameStore;

		tracks.forEach(track => {
			if (!(track instanceof Track)) throw new Error("Invalid track");
			this.addTrack(track);
		});
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

	setBuildingTrack = buildingTrack => {
		this.buildingTrack = buildingTrack;
	};

	/**
	 * @returns {TrackStoreSerialized}
	 * */
	toJSON() {
		return {
			tracks: this.tracks.map(track => track.toJSON())
		};
	}

	/**
	 * @param {TrackStoreSerialized} data
	 * @param {import("./GameStore").default} gameStore
	 * @returns {TrackStore}
	 * */
	static fromJSON(data, gameStore) {
		const tracks = data.tracks.map(trackData => Track.fromJSON(trackData, gameStore));
		return new TrackStore(gameStore, tracks);
	}
}

export default TrackStore;
