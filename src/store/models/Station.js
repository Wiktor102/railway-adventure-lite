import { makeAutoObservable } from "mobx";

class Station {
	name;
	size;
	coordinates;

	/** @type {Track[]} */
	tracks = [];

	constructor({ geometry, properties }) {
		makeAutoObservable(this, { coordinates: false, name: false });

		this.name = properties.NAZWA_POS;
		this.size = properties.size;
		this.coordinates =
			geometry.coordinates[0] > geometry.coordinates[1] ? geometry.coordinates : geometry.coordinates.reverse();
	}

	addTrack(track) {
		this.tracks.push(track);
	}

	deleteTrack(trackId) {
		this.tracks = this.tracks.filter(track => track.id !== trackId);
	}
}

export default Station;
