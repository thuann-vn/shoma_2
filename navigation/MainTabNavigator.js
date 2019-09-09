import React from "react";
import {
  createBottomTabNavigator,
  createSwitchNavigator
}
from "react-navigation";
import {Platform} from 'react-native';
import {
  createStackNavigator,
  TransitionPresets
} from 'react-navigation-stack';

import TabBarIcon from "../components/navigation/TabBarIcon";
import TabBarText from "../components/navigation/TabBarText";
import CategoryRoutes from "./routes/CategoryRoutes";
import CustomerRoutes from "./routes/CustomerRoutes";
import TabBar from "../components/navigation/TabBar";
import screens from "../constants/Screens";
import SettingRoutes from "./routes/SettingRoutes";
import HomeScreen from "../screens/HomeScreen";
import { DEFAULT_NAVIGATION_OPTIONS } from "../constants/Common";
import ProductRoutes from "./routes/ProductRoutes";
import OrderRoutes from "./routes/OrderRoutes";
import ModalRoutes from "./routes/ModalRoutes";
import Screens from "../constants/Screens";

const HomeStack = createStackNavigator(
  {
    [screens.Home]: HomeScreen,
    ...OrderRoutes,
    ...ProductRoutes,
    ...CategoryRoutes,
    ...CustomerRoutes
  },
  {
    ...DEFAULT_NAVIGATION_OPTIONS,
  }
);

HomeStack.navigationOptions = ({ navigation }) => {
  return {
    tabBarVisible: navigation.state.index > 0 ? false : true,
    tabBarLabel: ({ focused }) => <TabBarText focused={focused} label="home" />,
    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="home" />
  };
};

const OrderStack = createStackNavigator({
  ...OrderRoutes,
  ...ProductRoutes,
  ...CategoryRoutes,
  ...CustomerRoutes
},{
  ...DEFAULT_NAVIGATION_OPTIONS
});

OrderStack.navigationOptions = ({ navigation }) => {
  return {
    backTitle: null,
    tabBarVisible: navigation.state.index > 0 ? false : true,
    tabBarLabel: ({ focused }) => (
      <TabBarText focused={focused} label="orders" />
    ),
    tabBarIcon: ({ focused }) => (
      <TabBarIcon focused={focused} name="shopping-bag" />
    )
  };
};

const CustomerStack = createStackNavigator({
  ...CustomerRoutes,
  ...ProductRoutes,
  ...CategoryRoutes,
  ...OrderRoutes
}, {
  ...DEFAULT_NAVIGATION_OPTIONS,
  // initialRouteName: Screens.CustomerDetail,
});

CustomerStack.navigationOptions = ({ navigation }) => {
  return {
    tabBarVisible: navigation.state.index > 0 ? false : true,
    tabBarLabel: ({ focused }) => (
      <TabBarText focused={focused} label="customers" />
    ),
    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="user" />
  };
};

const ProductStack = createStackNavigator({
  ...ProductRoutes,
  ...CustomerRoutes,
  ...CategoryRoutes,
  ...OrderRoutes
}, DEFAULT_NAVIGATION_OPTIONS);

ProductStack.navigationOptions = ({ navigation }) => {
  return {
    headerBackTitle: "",
    tabBarVisible: navigation.state.index > 0 ? false : true,
    tabBarLabel: ({ focused }) => (
      <TabBarText focused={focused} label="products" />
    ),
    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="tag" />
  };
};


const SettingStack = createStackNavigator(
  {
    ...SettingRoutes
  },
  {
    ...DEFAULT_NAVIGATION_OPTIONS,
  }
);

SettingStack.navigationOptions = ({ navigation }) => {
  return {
    tabBarVisible: navigation.state.index > 0 ? false : true,
    tabBarLabel: ({ focused }) => <TabBarText focused={focused} label="settings" />,
    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="settings" />
  };
};


const BottomTabNavigator = createBottomTabNavigator(
  {
    HomeStack,
    OrderStack,
    ProductStack,
    CustomerStack,
    SettingStack
  },
  {
    initialRouteName: 'HomeStack',
    tabBarComponent: TabBar,
  }
);

export const ModalNavigator = createSwitchNavigator({
  ...ModalRoutes,
},
{
  headerMode: 'float',
  ...DEFAULT_NAVIGATION_OPTIONS
});

export const MainNavigator = createStackNavigator({
    BottomTabNavigator,
    ModalNavigator
  },
  {
    headerMode: 'none',
    defaultNavigationOptions: {
      ...Platform.OS == 'ios' ? TransitionPresets.ModalPresentationIOS : TransitionPresets.RevealFromBottomAndroid,
      cardOverlayEnabled: true,
      gestureEnabled: false,
  }
});

