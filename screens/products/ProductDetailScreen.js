import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import {
  DefaultPanel,
  AvenirFormattedMessage,
  CustomMaterialTextInput,
  NumberFormatTextInput,
  ImagePicker,
  CategoryPicker,
  HeaderButton
} from '../../components';
import { productsOperations } from '../../modules/products';
import { connect } from 'react-redux';
import { defaultProductData } from '../../constants/Common';
import { row, col, rowPadding, colPadding, textSmall } from '../../constants/Styles';
import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';
import { formatMessage } from '../../utils/format';
import { withGlobalize } from 'react-native-globalize';
import { getNextId } from '../../utils/stateHelper';
import Layout from '../../constants/Layout';
import { getCurrencySetting } from '../../utils/commonHelper';
import { postImage } from '../../utils/firebaseHelper';
import { ProductServices } from '../../services/product';
import { prepareProductData } from '../../utils/productHelper';
import firebase from "../../services/firebase";

class ProductDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.inputs = {};
    this.state = {
      loading: true
    };

    this._navigationSetting();
  }

  componentDidMount() {
    let { params } = this.props.navigation.state;
    if (params && params.id) {
      var product = this.props.products[params.id];
      this.setState({
        ...product,
        loading: false
      });
    } else {
      this.setState({
        ...defaultProductData,
        loading: false
      });
    }
  }

  _navigationSetting = () => {
    let { params = {} } = this.props.navigation.state;
    if (params.id) {
      this.props.navigation.setParams({
        headerRight: (
          <HeaderButton icon="trash" onPress={this._deleteProduct} iconSize={22}/>
        )
      });
    }
  };

  _deleteProduct = () => {
    const { id } = this.state;
    let title = formatMessage(this.props.globalize, "product_delete_title");
    let message = formatMessage(this.props.globalize, "product_delete_message");
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
          this.props.removeProduct({
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

  _validateForm = () => {
    if (!this.state.name) {
      this.setState({
        errors: {
          name: formatMessage(this.props.globalize, "product_name_required")
        }
      });
      return false;
    }
    if (this.state.cost == null) {
      this.setState({
        errors: {
          cost: formatMessage(this.props.globalize, "product_cost_required")
        }
      });
      return false;
    }
    if (this.state.price == null) {
      this.setState({
        errors: {
          price: formatMessage(this.props.globalize, "product_price_required")
        }
      });
      return false;
    }
    return true;
  };

  _submitForm = async () => {
    if (!this._validateForm()) {
      return;
    }

    this.setState({saving: true});

    let savingProduct = prepareProductData(this.state);
    if (savingProduct.image && this.state.imageChanged) {
      savingProduct.image = await postImage(
        firebase,
        "product_" + savingProduct.id,
        savingProduct.image
      );
    }
    
    //Save to firestore
    if (this.state.id) {
      this.props.updateProduct(savingProduct);
    } else {
      this.props.addProduct(savingProduct);
    }

    this.props.navigation.pop();
  };

  //Calculate margin
  _calculateMargin = () => {
    return 100 - Math.round((this.state.cost * 100) / this.state.price);
  };

  //Render
  render() {
    let { errors = {}, loading } = this.state;

    if(loading) return <View/>;

    return (
      <KeyboardAvoidingView
        style={styles.masterContainer}
        behavior={Layout.isIOS ? "padding" : null}
        enabled={Layout.isIphoneX}
      >
        <ScrollView style={styles.container}>
          <View style={styles.imagePicker}>
            <ImagePicker
              value={this.state.image}
              onChange={image => {
                this.setState({ image: image, imageChanged: true });
              }}
              imageStyle={{ height: 150 }}
            />
          </View>
          <DefaultPanel containerStyle={styles.topPanel} notitle="true">
            <CustomMaterialTextInput
              // editable={!this.state.name}
              label="product_name"
              style={styles.nameInput}
              onChangeText={text => this.setState({ name: text })}
              value={this.state.name}
              // autoFocus={true}
              clearButtonMode="while-editing"
              ref={this.nameInputRef}
              error={errors.name}
            />
            <CustomMaterialTextInput
              editable={!this.state.code}
              label="product_description"
              style={styles.nameInput}
              onChangeText={text => this.setState({ description: text })}
              value={this.state.description}
              clearButtonMode="while-editing"
              multiline
            />

            <View style={[row, rowPadding]}>
              <View style={[col, colPadding]}>
                <NumberFormatTextInput
                  editable={!this.state.code}
                  label="product_price"
                  currency={
                    getCurrencySetting(this.props.settings.currency).symbol
                  }
                  onValueChange={value =>
                    this.setState({ price: value.floatValue })
                  }
                  value={this.state.price}
                  error={errors.price}
                />
                {this.state.price && this.state.cost ? (
                  <AvenirFormattedMessage
                    style={[textSmall]}
                    message="product_margin"
                    margin={this._calculateMargin()}
                  />
                ) : null}
              </View>
              <View style={[col, colPadding]}>
                <NumberFormatTextInput
                  editable={!this.state.code}
                  label="product_cost"
                  currency={
                    getCurrencySetting(this.props.settings.currency).symbol
                  }
                  onValueChange={value =>
                    this.setState({ cost: value.floatValue })
                  }
                  value={this.state.cost}
                  error={errors.cost}
                />
              </View>
            </View>
          </DefaultPanel>
          <DefaultPanel
            containerStyle={[styles.topPanel, styles.paddingVPanel]}
            notitle="true"
          >
            <CategoryPicker
              value={this.state.category}
              onChange={value => {
                this.setState({ category: value });
              }}
            />
          </DefaultPanel>
        </ScrollView>
        <View style={styles.bottomPanel}>
          <TouchableOpacity
            style={styles.roundedButton}
            onPress={this._submitForm}
            disabled = {
              this.state.saving
            }
          >
            <AvenirFormattedMessage
              style={styles.roundedButtonLabel}
              weight="demi"
              message="common_save"
            />
            {
              this.state.saving &&  <ActivityIndicator size="small" color="#fff"/>
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
    products: state.products
  }
};

const wrappedComponent = withGlobalize(connect(mapStateToProps, {
  ...productsOperations
})(ProductDetailScreen));

//Header option
wrappedComponent.navigationOptions = ({ navigation }) => {
  const { params } = navigation.state;
  return {
    headerBackTitle: null,
    headerTitle: (<AvenirFormattedMessage style={Styles.headerTitleStyle} weight="demi" message={params && params.id ? 'product_edit' : 'product_add'} />),
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
        height : Layout.window.height - Layout.headerHeight
      },
    })
  },
  toastContainer: {
    backgroundColor: Colors.yellow
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  },
  imagePicker: {
    marginTop: 10,
    // borderWidth: 1,
  },
  topPanel: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  bottomPanel: {
    backgroundColor: "#fff",
    paddingHorizontal: 15
  },
  paddingVPanel: {
    paddingVertical: 10
  },
  row: {
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  iconInput: {
    width: 65
  },
  nameInput: {
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 44,
    padding: 6,
    backgroundColor: 'rgba(255,255,255,.8)',
    marginRight: 10
  },
  icon: {
    width: 32,
    height: 32
  },
  categoryType:{
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    overflow: 'hidden',
    backgroundColor: "#fefefe",
    borderRadius: 10,
  },
  categoryTypeLabel:{
    marginBottom: 10
  },
  hideCategory: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    overflow: 'hidden',
    backgroundColor: "#fefefe",
    borderRadius: 10,
  },
  systemNote:{
    paddingHorizontal: 15,
    paddingVertical: 7
  },
  roundedButton: {
    flexDirection: 'row',
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
  },
});
