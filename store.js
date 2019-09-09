import { persistStore } from "redux-persist";
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./modules";
import { firebaseSyncMiddleware } from "./utils/syncHelper";

const enhancer = compose(
  applyMiddleware(thunk, firebaseSyncMiddleware),
  // devToolsEnhancer({ realtime: true })
);

const configureStore = () => {
  const store = createStore(reducer, undefined, enhancer);

  const persistor = persistStore(store);

  // persistor.purge();
  return { persistor, store };
};

export const { persistor, store } = configureStore();
