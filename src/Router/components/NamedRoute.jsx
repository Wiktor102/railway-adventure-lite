import { useContext } from "react";
import PropTypes from "prop-types";
import { NamedRouterContext } from "./NamedRouter";
import NamedOutlet from "./NamedOutlet";

function NamedRoute({ outlets, outletName }) {
	const { outletNames, updateNestedOutletState } = useContext(NamedRouterContext);
	const presentOutlets = outlets.map(o => o.name);
	const missingOutlets = outletNames.filter(o => !presentOutlets.includes(o));

	missingOutlets.forEach(o => {
		outlets.push({
			name: o,
			content: <NamedOutlet name={o} nested={true} ref={ref => updateNestedOutletState(o, ref?.current)} />
		});
	});

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
