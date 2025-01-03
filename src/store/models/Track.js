import { makeAutoObservable } from "mobx";
import { latLng } from "leaflet";

// track components
import { DoubleTrack, SingleTrack, TripleTrack } from "../../Game/Map/Tracks";

class Track {
	width;
	id;

	/**@type {import("./Station").default} */
	startStation;

	/**@type {import("./Station").default} */
	endStation;

	/**@type {import("./Route").default[]} */
	lanes;

	/**@type {number} */
	length;

	static idCounter = 0;

	get hasRoute() {
		return this.freeLanes < this.width;
	}

	get freeLanes() {
		return this.lanes.filter(lane => lane === null).length;
	}

	/**
	 * @param {number} width
	 * @param {import("./Station").default} startStation
	 * @param {import("./Station").default} endStation
	 * @returns {Track}
	 * */
	constructor(width, startStation, endStation) {
		makeAutoObservable(this);
		this.id = Track.idCounter++;
		this.width = width;
		this.startStation = startStation;
		this.endStation = endStation;
		this.lanes = new Array(width).fill(null);
		this.length = latLng(startStation.coordinates).distanceTo(endStation.coordinates);
	}

	/**
	 * @param {Route} route
	 * @returns {string|undefined} error message
	 */
	addRoute(route) {
		const emptyLaneIndex = this.lanes.findIndex(lane => lane === null);
		if (emptyLaneIndex === -1) return `Osiągnięto maksymalną liczbę tras na tym torze (${this.width})`;
		this.lanes[emptyLaneIndex] = route;
	}

	/**
	 * @param {number} routeId
	 * @returns {void}
	 */
	removeRoute(routeId) {
		this.lanes = this.lanes.map(route => (route?.id === routeId ? null : route));
	}

	/**
	 * @param {number} width
	 * @returns {string|undefined} error message
	 */
	updateWidth(width) {
		this.width = width;
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
