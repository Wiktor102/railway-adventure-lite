/**@typedef {Array<{ from: string, to: string, track: Track }>} Path */

/**
 * Find path
 * @param {Map<String, import("../store/models/Station").default>} graph
 * @param {string} startName
 * @param {string} endName
 * @returns {Path|null}
 */
function findPath(graph, startName, endName) {
	// Initialize BFS
	const queue = [];
	const visited = new Set();
	const parent = new Map();

	const startStation = graph.get(startName);
	if (!startStation) return null; // Start station not found

	queue.push(startStation);
	visited.add(startName);

	// BFS main loop
	while (queue.length > 0) {
		const currentStation = queue.shift();

		// Found the destination
		if (currentStation.name === endName) {
			return reconstructPath(parent, startName, endName);
		}

		// Check all neighbors
		for (const [neighborStationName, track] of currentStation.neighbors.entries()) {
			if (visited.has(neighborStationName)) continue;
			visited.add(neighborStationName);
			parent.set(neighborStationName, {
				station: currentStation.name,
				track: track
			});
			queue.push(graph.get(neighborStationName));
		}
	}

	return null; // No path found
}

/**
 * Reconstruct path
 * @param {Map<String, { station: string, track: Track }>} parent
 * @param {string} startName
 * @param {string} endName
 * @returns {Path}
 */
function reconstructPath(parent, startName, endName) {
	const path = [];
	let currentName = endName;

	while (currentName !== startName) {
		const parentInfo = parent.get(currentName);
		if (!parentInfo) return null; // Should never happen if path was found

		path.unshift({
			from: parentInfo.station,
			to: currentName,
			track: parentInfo.track
		});

		currentName = parentInfo.station;
	}

	return path;
}

export default findPath;
