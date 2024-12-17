import { latLng } from "leaflet";

// Importujemy funkcje matematyczne, jeśli nie są dostępne w środowisku.
const toRadians = degrees => degrees * (Math.PI / 180);
const toDegrees = radians => radians * (180 / Math.PI);

// Funkcja obliczająca dystans (w metrach) między dwoma punktami na Ziemi za pomocą formuły haversine
function haversineDistance(latlng1, latlng2) {
	const { lat: lat1, lng: lon1 } = latlng1;
	const { lat: lat2, lng: lon2 } = latlng2;

	const R = 6371000; // Promień Ziemi w metrach
	const phi1 = toRadians(lat1);
	const phi2 = toRadians(lat2);
	const deltaPhi = toRadians(lat2 - lat1);
	const deltaLambda = toRadians(lon2 - lon1);

	const a =
		Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
		Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c; // Dystans w metrach
}

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

export { calculateKiteVertices, haversineDistance as calcDistance };
