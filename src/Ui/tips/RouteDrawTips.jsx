import TipRow from "../common/TipRow/TipRow";

// assets
import stationLeftCLick from "../../assets/icons/station-left-click.svg";
import stationRightCLick from "../../assets/icons/station-right-click.svg";

const RouteDrawTips = () => {
	return (
		<>
			<h3>Sterowanie</h3>
			<ul>
				<TipRow
					icon={<img src={stationLeftCLick} alt="lewy przycisk myszy, obok pinezka stacji" />}
					label={`Kliknij stację lewym przyciskiem, aby dodać przystanek`}
				/>
				<TipRow
					icon={<img src={stationRightCLick} alt="prawy przycisk myszy, obok pinezka stacji" />}
					label={`Kliknij stację prawym przyciskiem, aby dodać przystanek`}
				/>
			</ul>
		</>
	);
};

export default RouteDrawTips;
