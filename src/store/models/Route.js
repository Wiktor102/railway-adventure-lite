import { makeAutoObservable } from "mobx";
import findPath from "../../utils/pathfinding";

/**@typedef {Array<{ from: string, to: string, track: Track, trackIndex: number|undefined }>} Path */

class Route {
	width;
	id;

	/**@type {String[]} */
	stations = [];

	/**@type {Path} */
	path = [];

	/**@type {String} */
	color;

	/**@type {String} */
	name;

	/**@type {number} seconds */
	stopDuration = 60;

	/**@type {number} seconds */
	routeInterval = 5 * 60;

	/**@type {number} */
	pricePerKm = 1;

	draft = true;

	static idCounter = 0;

	constructor(stations) {
		makeAutoObservable(this);
		this.id = Route.idCounter++;
		this.stations = stations;

		this.name = "Nowa trasa #" + (this.id + 1);
		this.color = "#da7313";
	}

	cleanup() {
		this.updatePath([]); // Do not care about errors because it's just removing the route from tracks
		this.stations = [];
	}

	/** Route length in meters
	 * @returns {number}
	 * */
	get distance() {
		return this.path.reduce((acc, segment) => acc + segment.track.length, 0);
	}

	/**
	 * @param {string} name
	 * @returns {void}
	 */
	setName = name => {
		this.name = name;
	};

	/**
	 * @param {string} color
	 * @returns {void}
	 */
	setColor = color => {
		this.color = color;
	};

	/**
	 * @param {number} duration
	 * @returns {void}
	 */
	setStopDuration = duration => {
		this.stopDuration = duration;
	};

	/**
	 * @param {number} interval
	 * @returns {void}
	 */
	setRouteInterval = interval => {
		this.routeInterval = interval;
	};

	/**
	 * @param {number} price
	 * @returns {void}
	 */
	setPricePerKm = price => {
		this.pricePerKm = price;
	};

	/**
	 * @param {string} stationName
	 * @param {Object} graph
	 * @returns {string|null} error
	 */
	addStation(stationName, graph = null) {
		if (this.stations.includes(stationName)) return "Trasa już zawiera tę stację";
		if (this.stations.length === 0) {
			this.stations.push(stationName);
			return;
		}

		if (this.stations.length === 1) {
			const path = findPath(graph, this.stations.at(-1), stationName);
			if (path == null) return "Nie można odnaleźć ścieżki";
			const error = this.updatePath(path);
			if (error) return error;
			this.stations.push(stationName);
			return;
		}

		const segmentIndex = this.path.findIndex(segment => segment.to === stationName);
		if (segmentIndex === -1) {
			// Add new station at the end of the route
			const newPathSegments = findPath(graph, this.stations.at(-1), stationName);
			if (newPathSegments == null) return "Nie można odnaleźć ścieżki";

			const overlaps = newPathSegments.some(newSegment =>
				this.path.some(existingSegment => existingSegment.track.id === newSegment.track.id)
			);
			if (overlaps) return "Trasa już zawiera ten odcinek";

			const error = this.updatePath([...this.path, ...newPathSegments]);
			if (error) return error;

			this.stations.push(stationName);
			return;
		}

		const nextExistingStation = this.path.slice(segmentIndex).find(segment => this.stations.includes(segment.to))?.to;

		// Should never happen
		if (!nextExistingStation) {
			console.error("Route.addStation: nextExistingStation is null! This should've never happened.");
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
			this.updatePath(this.path.toSpliced(i, 1)); // Do not care about errors because it's just removing the route from tracks
		}

		const originMatches = this.path[0].from === stationName;
		const destinationMatches = this.path.at(-1).to === stationName;
		if (this.path.length > 0 && (!originMatches || !destinationMatches)) {
			if (index === 0) {
				this.stations.unshift(this.path[0].from);
			} else {
				this.stations.push(this.path.at(-1).to);
			}
		}
	}

	/**
	 * @param {Path} newPath
	 * @returns {string|undefined} error message
	 */
	updatePath(newPath) {
		let error;

		// Add route to new tracks
		let i = 0;
		const tracksWithAddedRoute = [];
		for (const segment of newPath) {
			const isNew = !this.path.some(oldSegment => oldSegment.track.id === segment.track.id);
			if (isNew) {
				[newPath[i].trackIndex, error] = segment.track.addRoute(this);
				if (!error) tracksWithAddedRoute.push(segment.track);
			}

			if (error) break;
			i++;
		}

		if (error) {
			// If there was an error, revoke changes
			for (const track of tracksWithAddedRoute) {
				track.removeRoute(this.id);
			}

			return error;
		}

		// Find tracks that are no longer used
		this.path.forEach(segment => {
			const stillExists = newPath.some(newSegment => newSegment.track.id === segment.track.id);
			if (!stillExists) segment.track.removeRoute(this.id);
		});

		this.path = newPath;
	}

	toJSON() {
		return {
			id: this.id,
			stations: this.stations,
			path: this.path.map(segment => ({
				from: segment.from,
				to: segment.to,
				trackId: segment.track.id,
				trackIndex: segment.trackIndex
			})),
			color: this.color,
			name: this.name,
			stopDuration: this.stopDuration,
			routeInterval: this.routeInterval,
			pricePerKm: this.pricePerKm,
			draft: this.draft
		};
	}

	fromJSON(data) {
		this.id = data.id;
		this.stations = data.stations;
		this.color = data.color;
		this.name = data.name;
		this.stopDuration = data.stopDuration;
		this.routeInterval = data.routeInterval;
		this.pricePerKm = data.pricePerKm;
		this.draft = data.draft;

		// Reconstruct path with track references
		this.path = data.path.map(segment => {
			const track = this.gameStore.trackStore.tracks.find(t => t.id === segment.trackId);
			if (track) {
				track.lanes[segment.trackIndex] = this; // Restore route reference in track's lanes
			}
			return {
				from: segment.from,
				to: segment.to,
				track: track,
				trackIndex: segment.trackIndex
			};
		});
	}
}

export default Route;
