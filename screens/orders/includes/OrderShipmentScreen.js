import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from "react-native";
import {
  AvenirFormattedMessage,
  DefaultPanel,
  CustomMaterialTextInput,
  NumberFormatTextInput,
  Icon,
  Separator,
  HeaderButton
} from "../../../components";
import { settingsOperations } from "../../../modules/settings";
import Colors from "../../../constants/Colors";
import { connect } from "react-redux";
import Styles from "../../../constants/Styles";
import { withGlobalize } from "react-native-globalize";
import Screens from "../../../constants/Screens";
import { Header } from "react-native-elements";

class OrderShipmentScreen extends React.Component {
  constructor(props) {
    super(props);

    const { params = {} } = this.props.navigation.state;

    this.state = {
      ...params
    };
  }

  _submitForm = () => {
    if (this.state.callback) {
      this.state.callback({
        ...this.state
      });
    }
    this.props.navigation.pop();
  };

  _openBarcodeScanner = ()=>{
    this.props.navigation.navigate(Screens.BarcodeScanner, {callback: (data)=>{
      this.setState({ shipmentTrackingCode: data });
    }})
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          containerStyle={{height: 50, paddingTop: 0}}
          backgroundColor={Colors.mainColor}
          centerComponent={
            <AvenirFormattedMessage
              style={Styles.headerTitleStyle}
              weight="demi"
              message="order_tracking_information"
            />
          }
          rightComponent={
            <HeaderButton label="common_close" onPress= {()=>this.props.navigation.pop()}/>
          }
        />
        <ScrollView style={styles.container}>
          <DefaultPanel containerStyle={styles.topPanel} notitle="true">
            <View style={styles.barcodeContainer}>
              <CustomMaterialTextInput
                label="order_tracking_code"
                onChangeText={text => this.setState({ shipmentTrackingCode: text })}
                value={this.state.shipmentTrackingCode}
                clearButtonMode="while-editing"
                autoFocus
                containerStyle={{marginRight: 30}}
              />
              <TouchableOpacity onPress={this._openBarcodeScanner} style={styles.barcodeButton}>
                <Icon.Ionicons style={styles.barcodeIcon} name="ios-barcode" size={25}/>
              </TouchableOpacity>
            </View>

            <CustomMaterialTextInput
              label="order_shipment_carrier"
              onChangeText={text => this.setState({ shipmentCarrier: text })}
              value={this.state.shipmentCarrier}
              clearButtonMode="while-editing"
            />
            
            <CustomMaterialTextInput
              label="order_shipment_note"
              onChangeText={text => this.setState({ shipmentNote: text })}
              value={this.state.shipmentNote}
              multiline
              clearButtonMode="while-editing"
            />
          </DefaultPanel>
        </ScrollView>
        <View style={styles.bottomPanel}>
          <TouchableOpacity
            style={styles.roundedButton}
            onPress={this._submitForm}
          >
            <AvenirFormattedMessage
              style={styles.roundedButtonLabel}
              weight="demi"
              message="common_save"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
    settingsOperations
  )(OrderShipmentScreen)
);

export default wrappedComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  },
  topPanel: {
    paddingHorizontal: 15,
    backgroundColor: "#fff"
  },
  bottomPanel: {
    backgroundColor: "#fff",
    paddingHorizontal: 15
  },
  roundedButton: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: Colors.mainColor,
    color: "#fff",
    marginTop: 20,
    marginBottom: 20,
    paddingTop: 15,
    paddingBottom: 15
  },
  roundedButtonLabel: {
    fontSize: 16,
    color: "#fff"
  },
  selectOption: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  selectOptionLabel: {
    flex: 1,
    fontSize: 16
  },
  selectOptionIcon: {
    color: Colors.mainColor,
    marginRight: 10
  },
  barcodeContainer:{
  },
  barcodeButton:{
    position: 'absolute',
    right: 0,
    top: 38
  },
  barcodeIcon: {
    color: Colors.mainColor
  }
});
