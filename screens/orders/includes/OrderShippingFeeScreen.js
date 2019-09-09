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
import { getCurrencySetting } from "../../../utils/commonHelper";
import Collapsible from "react-native-collapsible";
import { Header } from "react-native-elements";

class OrderShippingFeeScreen extends React.Component {
  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;

    const value = (params && params.value) || 0;

    this.state = {
      callback: params ? params.callback : null,
      isFree: value <= 0,
      value: value,
      note: params && params.note ? params.note : ""
    };
  }

  _submitForm = () => {
    if (this.state.callback) {
      this.state.callback({
        value: (this.state.isFree ? 0 : this.state.value) || 0,
        note: this.state.note
      });
    }
    this.props.navigation.pop();
  };

  _changeValue = value => {
    if (this.state.discountType == 1 && value > 100) {
      value = "100";
    } else if (value > this.state.maxValue) {
      value = this.state.maxValue;
    }
    this.setState({ value: value });
  };

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
              message="order_add_shipping"
            />
          }
          rightComponent={
            <HeaderButton label="common_close" onPress= {()=>this.props.navigation.pop()}/>
          }
        />
        <ScrollView style={styles.container}>
          <DefaultPanel containerStyle={styles.topPanel} notitle="true">
            <TouchableOpacity
              style={styles.selectOption}
              onPress={() => {
                this.setState({ isFree: true });
              }}
            >
              <Icon.Ionicons
                style={styles.selectOptionIcon}
                name={
                  this.state.isFree
                    ? "ios-checkmark-circle"
                    : "ios-checkmark-circle-outline"
                }
                size={24}
              />
              <AvenirFormattedMessage
                style={styles.selectOptionLabel}
                message="order_shipping_free"
              />
              <Separator left={0}/>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.selectOption}
              onPress={() => {
                this.setState({ isFree: false });
                this.inputElem.focus()
              }}
            >
              <Icon.Ionicons
                style={styles.selectOptionIcon}
                name={
                  !this.state.isFree
                    ? "ios-checkmark-circle"
                    : "ios-checkmark-circle-outline"
                }
                size={24}
              />
              <AvenirFormattedMessage
                style={styles.selectOptionLabel}
                message="order_shipping_enter"
              />
            </TouchableOpacity>

            <Collapsible collapsed={this.state.isFree}>
              <View>
                <NumberFormatTextInput
                  label="order_shipping_fee"
                  currency={
                    this.state.discountType != 1
                      ? getCurrencySetting(this.props.settings.currency).symbol
                      : null
                  }
                  onValueChange={value => this._changeValue(value.floatValue)}
                  value={this.state.value}
                  onRef = {(el) => this.inputElem = el}
                />

                <CustomMaterialTextInput
                  label="order_shipping_note"
                  onChangeText={text => this.setState({ note: text })}
                  value={this.state.note}
                  multiline
                  clearButtonMode="while-editing"
                />
              </View>
            </Collapsible>
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
  )(OrderShippingFeeScreen)
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
  }
});
