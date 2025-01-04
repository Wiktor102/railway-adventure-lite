import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./Home/Home";
import Game from "./Game/Game";

// routing
import NamedRoute from "./Router/components/NamedRoute";
import NamedRouter from "./Router/components/NamedRouter";

// components
import TracksMenu from "./Ui/pages/TracksMenu";
import TrackDrawTips from "./Ui/pages/TrackDrawTips/TrackDrawTips";
import RoutesMenu from "./Ui/pages/RoutesMenu/RoutesMenu";
import RouteDetails from "./Ui/pages/RoutesMenu/RouteDetails";
import TrainsMenu from "./Ui/pages/TrainsMenu/TrainsMenu";
import BuyTrain from "./Ui/pages/TrainsMenu/BuyTrain";

function App() {
	return (
		<BrowserRouter basename={window.location.hostname === "wiktorgolicz.pl" ? "/ral" : undefined}>
			<NamedRouter outletNames={["menu-content", "tips"]}>
				<Routes>
					<Route index element={<HomePage />} />
					<Route path="game" element={<Game />}>
						<Route
							path="tracks/*"
							element={<NamedRoute outlets={[{ name: "menu-content", content: <TracksMenu /> }]} />}
						>
							<Route
								path="build/*"
								element={<NamedRoute outlets={[{ name: "tips", content: <TrackDrawTips /> }]} />}
							/>
						</Route>
						<>
							<Route
								path="routes"
								element={<NamedRoute outlets={[{ name: "menu-content", content: <RoutesMenu /> }]} />}
							/>
							<Route
								path="routes/create"
								element={<NamedRoute outlets={[{ name: "menu-content", content: <RouteDetails /> }]} />}
							/>
							<Route
								path="routes/details/:routeId"
								element={<NamedRoute outlets={[{ name: "menu-content", content: <RouteDetails /> }]} />}
							/>
						</>
						<>
							<Route
								path="trains"
								element={<NamedRoute outlets={[{ name: "menu-content", content: <TrainsMenu /> }]} />}
							/>
							<Route
								path="trains/buy/*"
								element={<NamedRoute outlets={[{ name: "menu-content", content: <BuyTrain /> }]} />}
							/>
						</>
					</Route>
				</Routes>
			</NamedRouter>
		</BrowserRouter>
	);
}

export default App;
