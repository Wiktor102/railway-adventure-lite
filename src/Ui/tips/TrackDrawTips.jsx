import { observer } from "mobx-react-lite";

// components
import TipRow from "../common/TipRow/TipRow";

// hooks
import { useGameStore } from "../../store/GameStoreProvider";

// assets
import stationLeftCLick from "../../assets/icons/station-left-click.svg";
import trackLeftCLick from "../../assets/icons/track-left-click.svg";
import rightClick from "../../assets/icons/computer-mouse-right-click.svg";

const TrackDrawTips = observer(() => {
	const { trackStore } = useGameStore();

	return (
		<>
			<h3>Sterowanie</h3>
			<ul>
				<TipRow
					icon={<img src={stationLeftCLick} alt="lewy przycisk myszy" />}
					label={`Kliknij stację, aby ${trackStore.buildingTrack ? "zakończyć" : "rozpocząć"} tor`}
				/>
				{!trackStore.buildingTrack && (
					<TipRow
						icon={<img src={trackLeftCLick} alt="lewy przycisk myszy" />}
						label="Kliknij tor, aby ulepszyć"
					/>
				)}
				{trackStore.buildingTrack && (
					<TipRow icon={<img src={rightClick} alt="prawy przycisk myszy" />} label="Anuluj" />
				)}
			</ul>
		</>
	);
});

export default TrackDrawTips;
