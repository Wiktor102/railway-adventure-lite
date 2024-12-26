import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./Home/Home";
import Game from "./Game/Game";

// routing
import routes from "./Router/Routes";
import NamedRoute from "./Router/components/NamedRoute";
import NamedRouter from "./Router/components/NamedRouter";

function App() {
	return (
		<BrowserRouter>
			<NamedRouter outletNames={["menu-content", "tips"]}>
				<Routes>
					<Route index element={<HomePage />} />
					<Route path="game" element={<Game />}>
						{routes.map(route => (
							<Route
								path={`${route.id}/*`}
								element={<NamedRoute outlets={[{ name: "menu-content", content: route.element }]} />}
								key={route.id}
							>
								{route.id === "tracks" && (
									<Route
										path="build/*"
										element={<NamedRoute outlets={[{ name: "tips", content: route.tips }]} />}
									/>
								)}
							</Route>
						))}
					</Route>
				</Routes>
			</NamedRouter>
		</BrowserRouter>
	);
}

export default App;
