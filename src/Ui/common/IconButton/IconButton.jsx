import PropTypes from "prop-types";

import style from "./IconButton.component.scss";
import { Link } from "react-router";

function IconButton({ onClick, children, active = false, disabled = false, inverted = false, ...props }) {
	const classList = ["icon-button"];
	if (active) classList.push("active");
	if (disabled) classList.push("disabled");
	if (inverted) classList.push("inverted");
	if (props.className) classList.push(...props.className.split(" "));

	return (
		<button onClick={onClick} disabled={disabled} data-style={style} {...props} className={classList.join(" ")}>
			{children}
		</button>
	);
}

IconButton.propTypes = {
	children: PropTypes.node.isRequired,
	onClick: PropTypes.func,
	active: PropTypes.bool,
	disabled: PropTypes.bool,
	inverted: PropTypes.bool,
	className: PropTypes.string
};

function IconLinkButton({ to, children, active = false, disabled = false, inverted = false, ...props }) {
	const classList = ["icon-button"];
	if (active) classList.push("active");
	if (disabled) classList.push("disabled");
	if (inverted) classList.push("inverted");
	if (props.className) classList.push(...props.className.split(" "));

	return (
		<Link to={to} data-style={style} {...props} className={classList.join(" ")}>
			{children}
		</Link>
	);
}

IconLinkButton.propTypes = {
	children: PropTypes.node.isRequired,
	to: PropTypes.string.isRequired,
	active: PropTypes.bool,
	disabled: PropTypes.bool,
	inverted: PropTypes.bool,
	className: PropTypes.string
};

export { IconLinkButton, IconButton };
export default IconButton;
