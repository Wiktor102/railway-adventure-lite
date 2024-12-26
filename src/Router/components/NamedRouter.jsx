import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const NamedRouterContext = createContext({});

function NamedRouter({ outletNames, children }) {
	const [repeatedOutlets, setRepeatedOutlets] = useState({});
	function updateNestedOutletState(outletName, isRendering) {
		setRepeatedOutlets(prev => ({ ...prev, [outletName]: isRendering }));
	}

	return (
		<NamedRouterContext.Provider value={{ repeatedOutlets, updateNestedOutletState, outletNames }}>
			{children}
		</NamedRouterContext.Provider>
	);
}

NamedRouter.propTypes = {
	children: PropTypes.node.isRequired,
	outletNames: PropTypes.arrayOf(PropTypes.string).isRequired
};

function useIsNamedRouteRendering(outletName) {
	const { repeatedOutlets } = useContext(NamedRouterContext);
	return repeatedOutlets[outletName] ?? false;
}

export { useIsNamedRouteRendering, NamedRouterContext };
export default NamedRouter;
