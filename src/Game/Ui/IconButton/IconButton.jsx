import React from "react";
import PropTypes from "prop-types";

import style from "./IconButton.component.scss";

function IconButton({ onClick, children, active = false, ...props }) {
	return (
		<button
			onClick={onClick}
			className={`icon-button ${active && "active"} ${props.className}`}
			data-style={style}
			{...props}
		>
			{children}
		</button>
	);
}

IconButton.propTypes = {
	children: PropTypes.node.isRequired,
	onClick: PropTypes.func,
	active: PropTypes.bool
};

export default IconButton;
