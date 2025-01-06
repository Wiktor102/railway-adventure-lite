import { observer } from "mobx-react-lite";
import PropTypes from "prop-types";

// hooks
import { useGameStore } from "../../../../store/GameStoreProvider";

// assets
import moneyIcon from "../../../../assets/icons/money.png";

// styles
import styles from "./TrackCostIndicator.component.scss";

const TrackCostIndicator = observer(({ cost }) => {
	const { money } = useGameStore();

	return (
		<div className="track-cost-indicator" data-style={styles}>
			<img src={moneyIcon} alt="Zielona ikona banknotów" />
			<span className={cost > money ? "red" : undefined}>{cost.toLocaleString("pl-PL").replace(/,/g, " ")}</span>
		</div>
	);
});

TrackCostIndicator.propTypes = {
	cost: PropTypes.number.isRequired
};

export default TrackCostIndicator;
