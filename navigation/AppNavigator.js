import {
  createSwitchNavigator
} from '@react-navigation/core';
import {
  createAppContainer
} from '@react-navigation/native';

import {
  MainNavigator
} from './MainTabNavigator';

import {
  AuthNavigator
}
from "./AuthNavigator";

import WizardNavigator from "./WizardNavigator";
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import WizardRestoreScreen from '../screens/wizard/WizardRestoreScreen';
import Screens from '../constants/Screens';
const AppSwitchNavigator = createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  [Screens.WizardRestore]: WizardRestoreScreen,
  Main: MainNavigator,
  Wizard: WizardNavigator,
  Auth: AuthNavigator,
}, {
  initialRouteName: 'AuthLoading',
});
export default createAppContainer(AppSwitchNavigator);