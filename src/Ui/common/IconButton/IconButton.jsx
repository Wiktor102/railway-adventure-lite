import PropTypes from "prop-types";

import style from "./IconButton.component.scss";
import { Link } from "react-router";

function IconButton({ onClick, children, active = false, disabled = false, ...props }) {
	return (
		<button
			onClick={onClick}
			className={`icon-button ${active ? "active" : ""} ${disabled ? "disabled" : ""} ${props.className}`}
			disabled={disabled}
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
	active: PropTypes.bool,
	disabled: PropTypes.bool,
	className: PropTypes.string
};

function IconLinkButton({ to, children, active = false, disabled = false, ...props }) {
	return (
		<Link
			to={to}
			className={`icon-button ${active ? "active" : ""} ${disabled ? "disabled" : ""} ${props.className}`}
			data-style={style}
			{...props}
		>
			{children}
		</Link>
	);
}

IconLinkButton.propTypes = {
	children: PropTypes.node.isRequired,
	to: PropTypes.string.isRequired,
	active: PropTypes.bool,
	disabled: PropTypes.bool,
	className: PropTypes.string
};

export { IconLinkButton, IconButton };
export default IconButton;
