// components
import { ElevatedLinkButton } from "../../common/ElevatedButton/ElevatedButton";

// styles
import style from "./TrainsMenu.component.scss";

const TrainsMenu = () => {
	return (
		<>
			<h2>Trains</h2>
			<div className="trains-menu" data-style={style}>
				<ElevatedLinkButton to="buy/locomotive">
					<i className="fas fa-cart-shopping"></i> Kup pociąg
				</ElevatedLinkButton>
			</div>
		</>
	);
};

export default TrainsMenu;
