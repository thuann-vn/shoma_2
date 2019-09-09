import { Dimensions } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { Platform } from '@unimodules/core';
import { Header } from 'react-navigation';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const isX = isIphoneX();

export default {
  isIOS: Platform.OS == 'ios',
  window: {
    width,
    height,
  },
  headerHeight: Header.HEIGHT + 50,
  isSmallDevice: width < 375,
  bottomOffset: 83,
  isIphoneX: isX,
  bottomOffsetWithoutNav: isX ? 28 : 10
};
