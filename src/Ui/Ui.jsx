import { Link, useLocation, useMatch } from "react-router";
import { observer } from "mobx-react-lite";
import { Suspense, useRef } from "react";

// hooks
import { useGameStore } from "../store/GameStoreProvider";

// components
import StatusBox from "./common/StatusBox/StatusBox";
import QuitDialog from "./widgets/QuitDialog/QuitDialog";
import SpeedChanger from "./widgets/SpeedChanger/SpeedChanger";
import IconButton, { IconLinkButton } from "./common/IconButton/IconButton";

// routing
import routes from "../Router/Routes";
import NamedOutlet from "../Router/components/NamedOutlet";

//assets
import moneyImg from "../assets/icons/money.png";

// styles
import style from "./Ui.component.scss";
import "../Ui/common/loaders.min.css";

// tip components
import TrackDrawTips from "./tips/TrackDrawTips";
import RouteDrawTips from "./tips/RouteDrawTips";

const Ui = observer(() => {
	const { error, money } = useGameStore();
	const quitDialogRef = useRef(null);
	let { pathname } = useLocation();
	pathname = pathname.substring(5);

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
						to={pathname.includes(`/${route.id}`) ? "" : route.id}
						key={route.id}
						onClick={() => {}}
						active={pathname.includes(`/${route.id}`)}
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
				<TipRenderer />
			</div>
			<div className="game-ui-bottom-center">
				<div className="error-banner">{error}</div>
			</div>
			<QuitDialog dialogRef={quitDialogRef} onClose={handleCloseDialog} />
		</div>
	);
});

function TipRenderer() {
	const buildingTrackTip = !!useMatch("/game/tracks/build/*");
	const creatingRouteTip = useMatch("/game/routes/create");

	return (
		<div className={`panel ${buildingTrackTip || creatingRouteTip ? "" : "collapsed"}`}>
			{buildingTrackTip && <TrackDrawTips />}
			{creatingRouteTip && <RouteDrawTips />}
		</div>
	);
}

export default Ui;
