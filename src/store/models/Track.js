import { makeAutoObservable } from "mobx";

// track components
import { DoubleTrack, SingleTrack, TripleTrack } from "../../Game/Map/Tracks";

class Track {
	width;
	id;

	/**@type {Station} */
	startStation;

	/**@type {Station} */
	endStation;

	static idCounter = 0;

	constructor(width, startStation, endStation) {
		makeAutoObservable(this);
		this.id = Track.idCounter++;
		this.width = width;
		this.startStation = startStation;
		this.endStation = endStation;
	}

	getComponent() {
		return Track.getComponent(this.width);
	}

	static getComponent(width) {
		if (width === 1) {
			return SingleTrack;
		} else if (width === 2) {
			return DoubleTrack;
		} else if (width === 3) {
			return TripleTrack;
		}

		throw new Error(`Track width ${width} not supported`);
	}
}

export default Track;
