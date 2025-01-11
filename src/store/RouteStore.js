import { action, makeAutoObservable } from "mobx";
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

	toJSON() {
		return {
			routes: this.routes.map(route => route.toJSON()),
			currentRoute: this.currentRoute ? this.currentRoute.toJSON() : null
		};
	}

	fromJSON(data) {
		this.routes = data.routes.map(routeData => {
			const route = new Route([]);
			route.fromJSON(routeData);
			return route;
		});

		if (data.currentRoute) {
			this.currentRoute = new Route([]);
			this.currentRoute.fromJSON(data.currentRoute);
		}
	}

	/**
	 * @param {number} id
	 * @returns {Route|undefined}
	 */
	getRouteById(id) {
		return this.routes.find(route => route.id === id);
	}
}

export default RouteStore;
