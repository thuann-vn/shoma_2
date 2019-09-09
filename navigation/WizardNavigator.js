import {
    createAppContainer, createSwitchNavigator
} from 'react-navigation';

import {
    createStackNavigator,
    TransitionPresets
} from 'react-navigation-stack';

import Screens from '../constants/Screens';
import WizardCurrencyScreen from '../screens/wizard/WizardCurrencyScreen';
import WizardNotificationScreen from '../screens/wizard/WizardNotificationScreen';
import WizardAccountScreen from "../screens/wizard/WizardAccountScreen";
import WizardBackupScreen from "../screens/wizard/WizardBackupScreen";
import ModalRoutes from './routes/ModalRoutes';
import { DEFAULT_NAVIGATION_OPTIONS } from '../constants/Common';

const WizardStackNavigator =  createStackNavigator({
    [Screens.WizardCurrency]: WizardCurrencyScreen,
    [Screens.WizardNotification]: WizardNotificationScreen,
    [Screens.WizardAccount]: WizardAccountScreen,
    [Screens.WizardBackup]: WizardBackupScreen,
}, {
     ...DEFAULT_NAVIGATION_OPTIONS
});

const ModalNavigator = createSwitchNavigator({
    ...ModalRoutes,
});

export default createStackNavigator({
    WizardStackNavigator,
    ModalNavigator
}, {
    headerMode: 'none',
    defaultNavigationOptions: {
        ...TransitionPresets.ModalPresentationIOS,
        cardOverlayEnabled: true,
        gestureEnabled: true,
    }
});