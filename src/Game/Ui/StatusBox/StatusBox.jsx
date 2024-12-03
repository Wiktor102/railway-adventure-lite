import React from "react";
import PropTypes from "prop-types";

import style from "./StatusBox.component.scss";

function StatusBox({ icon, value }) {
	return (
		<div className="status-box" data-style={style}>
			<img src={icon} alt="" />
			<span>{value}</span>
		</div>
	);
}

StatusBox.propTypes = {
	icon: PropTypes.string.isRequired,
	value: PropTypes.number.isRequired
};

export default StatusBox;
