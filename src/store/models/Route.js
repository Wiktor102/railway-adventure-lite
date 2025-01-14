import { makeAutoObservable, runInAction } from "mobx";
import findPath from "../../utils/pathfinding";

/**
 * @typedef {Object} PathSegment
 * @property {string} from
 * @property {string} to
 * @property {import("./Track").default} track
 * @property {number|undefined} trackIndex
 */

/**
 * @typedef {Object} PathSegmentSerialized
 * @property {string} from
 * @property {string} to
 * @property {number} trackId
 * @property {number|undefined} trackIndex
 */

/**@typedef {PathSegment[]} Path */

/**
 * @typedef {Object} RouteSerialized
 * @property {number} id
 * @property {string[]} stations
 * @property {PathSegmentSerialized[]} path
 * @property {string} color
 * @property {string} name
 * @property {number} stopDuration
 * @property {number} routeInterval
 * @property {number} pricePerKm
 */

class Route {
	width;
	id;

	/**@type {import("../GameStore").default}*/
	gameStore;

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
	pricePerKm = 0.5;

	draft = true;

	static idCounter = 0;

	/**
	 * @param {String[]} stations
	 * @param {import("../GameStore").default} gameStore
	 * @param {RouteSerialized|undefined} data
	 * */
	constructor(stations, gameStore, data = {}) {
		makeAutoObservable(this);
		this.id = data.id ? data.id : Route.idCounter++;
		this.gameStore = gameStore;
		this.stations = stations;

		this.name = data.name ? data.name : "Nowa trasa #" + (this.id + 1);
		this.color = data.color ? data.color : "#da7313";

		// Add this line to mark loaded routes as non-draft
		this.draft = !data.id;

		if (data.id) {
			Route.idCounter = Math.max(Route.idCounter, data.id + 1);
		}

		if (data.stopDuration) {
			this.stopDuration = data.stopDuration;
		}

		if (data.routeInterval) {
			this.routeInterval = data.routeInterval;
		}

		if (data.pricePerKm) {
			this.pricePerKm = data.pricePerKm;
		}
	}

	cleanup() {
		this.updatePath([]); // Do not care about errors because it's just removing the route from tracks
		this.stations = [];
	}

	/**
	 * @returns {Array<{latlng: import("leaflet").LatLng, stop: {duration: number, name: string} | undefined, debug: string}>|null}
	 */
	get fullPath() {
		const path = this.path.flatMap((segment, i) => {
			if (!segment.track.latlngs) return null;
			let segmentLatlngs = segment.track.latlngs[segment.trackIndex];
			if (segment.track.startStation.name === segment.to) segmentLatlngs = segmentLatlngs.toReversed();

			return segmentLatlngs
				.map((latlng, j) => {
					const hasStop = j === segmentLatlngs.length - 1 && this.stations.includes(segment.to);
					const stop = hasStop ? { duration: this.stopDuration * 1000, name: segment.to } : undefined;
					return { latlng, stop, debug: `${segment.from} -> ${segment.to}` };
				})
				.slice(i === 0 ? 0 : 1);
		});

		if (path.includes(null)) return null;
		return path;
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
		if (this.stations.length === 2) {
			this.gameStore.showError("Trasa musi zawierać co najmniej dwie stacje!");
			return;
		}

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

	/**
	 * @returns {RouteSerialized|false}
	 */
	toJSON() {
		if (this.draft) return false; // DO not serialize draft routes

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
			pricePerKm: this.pricePerKm
		};
	}

	/**
	 * @param {RouteSerialized} data
	 * @param {import("../GameStore").default} gameStore
	 * @returns {Route}
	 */
	static fromJSON({ stations, ...data }, gameStore) {
		const route = new Route(stations, gameStore, data);

		runInAction(() => {
			// Reconstruct path with track references
			route.path = data.path.map(segment => {
				const track = gameStore.trackStore.tracks.find(t => t.id === segment.trackId); // TODO: implement getTrackById(id)
				if (!track) throw new Error(`Track #${segment.trackId} not found!`);

				track.lanes[segment.trackIndex] = route;
				return {
					from: segment.from,
					to: segment.to,
					track: track,
					trackIndex: segment.trackIndex
				};
			});
		});

		return route;
	}
}

export default Route;
