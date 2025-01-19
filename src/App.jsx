import { BrowserRouter, Route, Routes } from "react-router";
import { lazy } from "react";
import HomePage from "./Home/Home";
import Game from "./Game/Game";

// not lazy-loaded components
import { GameStoreProvider } from "./store/GameStoreProvider";
import PassengerMenu from "./Ui/pages/PassengerMenu/PassengerMenu";

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
			<Routes>
				<Route index element={<HomePage />} />
				<Route
					path="game"
					element={
						<GameStoreProvider>
							<Game />
						</GameStoreProvider>
					}
				>
					<Route path="tracks/*" element={<TracksMenu />}>
						<Route path="build/*" />
					</Route>
					<>
						<Route path="routes" element={<RoutesMenu />} />
						<Route path="routes/create" element={<RouteDetails />} />
						<Route path="routes/details/:routeId" element={<RouteDetails />} />
					</>
					<>
						<Route path="trains" element={<TrainsMenu />} />
						<Route path="trains/:trainId/assign-route" element={<AssignRoute />} />
						<Route path="trains/buy/*" element={<BuyTrain />} />
					</>
					<>
						<Route path="passengers/*" element={<PassengerMenu />} />
					</>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
