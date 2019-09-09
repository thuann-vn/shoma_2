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
  CustomButtonGroup,
  NumberFormatTextInput,
  HeaderButton
} from "../../../components";
import { settingsOperations } from "../../../modules/settings";
import Colors from "../../../constants/Colors";
import { connect } from "react-redux";
import Styles from "../../../constants/Styles";
import { OrderDiscountTypes } from "../../../constants/Orders";
import { formatMessage } from "../../../utils/format";
import { withGlobalize } from "react-native-globalize";
import { getCurrencySetting } from "../../../utils/commonHelper";
import { Header } from "react-native-elements";

class OrderDiscountScreen extends React.Component {
  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;

    this.state = {
      callback: params ? params.callback : null,
      value: params && params.value ? params.value : 0,
      maxValue: params && params.maxValue ? params.maxValue : 0,
      reason: params && params.reason ? params.reason : '',
      discountType: params && params.type == OrderDiscountTypes.percent ? 1 : 0,
      discountTypes: [formatMessage(this.props.globalize, 'order_discount_type_value'), formatMessage(this.props.globalize, 'order_discount_type_percent')],
    };
  }

  _submitForm = () =>{
      if(this.state.callback){
        this.state.callback({
          type:
            this.state.discountType == 1
              ? OrderDiscountTypes.percent
              : OrderDiscountTypes.value,
          value: this.state.value || 0,
          reason: this.state.reason
        });
      }
      this.props.navigation.pop();
  }

  _changeValue = (value) => {
    if(this.state.discountType == 1 && value > 100){
      value = 100
    }else if(value > this.state.maxValue){
      value = this.state.maxValue
    }
    this.setState({ value: value })
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
              message="order_add_discount"
            />
          }
          rightComponent={
            <HeaderButton label="common_close" onPress= {()=>this.props.navigation.pop()}/>
          }
        />
        <ScrollView style={styles.container}>
          <DefaultPanel containerStyle={styles.topPanel} notitle="true">
            <CustomButtonGroup
              onPress={index => {
                this.setState({ discountType: index, value: 0 });
              }}
              selectedIndex={this.state.discountType}
              buttons={this.state.discountTypes}
              style={{ width: "80%" }}
              textStyle={{ fontSize: 14 }}
              buttonStyle={{ backgroundColor: "rgba(255,255,255,.8)" }}
              containerStyle={{ height: 32 }}
            />

            <NumberFormatTextInput
              label={
                this.state.discountType == 1
                  ? "order_discount_value_percent"
                  : "order_discount_value"
              }
              currency={
                this.state.discountType != 1
                  ? getCurrencySetting(this.props.settings.currency).symbol
                  : null
              }
              suffix={this.state.discountType == 1 ? "%" : null}
              onValueChange={value => this._changeValue(value.floatValue)}
              value={this.state.value}
              autoFocus={true}
            />

            <CustomMaterialTextInput
              label="order_discount_reason"
              onChangeText={text => this.setState({ reason: text })}
              value={this.state.reason}
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

const wrappedComponent = withGlobalize(connect(
    mapStateToProps,
    settingsOperations
  )(OrderDiscountScreen));
export default wrappedComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  },
  topPanel: {
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  bottomPanel: {
    backgroundColor: "#fff",
    paddingHorizontal: 15
  },
  roundedButton: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: Colors.mainColor,
    color: '#fff',
    marginTop: 20,
    marginBottom: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  roundedButtonLabel: {
    fontSize: 16,
    color: '#fff'
  }
});
