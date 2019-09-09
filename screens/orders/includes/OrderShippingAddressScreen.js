import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import {
  DefaultPanel,
  AvenirFormattedMessage,
  CustomMaterialTextInput,
  HeaderButton
} from '../../../components';
import { connect } from 'react-redux';
import Colors from '../../../constants/Colors';
import Styles from '../../../constants/Styles';
import { withGlobalize } from 'react-native-globalize';
import Layout from '../../../constants/Layout';
import { customersOperations } from '../../../modules/customers';
import { Header } from 'react-native-elements';

class OrderShippingAddressScreen extends React.Component {
  constructor(props) {
    super(props);
    this.inputs= {};

    let { params = {} } = this.props.navigation.state;

    this.state = {
      ...params
    }
  }

  //Validate
  _validateForm = () => {
    if (!this.state.name) {
      this.setState({
        errors: {
          name: formatMessage(this.props.globalize, 'customer_name_required')
        }
      })
      return false;
    }
    return true;
  };

  //Submit
  _submitForm = async () => {
    if(!this._validateForm()){
      return;
    }
    this.state.callback && this.state.callback(this.state);
    this.props.navigation.pop();
  }

  render() {
    let {
      errors = {}
    } = this.state;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={styles.masterContainer}
          behavior={Layout.isIOS ? "padding" : null}
          enabled={Layout.isIphoneX}
        >
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

            <View style={styles.section}>
              <AvenirFormattedMessage
                style={styles.sectionTitle}
                weight="demi"
                message="customer_shipping_info"
              />
              <CustomMaterialTextInput
                label="customer_name"
                onChangeText={text => this.setState({ name: text })}
                value={this.state.name}
                autoFocus={true}
                clearButtonMode="while-editing"
                returnKey = "next"
                textContentType="name"
                onSubmitEditing = {
                  () => {
                    this.inputs.phoneNumber.focus();
                  }
                }
                error={errors.name}
              />
              <CustomMaterialTextInput
                label="customer_phone"
                onChangeText={text => this.setState({ phoneNumber: text })}
                value={this.state.phoneNumber}
                clearButtonMode="while-editing"
                keyboardType = "phone-pad"
                returnKey = "next"
                textContentType="telephoneNumber"
                error={errors.phoneNumber}
                onRef={input => {this.inputs.phoneNumber = input;}}
                onSubmitEditing = {
                  () => {
                    this.inputs.email.focus();
                  }
                }
              />
              <CustomMaterialTextInput
                label="customer_email"
                onChangeText={text => this.setState({ email: text })}
                value={this.state.email}
                clearButtonMode="while-editing"
                keyboardType = "email-address"
                textContentType="emailAddress"
                autoCapitalize="none"
                returnKey = "next"
                error={errors.email}
                onRef={input => {
                  this.inputs.email = input;
                }
                }
                onSubmitEditing = {
                  () => {
                    this.inputs.company.focus();
                  }
                }
              />
            </View>
              <View style={styles.section}>
                <AvenirFormattedMessage
                  style={styles.sectionTitle}
                  weight="demi"
                  message="customer_addresses"
                />
                <CustomMaterialTextInput
                  label="customer_shipping_company"
                  onChangeText={text => this.setState({ company: text })}
                  value={this.state.company}
                  clearButtonMode = "while-editing"
                  textContentType="organizationName"
                  returnKey = "next"
                  error={errors.company}
                  onRef={input => {
                    this.inputs.company = input;
                  }
                  }
                  onSubmitEditing = {
                    () => {
                      this.inputs.address.focus();
                    }
                  }
                />
                <CustomMaterialTextInput
                  label="customer_shipping_address"
                  onChangeText={text => this.setState({ address: text })}
                  value={this.state.address}
                  clearButtonMode = "while-editing"
                  textContentType="streetAddressLine1"
                  returnKey = "next"
                  error={errors.address}
                  onRef={input => {
                    this.inputs.address = input;
                  }
                  }
                  onSubmitEditing = {
                    () => {
                      this.inputs.address2.focus();
                    }
                  }
                />
                <CustomMaterialTextInput
                  label="customer_shipping_address2"
                  onChangeText={text => this.setState({ address2: text })}
                  value={this.state.address2}
                  clearButtonMode = "while-editing"
                  textContentType="streetAddressLine2"
                  returnKey = "next"
                  error={errors.address2}
                  onRef={input => {
                    this.inputs.address2 = input;
                  }
                  }
                  onSubmitEditing = {
                    () => {
                      this.inputs.city.focus();
                    }
                  }
                />
                <CustomMaterialTextInput
                  label="customer_shipping_city"
                  onChangeText={text => this.setState({ city: text })}
                  value={this.state.city}
                  clearButtonMode = "while-editing"
                  textContentType="addressCityAndState"
                  returnKey = "next"
                  error={errors.city}
                  onRef={input => {
                    this.inputs.city = input;
                  }
                  }
                  onSubmitEditing = {
                    () => {
                      this.inputs.country.focus();
                    }
                  }
                />
                <CustomMaterialTextInput
                  label = "customer_shipping_country"
                  returnKey = "next"
                  onChangeText={text => this.setState({ country: text })}
                  value={this.state.country}
                  textContentType="countryName"
                  clearButtonMode="while-editing"
                  error={errors.country}
                  onRef={input => {
                    this.inputs.country = input;
                  }}
                />
              </View>
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
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
    customers: state.customers
  };
};

const wrappedComponent = withGlobalize(connect(mapStateToProps, { ...customersOperations })(OrderShippingAddressScreen));

//Header option
wrappedComponent.navigationOptions = ({ navigation }) => {
  return {
    headerBackTitle: null,
    headerTitle: (<AvenirFormattedMessage style={Styles.headerTitleStyle} weight="demi" message='order_shipping_address_edit'/>),
  }
}

export default wrappedComponent;

const styles = StyleSheet.create({
  masterContainer: {
    backgroundColor: Colors.backgroundColor,
    ...Platform.select({
      ios: {
        flex: 1
      },
      android: {
        height: Layout.window.height - Layout.headerHeight
      }
    })
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  },
  section: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 2
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10
  },
  imagePicker: {
    marginTop: 10
  },
  topPanel: {
  },
  bottomPanel: {
    backgroundColor: "#fff",
    paddingHorizontal: 15
  },
  row: {
    backgroundColor: "#fff",
    flexDirection: "row"
  },
  iconInput: {
    width: 65
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 44,
    padding: 6,
    backgroundColor: "rgba(255,255,255,.8)",
    marginRight: 10
  },
  icon: {
    width: 32,
    height: 32
  },
  customerType: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    overflow: "hidden",
    backgroundColor: "#fefefe",
    borderRadius: 10
  },
  customerTypeLabel: {
    marginBottom: 10
  },
  hideCustomer: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    backgroundColor: "#fefefe",
    borderRadius: 10,
    paddingBottom: 10,
    paddingTop: 10
  },
  hideCustomerLabel: {
    fontSize: 16
  },
  systemNote: {
    paddingHorizontal: 15,
    paddingVertical: 7
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
  }
});
