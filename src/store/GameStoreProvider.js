import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import PropTypes from "prop-types";

import GameStore from "./GameStore";

const GameStoreContext = createContext();

function GameStoreProvider({ children }) {
	const [store, setStore] = useState(null);
	const [searchParams] = useSearchParams();
	const redirectedRef = useRef(false);
	const navigate = useNavigate();

	useEffect(() => {
		const loadType = searchParams.get("load");

		if (!redirectedRef.current) {
			if (loadType === "new") {
				setStore(new GameStore());
			} else if (loadType === "browser") {
				// If no data in local storage, it behaves as "new"
				setStore(GameStore.loadFromLocalStorage());
			} else if (loadType === "file") {
				GameStore.loadSaveFile()
					.then(store => {
						setStore(store);
					})
					.catch(err => {
						console.error(err);
						navigate("/");
					});
			}
		}

		if (loadType !== "browser") {
			redirectedRef.current = true;
			const url = new URL(window.location.href);
			url.searchParams.set("load", "browser");
			window.history.replaceState(null, "", url.toString()); // So the browser back button skips that change
		}
	}, [searchParams, navigate]);

	useEffect(() => {
		const handler = e => {
			e.preventDefault();
		};

		addEventListener("beforeunload", handler);
		return () => removeEventListener("beforeunload", handler);
	}, []);

	useEffect(
		() => () => {
			if (store) {
				store.dispose();
				setStore(null);
			}
		},
		[store]
	);

	return <GameStoreContext.Provider value={{ store, loading: store == null }}>{children}</GameStoreContext.Provider>;
}

GameStoreProvider.propTypes = {
	children: PropTypes.node.isRequired
};

/**
 * @returns {GameStore}
 */
function useGameStore() {
	const context = useContext(GameStoreContext);

	if (!context) {
		throw new Error("useGameStore must be used within a GameStoreProvider!");
	}

	return context.store;
}

function useIsStoreLoading() {
	const context = useContext(GameStoreContext);

	if (!context) {
		throw new Error("useIsStoreLoading must be used within a GameStoreProvider!");
	}

	return context.loading;
}

export { GameStoreProvider, useGameStore, useIsStoreLoading };
