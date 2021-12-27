import { combineReducers } from "redux";
import { ShopReducerAction } from "./actions/shopAction";
import { UserReducerAction } from "./actions/userAction";
import { shopReducer } from "./reducers/shopReducer";
import { userReducer } from "./reducers/userReducer";

export const rootReducer = combineReducers({
    shop: shopReducer,
    user: userReducer
});

export type StoreStateType = ReturnType<typeof rootReducer>

export type StoreAction = UserReducerAction | ShopReducerAction;