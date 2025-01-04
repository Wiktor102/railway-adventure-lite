import { action, makeAutoObservable } from "mobx";
// import Track from "./models/Track";
import Route from "./models/Route";

class RouteStore {
	gameStore;

	/** @type {Route[]} */
	routes = [];

	/** @type {Route|null}*/
	currentRoute = null;

	/** @type {Route|null}*/
	highlightedRoute = null;

	constructor(gameStore) {
		makeAutoObservable(this, { gameStore: false, initCurrentRoute: action });
		this.gameStore = gameStore;
	}

	addRoute = route => {
		this.tracks.push(route);
	};

	deleteTrack = routeId => {
		this.routes = this.routes.filter(r => r.id !== routeId);
	};

	// --------------------------------
	// --------------------------------
	// Current Route related methods

	/** creates a new route
	 * @returns {void}
	 */
	initCurrentRoute = () => {
		this.currentRoute = new Route([]);
	};

	/**
	 * @param {Station} station
	 * @returns {string|null} error
	 */
	addToCurrentRoute = station => {
		return this.currentRoute.addStation(station.name, this.gameStore.stationStore.stationsMap);
	};

	/**
	 * Accepts current route and adds it to the routes list
	 * @returns {boolean} success
	 * */
	acceptCurrentRoute = () => {
		if (this.currentRoute.stations.length < 2) return false;

		this.currentRoute.draft = false;
		this.routes.push(this.currentRoute);
		this.currentRoute = null;
		return true;
	};

	discardCurrentRoute = () => {
		this.currentRoute.cleanup();
		this.currentRoute = null;
	};

	// --------------------------------
	// --------------------------------
	// Highlighted Route related methods
	setHighlightedRoute = route => {
		this.highlightedRoute = route;
	};
}

export default RouteStore;
