import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  View,
  StyleSheet
} from 'react-native';
import { connect } from "react-redux";
import { SettingServices } from '../services/setting';
import firebase from '../services/firebase';
import Colors from '../constants/Colors';
import Screens from '../constants/Screens';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSignedIn : this.props.settings.isSignedIn,
      isFirstLaunch: this.props.settings.isFirstLaunch
    }

    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    if (!this.state.isSignedIn) {
      //Navigate to auth if not logged in
      return this.props.navigation.navigate("Auth");
    }

    //Check if first launch wizard not finished
    if (this.state.isFirstLaunch){
      return this.props.navigation.navigate(Screens.WizardCurrency);
    }

    //Navigate to auth if not logged in
    this.props.navigation.navigate('Main');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={[StyleSheet.absoluteFillObject, {alignContent: 'center', alignItems: 'center', justifyContent: 'center'}]}>
        <ActivityIndicator color={Colors.mainColor} size="large"/>
        <StatusBar barStyle="default"/>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    settings: state.settings,
  };
};
export default connect(
  mapStateToProps,
  null
)(AuthLoadingScreen);
