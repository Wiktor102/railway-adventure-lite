import { makeAutoObservable } from "mobx";

// classes
import Station from "./Station";

// track components
import { DoubleTrack, SingleTrack, TripleTrack } from "../../Game/Map/Tracks";

class Track {
	width;

	/**@type {Station} */
	startStation;

	/**@type {Station} */
	endStation;

	constructor(width, startStation, endStation) {
		makeAutoObservable(this);
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
