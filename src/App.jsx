import { BrowserRouter, NavLink, Route, Routes } from "react-router";
import HomePage from "./Home/Home";
import Game from "./Game/Game";
import GameStore from "./store/GameStore";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<HomePage />} />
				<Route path="game" element={<Game />}>
					{GameStore.MENU_ROUTES.map(route => (
						<Route path={route.id} element={route.element} key={route.id} />
					))}
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
