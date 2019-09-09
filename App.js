
import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  AppState,
  NetInfo,
  Alert,
  YellowBox
} from 'react-native';
import { AppLoading} from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font'
import * as Amplitude from 'expo-analytics-amplitude';
import * as Icon from '@expo/vector-icons';
import AppNavigator from './navigation/AppNavigator';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { FormattedProvider, Globalize  } from 'react-native-globalize';
import { store, persistor } from './store';
import Colors from './constants/Colors';
import firebase from './services/firebase';
import ApiKeys from './constants/ApiKeys';
import Images from './constants/Images';
import R from 'ramda';
import { Messages } from './globalize/messages';
import { LogEvents } from './constants/Common';
import { logToAmplitude } from './utils/logHelper';
import { NavigationActions } from "@react-navigation/core";
import {
  ActionSheetProvider,
}
from '@expo/react-native-action-sheet';
import { useScreens } from 'react-native-screens';
useScreens();

import Sentry from 'sentry-expo';
import { SyncServices } from './services/sync';
import { syncDataAndListen } from './utils/syncHelper';
import Screens from './constants/Screens';

console.disableYellowBox = true;
YellowBox.ignoreWarnings(["UIManager['getConstants']"]);
YellowBox.ignoreWarnings(['ReactNative.NativeModules.LottieAnimationView'])

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default class App extends React.Component {
  constructor(props){
    super(props);
    const storeState = store.getState();
    const {
      settings
    } = storeState;

    this.state = {
      firebaseReady: false,
      appState: AppState.currentState,
      isLoadingComplete: false,
      language: settings.language || 'vi',
      currency: settings.currency || 'VND',
      trackingEnabled: settings.trackingEnabled,
      pinCodeEnabled: settings.pinCodeEnabled,
      userId: settings.user ? settings.user.uid : null
    };

    //Init Amplitude
    Amplitude.initialize(ApiKeys.AmplitudeKey);
    if(settings.user){
      Amplitude.setUserId(settings.user.uid);
    }

    //Log to amplitude
    logToAmplitude(LogEvents.OpenApp, null, settings.trackingEnabled, settings.user ? settings.user.uid : null);

    // Listen for authentication state to change.
    firebase.auth().onAuthStateChanged((user) => {
      let updateState = {}
      if (user != null) {
        Amplitude.setUserId(user.uid);
        Sentry.setUserContext({
          userId: user.uid,
          email: user.email,
          fullName: user.displayName
        })

        if (this.state.userId != user.uid) {
          updateState.userId = user.uid;
        }

        //Start sync data
        syncDataAndListen(store);
      } else {
        if (this.state.userId) {
          updateState.userId = null;
        }
      }

      this.setState(updateState);
    });

    //Call subscribe store
    this._subscribeStore();

    //Check connection
    NetInfo.isConnected.fetch().then(isConnected => {
      if (!isConnected) {
        this._alertInternetError();
      }
    });
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectivityChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectivityChange);
  }

  //Handle connectivity changed
  _handleConnectivityChange = isConnected => {
    if (!isConnected){
      this._alertInternetError();
    }
  }

  _alertInternetError = () => {
    let options = [
      {
        text: 'Retry',
        onPress: () => {
          NetInfo.isConnected.fetch().then(isConnected => {
            if (!isConnected) {
              this._alertInternetError();
            }
          });
        }
      }
    ];

    Alert.alert('No internet connection', 'You need to have Mobile Data or Wifi to continue use application.', options, {
      'cancelable': false
    });
  }

  //Check if open pincode
  _checkPincodeScreen = () => {
    if (this.state.pinCodeEnabled) {
      this.navigatorRef.dispatch(
        NavigationActions.navigate({
          routeName: Screens.PinCode
        })
      );
    }
  }

  //Check app state changed
  _handleAppStateChange = (nextAppState) => {
    if(nextAppState.match(/inactive|background/)){
      this._checkPincodeScreen();
    }else{
      //Open app log
      logToAmplitude(LogEvents.OpenApp, null, this.state.trackingEnabled, this.state.userId);
    }
    if (this.state.appState != nextAppState){
      this.setState({
        appState: nextAppState
      });
    }
  };

  //Check store change
  _subscribeStore = ()=>{
    store.subscribe(() => {
      const {
        settings
      } = store.getState();
     
      if (settings.language != this.state.language) {
        this.setState({ language: settings.language });
      }

      if (settings.currency != this.state.currency) {
        this.setState({ currency: settings.currency });
      }

      if (settings.pinCodeEnabled != this.state.pinCodeEnabled) {
        this.setState({
          pinCodeEnabled: settings.pinCodeEnabled
        });
      }
    });
  }

  //Init navigation
  _initNavigationRef = (navigatorRef)=>{
    this.navigatorRef = navigatorRef;
    this._checkPincodeScreen();
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === "ios" ? (
            <StatusBar barStyle="light-content" />
          ) : (
            <StatusBar
              barStyle="light-content"
              backgroundColor={Colors.mainColor}
            />
          )}
          <ActionSheetProvider>
            <FormattedProvider
              locale={this.state.language}
              currency={this.state.currency}
              messages={Messages}
              warnOnMissingMessage={false}
            >
              <Provider store={store}>
                <PersistGate persistor={persistor}>
                  <AppNavigator ref={this._initNavigationRef} />
                </PersistGate>
              </Provider>
            </FormattedProvider>
          </ActionSheetProvider>
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    const imageAssets = cacheImages([
      ...R.values(Images),
    ]);
    return Promise.all([
      ...imageAssets,
      Asset.loadAsync([
        Images.welcomeBackground,
        //Images
        require('./assets/images/default_avatar.png'),
        require('./assets/images/empty_calendar.png'),
        require('./assets/images/empty_transaction.png'),        
      ]),
      Font.loadAsync({
        ...Icon.Ionicons.font,
        ...Icon.MaterialIcons.font,
        'avenir-next': require('./assets/fonts/AvenirNextRoundedRegular.otf'),
        'avenir-next-demi': require('./assets/fonts/AvenirNextRoundedDemiBold.otf'),
      }),
      Globalize.load([require('./globalize/currencies.json')])
    ]);
  };
  

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    // console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  },
});
