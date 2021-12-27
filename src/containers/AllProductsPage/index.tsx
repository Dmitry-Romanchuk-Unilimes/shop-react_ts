import React, { Dispatch, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AllProductsSideBar } from '../../components/AllProductsSideBar';
import Pagination from '../../components/Pagination';
import { ProductCard } from '../../components/ProductCard';
import ShopAction from '../../store/actions/shopAction';
import UserAction from '../../store/actions/userAction';
import { ProductFilters } from '../../store/reducers/shopReducer';
import { ProductPurchase } from '../../store/reducers/userReducer';
import { StoreAction, StoreStateType } from '../../store/rootReducer';
import { AllProductsPageProps } from './interface';
import './style.css';
import { allProductsStoreEqualityFn } from './utils';

const AllProductsPage: React.FC<AllProductsPageProps> = () => {
    const { shop, user } = useSelector<StoreStateType, StoreStateType>((state) => state, allProductsStoreEqualityFn);
    const dispatch = useDispatch<Dispatch<StoreAction>>();
    const { shopProducts, productFilters } = shop;
    const { filters: userFilters, shopProductsPage: userSelectedPage } = user;
    const { fetchShopProductsAndFilters } = new ShopAction();
    const { updateUserFilters, updateUserShopProductsPage, addToCart } = new UserAction();

    useEffect(() => {
        if (!shopProducts.products.length) {
            dispatch(fetchShopProductsAndFilters());
        }
    }, []);

    const handleAddToCart = (productPurchase: ProductPurchase) => {
        dispatch(addToCart(productPurchase))
    }

    const renderAllProducts = () => {
        return shopProducts.products.map((product) => {
            return (
                <div key={product.id} className="product-item-container">
                    <ProductCard
                        product={product}
                        addToCart={handleAddToCart}
                    />
                </div>
            );
        })
    }

    const handlePageChange = (selectedPage: number) => {
        if (userSelectedPage !== selectedPage) dispatch(updateUserShopProductsPage(selectedPage));
    }

    const handleUpdateUserFilters = useCallback((filters: ProductFilters) => {
        dispatch(updateUserFilters(filters));
    }, []);

    console.log('AllProduct Render');

    return (
        <div className="all-products-page-container">
            <AllProductsSideBar onUpdateUserFilters={handleUpdateUserFilters} userFilters={userFilters} productFilters={productFilters} />
            <div className="all-products-container">
                <div className="all-products">
                    {renderAllProducts()}
                </div>
                <Pagination overrideSelectedPage={userSelectedPage} onChange={handlePageChange} numberOfPages={shopProducts.totalPages} />
            </div>
        </div>
    )
}


export default AllProductsPage;