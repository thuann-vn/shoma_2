import BarcodeScanScreen from "../../screens/includes/BarcodeScanScreen";
import ProductDetailScreen from "../../screens/products/ProductDetailScreen";
import CustomerDetailScreen from "../../screens/customers/CustomerDetailScreen";
import OrderDiscountScreen from "../../screens/orders/includes/OrderDiscountScreen";
import OrderShippingFeeScreen from "../../screens/orders/includes/OrderShippingFeeScreen";
import OrderShipmentScreen from "../../screens/orders/includes/OrderShipmentScreen";
import OrderShippingAddressScreen from "../../screens/orders/includes/OrderShippingAddressScreen";
import CurrencyPickerScreen from "../../screens/includes/CurrencyPickerScreen";
import DateFormatPickerScreen from "../../screens/includes/DateFormatPickerScreen";
import PickerScreen from '../../screens/includes/PickerScreen';
import PinCodeScreen from '../../screens/includes/PinCodeScreen';
import Screens from '../../constants/Screens';
import { createStackNavigator, TransitionPresets } from "react-navigation-stack";

const ShipmentStackNavigation = createStackNavigator({
    [Screens.OrderShipmentSetting]: OrderShipmentScreen,
    [Screens.BarcodeScanner]: BarcodeScanScreen,
},
{
    headerMode: 'none',
})

export default ModalRoutes = {
    ShipmentStackNavigation,

    [Screens.OrderShippingAddressScreen]: OrderShippingAddressScreen,
    [Screens.ProductDetailModal]: ProductDetailScreen,
    [Screens.CustomerDetail]: CustomerDetailScreen,

    [Screens.OrderDiscountSetting]: OrderDiscountScreen,
    [Screens.OrderShippingSetting]: OrderShippingFeeScreen,
    [Screens.CurrencyPicker]: CurrencyPickerScreen,
    [Screens.DateFormatPicker]: DateFormatPickerScreen,
    [Screens.Picker]: PickerScreen,
    [Screens.PinCode]: PinCodeScreen,
}

