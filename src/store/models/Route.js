import { makeAutoObservable } from "mobx";
import findPath from "../../utils/pathfinding";

/**@typedef {Array<{ from: string, to: string, track: Track }>} Path */

class Route {
	width;
	id;

	/**@type {String[]} */
	stations = [];

	/**@type {Path} */
	path = [];

	color;
	name;
	draft = true;

	static idCounter = 0;

	constructor(stations) {
		makeAutoObservable(this);
		this.id = Route.idCounter++;
		this.stations = stations;

		this.name = "Nowa trasa #" + (this.id + 1);
		this.color = "#da7313";
	}

	setName(name) {
		this.name = name;
	}

	setColor(color) {
		this.color = color;
	}

	/**
	 * @param {string} stationName
	 * @param {Object} graph
	 * @returns {boolean} success
	 */
	addStation(stationName, graph = null) {
		if (this.stations.includes(stationName)) return false;
		if (this.stations.length === 0) {
			this.stations.push(stationName);
			return true;
		}

		if (this.stations.length === 1) {
			const path = findPath(graph, this.stations.at(-1), stationName);
			if (path == null) return false;
			this.updatePath(path);
		}

		const segmentIndex = this.path.findIndex(segment => segment.to === stationName);
		if (segmentIndex === -1) {
			const path = findPath(graph, this.stations.at(-1), stationName);
			this.updatePath([...this.path, ...path]);
			this.stations.push(stationName);
			return;
		}

		const nextExistingStation = this.path.slice(segmentIndex).find(segment => this.stations.includes(segment.to))?.to;

		if (!nextExistingStation) {
			this.stations.push(stationName);
			return;
		}

		const insertIndex = this.stations.indexOf(nextExistingStation);
		this.stations.splice(insertIndex, 0, stationName);
	}

	/**
	 * @param {string} stationName
	 * @returns {void}
	 */
	removeStation(stationName) {
		const index = this.stations.indexOf(stationName);
		if (index === -1) return;

		this.stations.splice(index, 1);

		if (index === 0 || index === this.stations.length) {
			const i = this.path.findIndex(({ to, from }) => from === stationName || to === stationName);
			this.updatePath(this.path.toSpliced(i, 1));
		}

		if (this.stations.length < 2 && this.path.length > 0) {
			if (index === 0) {
				this.stations.unshift(this.path[0].from);
			} else {
				this.stations.push(this.path.at(-1).to);
			}
		}
	}

	/**
	 * @param {Path} newPath
	 * @returns {void}
	 */
	updatePath(newPath) {
		// Find tracks that are no longer used
		this.path.forEach(segment => {
			const stillExists = newPath.some(newSegment => newSegment.track.id === segment.track.id);
			if (!stillExists) segment.track.removeRoute(this.id);
		});

		// Add route to new tracks
		newPath.forEach(segment => {
			const isNew = !this.path.some(oldSegment => oldSegment.track.id === segment.track.id);
			if (isNew) segment.track.addRoute(this);
		});

		this.path = newPath;
	}
}

export default Route;
