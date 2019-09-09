// @flow
'use strict';
import {
    Platform,
    StatusBar,
    Dimensions
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';

export const statusBarHeight = Platform.OS === 'ios' ? (isIphoneX() ? 44 : 20) : 44;
export const headerHeight = Platform.OS === 'ios' ? 56 : 56;
export const paddingBottomHeight = Platform.OS === 'ios' ? (isIphoneX() ? 28 : 28) : 0;

export const SafeAreaWithHeader = {
    vh: (Dimensions.get('window').height - statusBarHeight - headerHeight - paddingBottomHeight) / 100,
    vw: Dimensions.get('window').width / 100
};