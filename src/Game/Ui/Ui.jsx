// state
import { observer } from "mobx-react-lite";
import GameStore from "../../store/GameStore";

import style from "./Ui.component.scss";
import StatusBox from "./StatusBox/StatusBox";
import IconButton from "./IconButton/IconButton";

import { Link, Outlet, useLocation } from "react-router";

const Ui = observer(() => {
	let { pathname } = useLocation();
	pathname = pathname.substring(6);

	return (
		<div className="game-ui" data-style={style}>
			<div className="game-ui-top">
				<StatusBox icon="https://cdn-icons-png.flaticon.com/512/7630/7630510.png" value={26753} />
				<IconButton onClick={() => {}}>
					<i className="fa-solid fa-arrow-right-from-bracket"></i>
				</IconButton>
			</div>
			<div className="game-ui-right">
				{GameStore.MENU_ROUTES.map(route => (
					<Link to={pathname === route.id ? "" : route.id} key={route.id}>
						<IconButton onClick={() => {}} active={pathname == route.id}>
							{route.icon}
						</IconButton>
					</Link>
				))}
			</div>
			<div className="game-ui-left">
				<div className={`panel ${pathname === "" ? "collapsed" : ""}`}>
					<Outlet />
				</div>
			</div>
		</div>
	);
});

export default Ui;
