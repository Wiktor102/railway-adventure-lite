import PropTypes from "prop-types";
import { Children, cloneElement } from "react";
import { useOutlet } from "react-router";

function NamedOutlet({ name }) {
	const outlet = useOutlet();
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
	name: PropTypes.string.isRequired
};

export default NamedOutlet;
