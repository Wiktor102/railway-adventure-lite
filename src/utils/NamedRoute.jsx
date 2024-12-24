import PropTypes from "prop-types";

function NamedRoute({ outlets, outletName }) {
	console.log("outlet name for NamedRoute", outletName);
	const matchedOutlet = outlets.find(outlet => {
		return outlet.name === outletName;
	});

	if (!matchedOutlet) return null;
	return matchedOutlet.content;
}

NamedRoute.propTypes = {
	outlets: PropTypes.array.isRequired,
	outletName: PropTypes.string.isRequired
};

export default NamedRoute;
