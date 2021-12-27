import { StoreStateType } from "../../store/rootReducer";

export const allProductsStoreEqualityFn = (prevState: StoreStateType, currentState: StoreStateType) => {
    const { shop: prevShop, user: prevUser } = prevState;
    const { shop, user } = currentState;
    return shop.shopProducts === prevShop.shopProducts && shop.productFilters === prevShop.productFilters && user.filters === prevUser.filters
        && user.shopProductsPage === prevUser.shopProductsPage;
}