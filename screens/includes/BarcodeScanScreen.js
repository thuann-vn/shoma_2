import React from "react";
import { StyleSheet, View } from "react-native";
import { AvenirFormattedMessage, AvenirText, HeaderButton } from "../../components";
import { connect } from "react-redux";
import Styles from "../../constants/Styles";
import { withGlobalize } from "react-native-globalize";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as Permissions from 'expo-permissions';
import BarcodeMask from 'react-native-barcode-mask';
import { Header } from "react-native-elements";
import Colors from "../../constants/Colors";

class BarcodeScannerScreen extends React.Component {
  constructor(props) {
    super(props);

    const { params = {} } = this.props.navigation.state;
    
    this.state = {
      hasCameraPermission: null,
      callback: params.callback
    };
  }

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted"
    });
  };

  _handleBarCodeScanned = ({ data }) => {
    this.setState({ scanned: true });
    if(this.state.callback){
        this.state.callback(data);
    }
    this.props.navigation.pop();
  };

  render() {
    const { hasCameraPermission, scanned } = this.state;
    return (
      <View style={{flex: 1}}>
        <Header
          containerStyle={{ height: 50, paddingTop: 0, borderBottomWidth: 0 }}
          backgroundColor={Colors.mainColor}
          centerComponent={
            <AvenirFormattedMessage
              style={Styles.headerTitleStyle}
              weight="demi"
              message="barcode_scanner_title"
            />
          }
          rightComponent={
            <HeaderButton label="common_close" onPress= {()=>this.props.navigation.pop()}/>
          }
        />
        <View style={styles.container}>
          {hasCameraPermission === null ? (
            <AvenirText>Requesting for camera permission</AvenirText>
          ) : hasCameraPermission === false ? (
            <AvenirText>Camera permission is not granted</AvenirText>
          ) : (
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : this._handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
          )}
          {
              !scanned && hasCameraPermission && (<BarcodeMask/>)
          }
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    settings: state.settings
  };
};

const wrappedComponent = withGlobalize(
  connect(
    mapStateToProps,
    // settingsOperations
  )(BarcodeScannerScreen)
);

export default wrappedComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center"
  }
});
