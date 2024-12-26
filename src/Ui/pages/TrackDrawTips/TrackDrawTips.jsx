import TipRow from "../../common/TipRow/TipRow";

import leftCLick from "../../../assets/icons/computer-mouse-left-click.svg";
import rightClick from "../../../assets/icons/computer-mouse-right-click.svg";

function TrackDrawTips() {
	return (
		<>
			<h3>Sterowanie</h3>
			<ul>
				<TipRow icon={<img src={leftCLick} alt="lewy przycisk myszy" />} label="Rozpocznij / zakończ tor" />
				<TipRow icon={<img src={rightClick} alt="prawy przycisk myszy" />} label="Anuluj" />
			</ul>
		</>
	);
}

export default TrackDrawTips;
