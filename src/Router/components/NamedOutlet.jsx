import PropTypes from "prop-types";
import { Children, cloneElement, useImperativeHandle } from "react";
import { useOutlet } from "react-router";

function NamedOutlet({ name, ref, nested = false }) {
	const outlet = useOutlet();
	// const { repeatedOutlets } = useContext(NamedRouterContext);

	useImperativeHandle(
		ref,
		() => {
			if (nested) return { current: outlet != null };
			return { current: "checkContext" };
		},
		[outlet]
	);

	if (!outlet) return null;
	const { children } = outlet.props;

	const namedOutlet = Children.map(children, renderedRoute => {
		const namedRoute = renderedRoute.props.children;
		const clonedNamedRoute = cloneElement(namedRoute, { outletName: name });
		const clonedRenderedRoute = cloneElement(renderedRoute, { children: clonedNamedRoute });
		return clonedRenderedRoute;
	});

	return namedOutlet;
}

NamedOutlet.propTypes = {
	name: PropTypes.string.isRequired,
	nested: PropTypes.bool,
	ref: PropTypes.object
};

export default NamedOutlet;
