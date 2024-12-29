import { Link, useLocation } from "react-router";
import { observer } from "mobx-react-lite";

// components
import StatusBox from "./common/StatusBox/StatusBox";
import IconButton, { IconLinkButton } from "./common/IconButton/IconButton";

// routing
import routes from "../Router/Routes";
import NamedOutlet from "../Router/components/NamedOutlet";
import { useIsNamedRouteRendering } from "../Router/components/NamedRouter";

// styles
import style from "./Ui.component.scss";

const Ui = observer(() => {
	let { pathname } = useLocation();
	pathname = pathname.substring(6);
	const hasTip = useIsNamedRouteRendering("tips");

	return (
		<div className="game-ui" data-style={style}>
			<div className="game-ui-top">
				<StatusBox icon="https://cdn-icons-png.flaticon.com/512/7630/7630510.png" value={26753} />
				<IconButton onClick={() => {}}>
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
					<Link to="/game">
						<i className="fas fa-times"></i>
					</Link>
					<NamedOutlet name="menu-content" />
				</div>
			</div>
			<div className="game-ui-bottom-right">
				<div className={`panel ${hasTip ? "" : "collapsed"}`}>
					<NamedOutlet name="tips" />
				</div>
			</div>
		</div>
	);
});

export default Ui;
