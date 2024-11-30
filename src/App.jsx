import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./Home/Home";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<HomePage />} />
				<Route path="game" element={<h1>Game</h1>} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
