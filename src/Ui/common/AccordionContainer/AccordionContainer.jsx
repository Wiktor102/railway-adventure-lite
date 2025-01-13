import { useState } from "react";
import PropTypes from "prop-types";

// styles
import css from "./AccordionContainer.component.scss";

function AccordionContainer({ header, children, label, expanded, setExpanded }) {
	const [localExpanded, setLocalExpanded] = useState(expanded);
	const toggleExpanded = setExpanded == null ? () => setLocalExpanded(s => !s) : () => setExpanded(s => !s);

	return (
		<div className={`tile_group ${!(expanded ?? localExpanded) && "collapsed"}`} data-style={css}>
			<div className="header" onClick={toggleExpanded}>
				<i className="fas fa-angle-down"></i>
				<h3>{header}</h3>
				{label && <div className="pill-label">{label}</div>}
			</div>
			<div className="content">
				<div>{children}</div>
			</div>
		</div>
	);
}

AccordionContainer.propTypes = {
	header: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
	label: PropTypes.string,
	expanded: PropTypes.bool,
	setExpanded: PropTypes.func
};

export default AccordionContainer;
