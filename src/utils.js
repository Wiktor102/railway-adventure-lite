import { latLng } from "leaflet";

// Importujemy funkcje matematyczne, jeśli nie są dostępne w środowisku.
const toRadians = degrees => degrees * (Math.PI / 180);
const toDegrees = radians => radians * (180 / Math.PI);

// Funkcja przesuwająca punkt o określoną odległość i azymut
function movePoint(lat, lon, distance, bearing) {
	const R = 6371000; // Promień Ziemi w metrach
	const phi1 = toRadians(lat);
	const lambda1 = toRadians(lon);
	const theta = toRadians(bearing);

	const phi2 = Math.asin(
		Math.sin(phi1) * Math.cos(distance / R) + Math.cos(phi1) * Math.sin(distance / R) * Math.cos(theta)
	);

	const lambda2 =
		lambda1 +
		Math.atan2(
			Math.sin(theta) * Math.sin(distance / R) * Math.cos(phi1),
			Math.cos(distance / R) - Math.sin(phi1) * Math.sin(phi2)
		);

	return [toDegrees(phi2), toDegrees(lambda2)];
}

// Funkcja obliczająca azymut (kierunek) od punktu A do B
function calculateBearing(lat1, lon1, lat2, lon2) {
	const phi1 = toRadians(lat1);
	const phi2 = toRadians(lat2);
	const deltaLambda = toRadians(lon2 - lon1);

	const y = Math.sin(deltaLambda) * Math.cos(phi2);
	const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

	return (toDegrees(Math.atan2(y, x)) + 360) % 360; // Azymut w stopniach
}

function calculateKiteVertices(top, bottom, offsetX, offsetY) {
	offsetX /= 2;
	const o = {
		lat: (top.lat + bottom.lat) / 2,
		lng: (top.lng + bottom.lng) / 2
	};

	const bearingVertical = calculateBearing(top.lat, top.lng, bottom.lat, bottom.lng);
	const bearingT = bearingVertical % 360;
	const bearingL = (bearingVertical + 90) % 360;
	const bearingR = (bearingVertical - 90 + 360) % 360;
	const bearingB = (bearingVertical + 180) % 360;

	const left = latLng(movePoint(o.lat, o.lng, offsetY, bearingL));
	const right = latLng(movePoint(o.lat, o.lng, offsetY, bearingR));

	const topLeft = latLng(movePoint(left.lat, left.lng, offsetX, bearingT));
	const topRight = latLng(movePoint(right.lat, right.lng, offsetX, bearingT));
	const bottomLeft = latLng(movePoint(left.lat, left.lng, offsetX, bearingB));
	const bottomRight = latLng(movePoint(right.lat, right.lng, offsetX, bearingB));

	return { topLeft, topRight, bottomLeft, bottomRight };
}

/**
 * Converts geographic coordinates to cartesian coordinates.
 * @param {number} lat - The latitude.
 * @param {number} lng - The longitude.
 * @returns {{x: number, y:number, z: number}} The cartesian coordinates.
 */
function geographicToCartesian(lat, lng) {
	const phi = toRadians(lat);
	const lambda = toRadians(lng);
	return {
		x: Math.cos(phi) * Math.cos(lambda),
		y: Math.cos(phi) * Math.sin(lambda),
		z: Math.sin(phi)
	};
}

/**
 * Converts cartesian coordinates to geographic coordinates.
 * @param {number} x - The x coordinate.
 * @param {number} y - The y coordinate.
 * @param {number} z - The z coordinate.
 * @returns {LatLng} The geographic coordinates.
 */
function cartesianToGeographic(x, y, z) {
	const lat = toDegrees(Math.asin(z));
	const lng = toDegrees(Math.atan2(y, x));
	return latLng(lat, lng);
}

/**
 * Finds a point belonging to the segment which is nearest to the circle.
 * @param {LatLng} lineStart - The start of the line segment.
 * @param {LatLng} lineEnd - The end of the line segment.
 * @param {LatLng} center - The circle's center.
 * @returns {LatLng} The point nearest to the circle.
 */
function pointNearestCircle(lineStart, lineEnd, center) {
	const lineLengthSquared = lineStart.distanceTo(lineEnd) ** 2;

	if (lineLengthSquared === 0) {
		return lineStart;
	}

	const cartA = geographicToCartesian(lineStart.lat, lineStart.lng);
	const cartB = geographicToCartesian(lineEnd.lat, lineEnd.lng);
	const cartP = geographicToCartesian(center.lat, center.lng);

	const AB = {
		x: cartB.x - cartA.x,
		y: cartB.y - cartA.y,
		z: cartB.z - cartA.z
	};

	const AP = {
		x: cartP.x - cartA.x,
		y: cartP.y - cartA.y,
		z: cartP.z - cartA.z
	};

	const dotAP_AB = AP.x * AB.x + AP.y * AB.y + AP.z * AB.z;
	const magAB2 = AB.x * AB.x + AB.y * AB.y + AB.z * AB.z;

	let t = dotAP_AB / magAB2;
	t = Math.max(0, Math.min(1, t));

	const nearest = {
		x: cartA.x + t * AB.x,
		y: cartA.y + t * AB.y,
		z: cartA.z + t * AB.z
	};

	return cartesianToGeographic(nearest.x, nearest.y, nearest.z);
}

export { calculateKiteVertices, pointNearestCircle };
