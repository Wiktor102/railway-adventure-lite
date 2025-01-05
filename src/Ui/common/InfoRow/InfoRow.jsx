import PropTypes from "prop-types";
import style from "./InfoRow.component.scss";

function InfoRow({ value, label, children }) {
	let wasNoLabel = false;

	if (!label) {
		label = children;
		wasNoLabel = true;
	}

	return (
		<div className="info-row" data-style={style}>
			<span className="label">{label}</span>
			<span className="value">{value}</span>
			{!wasNoLabel && children}
		</div>
	);
}

InfoRow.propTypes = {
	value: PropTypes.string.isRequired,
	label: PropTypes.node,
	children: PropTypes.node
};

export default InfoRow;
