import PropTypes from "prop-types";
import style from "./ElevatedButton.component.scss";
import { Link } from "react-router";

function ElevatedButton({ children, onClick = () => {}, disabled = false }) {
	return (
		<button
			className={`elevated-button ${disabled ? "disabled" : ""}`}
			onClick={onClick}
			data-style={style}
			disabled={disabled}
		>
			{children}
		</button>
	);
}

ElevatedButton.propTypes = {
	children: PropTypes.node.isRequired,
	onClick: PropTypes.func,
	disabled: PropTypes.bool
};

function ElevatedLinkButton({ children, to, disabled = false }) {
	return (
		<Link to={to} className={`elevated-button ${disabled ? "disabled" : ""}`} data-style={style}>
			{children}
		</Link>
	);
}

ElevatedLinkButton.propTypes = {
	children: PropTypes.node.isRequired,
	to: PropTypes.string.isRequired,
	disabled: PropTypes.bool
};

export { ElevatedLinkButton, ElevatedButton };
export default ElevatedButton;
