import PropTypes from "prop-types";
import styles from "./TipRow.component.scss";

function TipRow({ icon, label }) {
	return (
		<li data-style={styles}>
			{icon}
			<p>{label}</p>
		</li>
	);
}

TipRow.propTypes = {
	icon: PropTypes.node,
	label: PropTypes.string
};

export default TipRow;
