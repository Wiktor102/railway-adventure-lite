import { makeAutoObservable } from "mobx";

class Station {
	name;
	coordinates;

	constructor({ geometry, ...data }) {
		makeAutoObservable(this, { coordinates: false, name: false });

		this.name = data.properties.NAZWA_POS;
		this.coordinates =
			geometry.coordinates[0] > geometry.coordinates[1] ? geometry.coordinates : geometry.coordinates.reverse();
	}
}

export default Station;
