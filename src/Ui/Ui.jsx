import { Link, useLocation, useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import { Suspense, useRef } from "react";
import PropTypes from "prop-types";

// hooks
import { useGameStore } from "../store/GameStoreProvider";

// components
import StatusBox from "./common/StatusBox/StatusBox";
import SpeedChanger from "./widgets/SpeedChanger/SpeedChanger";
import IconButton, { IconLinkButton } from "./common/IconButton/IconButton";

// routing
import routes from "../Router/Routes";
import NamedOutlet from "../Router/components/NamedOutlet";
import { useIsNamedRouteRendering } from "../Router/components/NamedRouter";

//assets
import moneyImg from "../assets/icons/money.png";

// styles
import style from "./Ui.component.scss";
import "../Ui/common/loaders.min.css";

const QuitDialog = ({ dialogRef, onClose }) => {
	const navigate = useNavigate();
	const gameStore = useGameStore();

	const handleSaveAndQuit = () => {
		gameStore.saveToLocalStorage();
		navigate("/");
	};

	const handleSaveToFile = () => {
		gameStore.downloadSave();
	};

	const handleQuitWithoutSave = () => {
		navigate("/");
	};

	return (
		<dialog ref={dialogRef} className="quit-dialog">
			<h2>Wyjść z gry?</h2>
			<div className="dialog-buttons">
				<button className="save-quit-btn green" onClick={handleSaveAndQuit}>
					Zapisz i wyjdź
				</button>
				<button className="green" onClick={handleSaveToFile}>
					<i className="fas fa-download"></i>
				</button>
				<button className="red" onClick={handleQuitWithoutSave}>
					Wyjdź bez zapisywania
				</button>
				<button className="orange" onClick={onClose}>
					Anuluj
				</button>
			</div>
		</dialog>
	);
};

QuitDialog.propTypes = {
	dialogRef: PropTypes.object,
	onClose: PropTypes.func
};

const Ui = observer(() => {
	const { error, money } = useGameStore();
	const quitDialogRef = useRef(null);
	let { pathname } = useLocation();
	pathname = pathname.substring(6);
	const hasTip = useIsNamedRouteRendering("tips");

	const handleQuit = () => {
		quitDialogRef.current?.showModal();
	};

	const handleCloseDialog = () => {
		quitDialogRef.current?.close();
	};

	return (
		<div className="game-ui" data-style={style}>
			<div className="game-ui-top">
				<SpeedChanger />
				<StatusBox icon={moneyImg} value={money.toLocaleString("en-US").replace(/,/g, " ")} />
				<IconButton onClick={handleQuit}>
					<i className="fa-solid fa-arrow-right-from-bracket"></i>
				</IconButton>
			</div>
			<div className="game-ui-right">
				{routes.map(route => (
					<IconLinkButton
						to={pathname.includes(route.id) ? "" : route.id}
						key={route.id}
						onClick={() => {}}
						active={pathname.includes(route.id)}
					>
						{route.icon}
					</IconLinkButton>
				))}
			</div>
			<div className="game-ui-left">
				<div className={`panel ${pathname === "" ? "collapsed" : ""}`}>
					<Suspense
						fallback={
							<div className="ball-grid-pulse">
								<div></div>
								<div></div>
								<div></div>
								<div></div>
								<div></div>
								<div></div>
								<div></div>
								<div></div>
								<div></div>
							</div>
						}
					>
						<Link to="/game">
							<i className="fas fa-times"></i>
						</Link>
						<NamedOutlet name="menu-content" />
					</Suspense>
				</div>
			</div>
			<div className="game-ui-bottom-right">
				<div className={`panel ${hasTip ? "" : "collapsed"}`}>
					<NamedOutlet name="tips" />
				</div>
			</div>
			<div className="game-ui-bottom-center">
				<div className="error-banner">{error}</div>
			</div>
			<QuitDialog dialogRef={quitDialogRef} onClose={handleCloseDialog} />
		</div>
	);
});

export default Ui;
