import { observer } from "mobx-react-lite";

import style from "./Ui.component.scss";
import StatusBox from "./StatusBox/StatusBox";
import IconButton from "./IconButton/IconButton";

import trackIcon from "../../assets/icons/track.svg";

const Ui = observer(() => {
	return (
		<div className="game-ui" data-style={style}>
			<div className="game-ui-top">
				<StatusBox icon="https://cdn-icons-png.flaticon.com/512/7630/7630510.png" value={26753} />
				<IconButton onClick={() => {}}>
					<i className="fa-solid fa-arrow-right-from-bracket"></i>
				</IconButton>
			</div>
			<div className="game-ui-right">
				<IconButton onClick={() => {}}>
					<img src={trackIcon} alt="" />
				</IconButton>
				<IconButton onClick={() => {}}>
					<i className="fa-solid fa-route"></i>
				</IconButton>
				<IconButton onClick={() => {}}>
					<i className="fa-solid fa-train"></i>
				</IconButton>
			</div>
		</div>
	);
});

export default Ui;
