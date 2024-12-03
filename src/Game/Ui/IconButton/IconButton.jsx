import React from "react";
import PropTypes from "prop-types";

import style from "./IconButton.component.scss";

function IconButton({ onClick, children, active = false }) {
	return (
		<button onClick={onClick} className={`icon-button ${active && "active"}`} data-style={style}>
			{children}
		</button>
	);
}

IconButton.propTypes = {
	onClick: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired,
	active: PropTypes.bool
};

export default IconButton;
