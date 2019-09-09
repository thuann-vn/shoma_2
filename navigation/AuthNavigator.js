import {
    createStackNavigator,
    TransitionPresets
} from 'react-navigation-stack';
import AuthRoutes from './routes/AuthRoutes';
import { DEFAULT_NAVIGATION_OPTIONS } from '../constants/Common';

export const AuthNavigator = createStackNavigator({
 ...AuthRoutes,
}, {
    ...DEFAULT_NAVIGATION_OPTIONS
});