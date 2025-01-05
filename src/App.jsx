import { BrowserRouter, Route, Routes } from "react-router";
import { lazy } from "react";
import HomePage from "./Home/Home";
import Game from "./Game/Game";

// routing
import NamedRoute from "./Router/components/NamedRoute";
import NamedRouter from "./Router/components/NamedRouter";

// not lazy-loaded components
import TrackDrawTips from "./Ui/pages/TrackDrawTips/TrackDrawTips";

// lazy loaded components
const TracksMenu = lazy(() => import("./Ui/pages/TracksMenu"));
const RoutesMenu = lazy(() => import("./Ui/pages/RoutesMenu/RoutesMenu"));
const RouteDetails = lazy(() => import("./Ui/pages/RoutesMenu/RouteDetails"));
const TrainsMenu = lazy(() => import("./Ui/pages/TrainsMenu/TrainsMenu"));
const BuyTrain = lazy(() => import("./Ui/pages/TrainsMenu/BuyTrain"));
const AssignRoute = lazy(() => import("./Ui/pages/TrainsMenu/AssignRoute"));

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
								path="trains/:trainId/assign-route"
								element={<NamedRoute outlets={[{ name: "menu-content", content: <AssignRoute /> }]} />}
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
