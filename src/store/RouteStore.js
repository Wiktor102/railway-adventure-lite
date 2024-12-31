import { makeAutoObservable } from "mobx";
// import Track from "./models/Track";
import Route from "./models/Route";

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

	// Current Route related methods
	initCurrentRoute = () => {
		this.currentRoute = new Route([]);
	};

	addToCurrentRoute = station => {
		return this.currentRoute.addStation(station.name, this.gameStore.stationStore.stationsMap);
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

	discardCurrentRoute = () => {
		this.currentRoute.cleanup();
		this.currentRoute = null;
	};
}

export default RouteStore;
