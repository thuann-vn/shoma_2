import CustomerListScreen from "../../screens/customers/CustomerListScreen";
import CustomerDetailScreen from "../../screens/customers/CustomerDetailScreen";
import CustomerOverviewScreen from "../../screens/customers/CustomerOverviewScreen";
import Screens from '../../constants/Screens';

export default CustomerRoutes = {
    [Screens.CustomerList]: CustomerListScreen,
    [Screens.CustomerOverview]: CustomerOverviewScreen,
    [Screens.CustomerDetail]: CustomerDetailScreen,
}

export const CustomerModalRoutes = {
    [Screens.CustomerDetail]: CustomerDetailScreen,
}
