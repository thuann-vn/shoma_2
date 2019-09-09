import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import {
  DefaultPanel,
  AvenirFormattedMessage,
  CustomMaterialTextInput,
  HeaderButton,
  Picker
} from '../../components';
import { connect } from 'react-redux';
import { getCustomerById, prepareCustomerData } from '../../utils/customerHelper';
import { defaultCustomerData, LogEvents } from '../../constants/Common';
import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';
import { formatMessage } from '../../utils/format';
import { withGlobalize } from 'react-native-globalize';
import { logToAmplitude } from '../../utils/logHelper';
import { getNextId } from '../../utils/stateHelper';
import Layout from '../../constants/Layout';
import {
  customersOperations
} from '../../modules/customers';
import { getCities, getCountries } from '../../utils/commonHelper';
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Geocoder from "react-native-geocoding";
import { GoogleAPIKey } from '../../constants/ApiKeys';

class CustomerDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.inputs = {};

    let { params } = this.props.navigation.state;
    var customer = { ...defaultCustomerData };

    if (params && params.id) {
      var customer = getCustomerById(this.props.customers, params.id);
    }
    this.state = this._prepareCountryAndCityData(customer);

    //Setting
    this._navigationSetting();
  }

  componentDidMount(){
    if (!this.state.country || !this.state.city) {
      this._getLocationAsync();
    } 
  }

  _prepareCountryAndCityData(customer) {
    let cities = getCities(customer.country || '');
    return {
      ...customer,
      cities
    };
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    Geocoder.init(GoogleAPIKey);
 
    let decodedLocation = await Geocoder.from(
      location.coords.latitude,
      location.coords.longitude
    );
    if(decodedLocation.results.length){
      let location = {};
      let address_components = decodedLocation.results[0].address_components;
      address_components.map((component)=>{
        if(component.types.indexOf('country') >=0){
          location.country = component.long_name == 'Vietnam'? 'Việt Nam' :component.long_name;
          location.cities = getCities(location.country);
        }
        if (component.types.indexOf("administrative_area_level_1") >= 0) {
          location.city = component.long_name;
        }
      })
      this.setState(location);
    }
  };

  //Navigation setting
  _navigationSetting = () => {
    let { params = {} } = this.props.navigation.state;
    if (params.id) {
      this.props.navigation.setParams({
        headerRight: (
          <HeaderButton
            icon="trash"
            onPress={this._deleteCustomer}
            iconSize={22}
          />
        )
      });
    }
  };

  _deleteCustomer = () => {
    const { id } = this.state;
    let title = formatMessage(this.props.globalize, "customer_delete_title");
    let message = formatMessage(
      this.props.globalize,
      "customer_delete_message"
    );
    let options = [
      {
        text: formatMessage(this.props.globalize, "common_cancel"),
        onPress: () => {},
        style: "cancel"
      },
      {
        text: formatMessage(this.props.globalize, "common_ok"),
        style: "destructive",
        onPress: () => {
          this.props.removeCustomer({
            id: id
          });
          this.props.navigation.pop(2);
        }
      }
    ];

    Alert.alert(title, message, options, {
      cancelable: true
    });
  };

  //Validate
  _validateForm = () => {
    if (!this.state.name) {
      this.setState({
        errors: {
          name: formatMessage(this.props.globalize, "customer_name_required")
        }
      });
      return false;
    }
    return true;
  };

  //Submit
  _submitForm = async () => {
    if (!this._validateForm()) {
      return;
    }

    let savingCustomer = prepareCustomerData(this.state);

    if (this.state.id) {
      this.props.updateCustomer(savingCustomer);
    } else {
      savingCustomer.id = getNextId();
      this.props.addCustomer(savingCustomer);

      //Save log
      logToAmplitude(
        LogEvents.CreateCustomer,
        null,
        this.props.settings.trackingEnabled
      );
    }

    this.props.navigation.goBack();
  };

  //On change country
  _changeCountry = country => {
    const cities = getCities(country);
    this.setState({
      country: country,
      city: cities.length ? cities[0].value : "",
      cities
    });
  };

  render() {
    let { errors = {} } = this.state;
    return (
      <KeyboardAvoidingView
        style={styles.masterContainer}
        behavior={Layout.isIOS ? "padding" : null}
        enabled={Layout.isIphoneX}
      >
        <ScrollView style={styles.container}>
          <DefaultPanel containerStyle={styles.topPanel} notitle="true">
            <View style={styles.section}>
              <AvenirFormattedMessage
                style={styles.sectionTitle}
                weight="demi"
                message="customer_info"
              />
              <CustomMaterialTextInput
                label="customer_name"
                onChangeText={text => this.setState({ name: text })}
                value={this.state.name}
                autoFocus={true}
                clearButtonMode="while-editing"
                returnKey="next"
                textContentType="name"
                onSubmitEditing={() => {
                  this.inputs.phoneNumber.focus();
                }}
                error={errors.name}
              />
              <CustomMaterialTextInput
                label="customer_phone"
                onChangeText={text => this.setState({ phoneNumber: text })}
                value={this.state.phoneNumber}
                clearButtonMode="while-editing"
                keyboardType="phone-pad"
                returnKey="next"
                textContentType="telephoneNumber"
                error={errors.phoneNumber}
                onRef={input => {
                  this.inputs.phoneNumber = input;
                }}
                onSubmitEditing={() => {
                  this.inputs.email.focus();
                }}
              />
              <CustomMaterialTextInput
                label="customer_email"
                onChangeText={text => this.setState({ email: text })}
                value={this.state.email}
                clearButtonMode="while-editing"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoCapitalize="none"
                returnKey="next"
                error={errors.email}
                onRef={input => {
                  this.inputs.email = input;
                }}
                onSubmitEditing={() => {
                  this.inputs.company.focus();
                }}
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
                clearButtonMode="while-editing"
                textContentType="organizationName"
                returnKey="next"
                error={errors.company}
                onRef={input => {
                  this.inputs.company = input;
                }}
                onSubmitEditing={() => {
                  this.inputs.address.focus();
                }}
              />
              <CustomMaterialTextInput
                label="customer_shipping_address"
                onChangeText={text => this.setState({ address: text })}
                value={this.state.address}
                clearButtonMode="while-editing"
                textContentType="streetAddressLine1"
                returnKey="next"
                error={errors.address}
                onRef={input => {
                  this.inputs.address = input;
                }}
                onSubmitEditing={() => {
                  this.inputs.address2.focus();
                }}
              />
              <CustomMaterialTextInput
                label="customer_shipping_address2"
                onChangeText={text => this.setState({ address2: text })}
                value={this.state.address2}
                clearButtonMode="while-editing"
                textContentType="streetAddressLine2"
                returnKey="next"
                error={errors.address2}
                onRef={input => {
                  this.inputs.address2 = input;
                }}
              />

              <Picker
                value={this.state.city || ''}
                label="customer_shipping_city"
                data={this.state.cities || []}
                onChange={value => {
                  this.setState({ city: value });
                }}
              />

              <Picker
                value={this.state.country || ''}
                label="customer_shipping_country"
                data={getCountries()}
                onChange={this._changeCountry}
              />
            </View>
            <View style={styles.section}>
              <CustomMaterialTextInput
                label="customer_note"
                onChangeText={text => this.setState({ note: text })}
                value={this.state.note}
                clearButtonMode="while-editing"
                multiline
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
    );
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
    customers: state.customers
  };
};

const wrappedComponent = withGlobalize(connect(mapStateToProps, { ...customersOperations })(CustomerDetailScreen));

//Header option
wrappedComponent.navigationOptions = ({ navigation }) => {
  const { params } = navigation.state;
  return {
    headerBackTitle: null,
    headerTitle: (<AvenirFormattedMessage style={Styles.headerTitleStyle} weight="demi" message={params && params.id ? 'customer_edit' : 'customer_add'} />),
    headerRight: () => params && params.headerRight ? params.headerRight : null
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
