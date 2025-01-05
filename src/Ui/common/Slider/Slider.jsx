import PropTypes from "prop-types";
import { useId } from "react";

// components
import InfoRow from "../InfoRow/InfoRow";

// style
import style from "./Slider.component.scss";

function Slider({ children, value, renderedValue, onChange, min, max, step }) {
	const id = useId();
	return (
		<InfoRow label={children} value={renderedValue ?? value}>
			<input
				type="range"
				id={id}
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={e => onChange(+e.target.value)}
				data-style={style}
			/>
		</InfoRow>
	);
}

Slider.propTypes = {
	children: PropTypes.node,
	value: PropTypes.number,
	renderedValue: PropTypes.number,
	onChange: PropTypes.func,
	min: PropTypes.number,
	max: PropTypes.number,
	step: PropTypes.number
};

export default Slider;
