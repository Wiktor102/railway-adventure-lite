import { makeAutoObservable } from "mobx";
// import Track from "./models/Track";
import Route from "./models/Route";
import findPath from "../utils/pathfinding";

class RouteStore {
	gameStore;

	/** @type {Route[]} */
	routes = [];

	/** @type {Route|null}*/
	currentRoute = null;

	constructor(gameStore) {
		makeAutoObservable(this, { gameStore: false });
		this.gameStore = gameStore;
	}

	addRoute = route => {
		this.tracks.push(route);
	};

	deleteTrack = routeId => {
		this.routes = this.routes.filter(r => r.id !== routeId);
	};

	initCurrentRoute = () => {
		this.currentRoute = new Route([]);
	};

	addToCurrentRoute = station => {
		if (this.currentRoute.stations.length === 0) {
			this.currentRoute.addStation(station);
			return true;
		}

		const path = findPath(this.gameStore.stationStore.stationsMap, this.currentRoute.stations.at(-1), station.name);
		if (path == null) return false;

		this.currentRoute.addStation(station);
		this.currentRoute.updatePath(path);
		return true;
	};

	acceptCurrentRoute = () => {
		if (this.currentRoute.stations.length < 2) {
			return false;
		}

		this.currentRoute.draft = false;
		this.routes.push(this.currentRoute);
		this.currentRoute = null;
		return true;
	};
}

export default RouteStore;
