import ProductListScreen from "../../screens/products/ProductListScreen";
import ProductDetailScreen from "../../screens/products/ProductDetailScreen";
import ProductMainScreen from "../../screens/products/ProductMainScreen";
import ProductOverviewScreen from "../../screens/products/ProductOverviewScreen";
import Screens from '../../constants/Screens';

export default ProductRoutes = {
    [Screens.ProductMain]: ProductMainScreen,
    [Screens.ProductList]: ProductListScreen,
    [Screens.ProductOverview]: ProductOverviewScreen,
    [Screens.ProductDetail]: ProductDetailScreen,
}

