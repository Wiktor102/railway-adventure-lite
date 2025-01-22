import { action, makeAutoObservable } from "mobx";
import Route from "./models/Route";

/**
 * @typedef {Object} RouteStoreSerialized
 * @property {import("./models/Route").RouteSerialized[]} routes
 */

class RouteStore {
	gameStore;

	/** @type {Route[]} */
	routes = [];

	/** @type {Route|null}*/
	currentRoute = null;

	/** @type {Route|null}*/
	highlightedRoute = null;

	/**
	 * @param {import("./GameStore").default} gameStore
	 * @param {RouteSerialized[]|undefined} routes
	 * */
	constructor(gameStore, routes = []) {
		makeAutoObservable(this, { gameStore: false, initCurrentRoute: action });

		this.gameStore = gameStore;

		routes.forEach(r => {
			if (!(r instanceof Route)) throw new Error("Invalid route data");
		});
		this.routes = routes;
	}

	addRoute = route => {
		this.tracks.push(route);
	};

	deleteRoute = routeId => {
		const routeToDeleteIndex = this.routes.findIndex(r => r.id === routeId);
		if (routeToDeleteIndex === -1) return;

		this.routes[routeToDeleteIndex].cleanup();
		this.routes.splice(routeToDeleteIndex, 1);
	};

	// --------------------------------
	// --------------------------------
	// Current Route related methods
	// --------------------------------

	/** creates a new route
	 * @returns {void}
	 */
	initCurrentRoute = () => {
		this.currentRoute = new Route([], this.gameStore);
	};

	/**
	 * @param {Station} station
	 * @returns {string|null} error
	 */
	addToCurrentRoute = station => {
		return this.currentRoute.addStation(station.name, this.gameStore.stationStore.stationsMap);
	};

	/**
	 * @param {Station} station
	 * @returns {void}
	 */
	removeFromCurrentRoute = station => {
		this.currentRoute.removeStation(station.name);
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
		this.currentRoute?.cleanup();
		this.currentRoute = null;
	};

	// --------------------------------
	// --------------------------------
	// Highlighted Route related methods
	// --------------------------------

	setHighlightedRoute = route => {
		this.highlightedRoute = route;
	};

	/**
	 * @returns {RouteStoreSerialized}
	 */
	toJSON() {
		return {
			routes: this.routes.map(route => route.toJSON()).filter(Boolean)
		};
	}

	/**
	 * @param {RouteStoreSerialized} data
	 * @param {import("./GameStore").default} gameStore
	 * @returns {RouteStore}
	 */
	static fromJSON(data, gameStore) {
		const routes = data.routes.map(routeData => Route.fromJSON(routeData, gameStore));
		return new RouteStore(gameStore, routes);
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
