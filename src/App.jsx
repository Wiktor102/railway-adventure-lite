import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./Home/Home";
import Game from "./Game/Game";
import GameStore from "./store/GameStore";
import NamedRoute from "./utils/NamedRoute";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<HomePage />} />
				<Route path="game" element={<Game />}>
					{GameStore.MENU_ROUTES.map(route => (
						<Route
							path={`${route.id}/*`}
							element={
								<NamedRoute
									outlets={[
										{ name: "menu-content", content: route.element },
										...(route.tips ? [{ name: "tips", content: route.tips }] : [])
									]}
								/>
							}
							key={route.id}
						/>
					))}
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
