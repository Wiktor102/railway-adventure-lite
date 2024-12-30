import { makeAutoObservable } from "mobx";

/**@typedef {Array<{ from: string, to: string, track: Track }>} Path */

class Route {
	width;
	id;

	/**@type {Station[]} */
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

	addStation(station) {
		this.stations.push(station);
	}

	/**
	 * @param {Path} path
	 * @returns {void}
	 */
	updatePath(path) {
		this.path = [...this.path, ...path];
		path.forEach(segment => {
			segment.track.addRoute(this);
		});
	}
}

export default Route;
