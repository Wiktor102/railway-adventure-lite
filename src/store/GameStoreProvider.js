import React, { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";

import GameStore from "./GameStore";

const GameStoreContext = createContext();

function GameStoreProvider({ children }) {
	const store = useMemo(() => new GameStore(), []);

	return <GameStoreContext.Provider value={store}>{children}</GameStoreContext.Provider>;
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

	return context;
}

export { GameStoreProvider, useGameStore };
