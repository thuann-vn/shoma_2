import OrderListScreen from "../../screens/orders/OrderListScreen";
import OrderFilterListScreen from "../../screens/orders/OrderFilterListScreen";
import OrderAllListScreen from "../../screens/orders/OrderAllListScreen";
import OrderDraftListScreen from "../../screens/orders/OrderDraftListScreen";
import OrderViewScreen from "../../screens/orders/OrderViewScreen";
import OrderDetailScreen from "../../screens/orders/OrderDetailScreen";
import Screens from '../../constants/Screens';

export default OrderRoutes = {
    [Screens.OrderList]: OrderListScreen,
    [Screens.OrderAllList]: OrderAllListScreen,
    [Screens.OrderFilterList]: OrderFilterListScreen,
    [Screens.OrderDraftList]: OrderDraftListScreen,
    [Screens.OrderView]: OrderViewScreen,
    [Screens.OrderDetail]: OrderDetailScreen,
}
