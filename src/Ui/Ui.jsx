import { Link, useLocation } from "react-router";
import { observer } from "mobx-react-lite";

// components
import StatusBox from "./common/StatusBox/StatusBox";
import IconButton from "./common/IconButton/IconButton";

// routing
import routes from "../Router/Routes";
import NamedOutlet from "../Router/components/NamedOutlet";

// styles
import style from "./Ui.component.scss";

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
				{routes.map(route => (
					<Link to={pathname === route.id ? "" : route.id} key={route.id}>
						<IconButton onClick={() => {}} active={pathname == route.id}>
							{route.icon}
						</IconButton>
					</Link>
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
		</div>
	);
});

export default Ui;
