import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Alert,
  ActivityIndicator
} from "react-native";
import {
  DefaultPanel,
  AvenirFormattedMessage,
  Image,
  AvenirText,
  Value,
  CustomNumberInput,
  Icon,
  CustomMaterialTextInput,
  CustomerInfo,
  HeaderButton,
  Separator,
  MenuItem
} from "../../components";
import { connect } from "react-redux";
import { defaultOrderData } from "../../constants/Common";
import Colors from "../../constants/Colors";
import Styles, { menuItem, menuIcon, headerRightContainer } from "../../constants/Styles";
import { formatMessage } from "../../utils/format";
import { withGlobalize } from "react-native-globalize";
import { getNextId } from "../../utils/stateHelper";
import Layout from "../../constants/Layout";
import { ordersOperations } from "../../modules/orders";
import Screens from "../../constants/Screens";
import Images from "../../constants/Images";
import R from "ramda";
import Collapsible from "react-native-collapsible";
import {
  OrderStatus,
  OrderPaymentStatus,
  OrderDiscountTypes
} from "../../constants/Orders";
import {
  connectActionSheet,
} from '@expo/react-native-action-sheet';
import { getOrderById, prepareOrderData } from "../../utils/orderHelper";
import { settingsOperations } from "../../modules/settings";
import { getCustomerById } from "../../utils/customerHelper";
import Menu from "react-native-material-menu";
import { OrderServices } from "../../services/order";

class OrderDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    let { params = {} } = this.props.navigation.state;
    if (params.id) {
      let order = getOrderById(this.props.orders, params.id);
      this.state = {
        ...order,
        status: params.isDraft ? OrderStatus.confirmed : order.status,
        customer: getCustomerById(this.props.customers, order.customerId),
        isDraft: params.isDraft || false
      };
    } else {
      this.state = {
        ...defaultOrderData,
        callback: params.addCallback || null
      };
    }
  }

  async componentDidMount() {
    if (!this.state.id) {
      //Set navigation
      this.props.navigation.setParams({
        headerRight: (
          <HeaderButton
            label="order_save_draft"
            onPress={() => this._submitForm(true)}
          />
        )
      });
    } else if (this.state.isDraft) {
      this.props.navigation.setParams({
        headerRight: (
          <View style={headerRightContainer}>
            <HeaderButton
              message="order_draft_save_changes"
              onPress={() => this._submitForm(true)}
            />
            <Menu
              ref={ref => (this._headerMenu = ref)}
              button={
                <TouchableOpacity
                  onPress={() => this._headerMenu.show()}
                  style={{ paddingLeft: 5 }}
                >
                  <Icon.Entypo
                    name="dots-three-vertical"
                    size={16}
                    style={{ color: "#fff", marginRight: 5 }}
                  />
                </TouchableOpacity>
              }
            >
              <MenuItem onPress={()=>{
                this._deleteOrder();
              }}>
                <View style={menuItem}>
                  <Icon.Feather name="trash" style={menuIcon} size={22} />
                  <AvenirFormattedMessage
                    weight="demi"
                    message="order_draft_delete"
                  />
                </View>
              </MenuItem>
            </Menu>
          </View>
        )
      });
    }
  }

  //Delete order
  _deleteOrder = () => {
    let title = formatMessage(this.props.globalize, 'order_delete_title');
    let message = formatMessage(this.props.globalize, "order_delete_message");
    let options = [
      {
        text: formatMessage(this.props.globalize, "common_cancel"),
        onPress: () => {
          this._headerMenu && this._headerMenu.hide();
        },
        style: "cancel"
      },
      {
        text: formatMessage(this.props.globalize, "common_ok"),
        style: "destructive",
        onPress: () => {
          this._headerMenu && this._headerMenu.hide();
          this.props.removeOrder({ id: this.state.id });
          this.props.navigation.pop();
        }
      }
    ];
    Alert.alert(title, message, options, { cancelable: true });
  }

  //Customer select
  _openCustomerList = () => {
    this.props.navigation.navigate(Screens.CustomerList, {
      selectMode: true,
      selectCallback: this._addCustomer
    });
  };

  _addCustomer = customer => {
    this.setState({ shippingAddress: customer, customer: customer, customerId: customer.id });
  };

  //Product select
  _openProductList = () => {
    this.props.navigation.navigate(Screens.ProductList, {
      selectMode: true,
      selectCallback: this._addProduct
    });
  };

  _addProduct = product => {
    const { items } = this.state;
    product.quantity = 1;

    //Check if existed in list
    let existedItem = items[product.id];
    if (existedItem) {
      product.quantity = existedItem.quantity + 1;
    }

    //Set state
    const newItems = {
      ...items,
      [product.id]: product
    };
    this.setState({
      items: newItems,
      ...this._calculatorSummary(newItems)
    });
  };

  //Quantity update
  _changeProductQuantity = (item, quantity) => {
    var { items } = this.state;
    items[item.id].quantity = quantity;
    this.setState({
      items: items,
      ...this._calculatorSummary(items)
    });
  };

  //Update status
  _changeStatus = status => {
    this.setState({
      status: status
    });
  };

  //Change payment status
  _changePaymentStatus = status => {
    this.setState({
      paymentStatus: status
    });
  };

  //UPdate discount
  _openDiscountSetting = () => {
    this.props.navigation.navigate(Screens.OrderDiscountSetting, {
      type: this.state.discountType,
      value: this.state.discountValue,
      reason: this.state.discountReason,
      callback: this._changeDiscount,
      maxValue: this.state.subTotal
    });
  };

  //Change discount
  _changeDiscount = ({ type, value, reason }) => {
    const discountTotal =
      type == OrderDiscountTypes.value
        ? value
        : (this.state.subTotal * value) / 100;
    this.setState({
      discountType: type,
      discountValue: value,
      discountReason: reason,
      discountTotal: discountTotal,
      total: this.state.subTotal + this.state.shippingFee - discountTotal
    });
  };

  //Update shipping setting
  _openShippingSetting = () => {
    this.props.navigation.navigate(Screens.OrderShippingSetting, {
      value: this.state.shippingFee,
      note: this.state.shippingNote,
      callback: this._changeShippingFee
    });
  };

  _changeShippingFee = ({ value, note }) => {
    this.setState({
      shippingFee: value,
      shippingNote: note,
      total: this.state.subTotal + value - this.state.discountTotal
    });
  };

  //Calculate total
  _calculatorSummary = items => {
    let subTotal = 0;
    R.map(item => {
      subTotal += item.price * item.quantity;
    }, R.values(items));

    let discountTotal =
      this.state.discountType == OrderDiscountTypes.value
        ? this.state.discountValue
        : (subTotal * this.state.discountValue) / 100;

    return {
      subTotal: subTotal,
      discountTotal: discountTotal,
      total: subTotal + this.state.shippingFee - discountTotal
    };
  };

  //Form submit
  _validateForm = () => {
    if (!Object.keys(this.state.items).length && !this.state.customer) {
      return false;
    }
    return true;
  };

  //Submit form
  _submitForm = async (isDraft = false) => {
    if (!this._validateForm()) {
      return;
    }

    this.setState({saving: true});

    let savingOrder = prepareOrderData(this.state, isDraft);

    if (this.state.id) {
      //Create from draft
      if(this.state.isDraft){
        savingOrder.increment = await OrderServices.getOrderIncrement(isDraft);
        savingOrder.createdDate = new Date();
      }

      this.props.updateOrder(savingOrder);
    } else {
      savingOrder.id = getNextId();
      savingOrder.increment = await OrderServices.getOrderIncrement(isDraft);
      this.props.addOrder(savingOrder);

      //Callback
      if (this.state.callback) {
        this.state.callback(savingOrder);
      }
    }

    //If create order from draft => pop to list
    if (this.state.isDraft && !isDraft) {
      this.props.navigation.pop(2);
      this.props.navigation.navigate(Screens.OrderView, {id: this.state.id});
      return;
    }
    this.props.navigation.goBack();
  };

  _renderRow = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => this._rowPress(item)}
        style={styles.rowContainer}
        activeOpacity={0.5}
      >
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image source={item.image} style={styles.image} />
          ) : (
            <Image source={Images.imagePlaceholder} style={styles.image} />
          )}
        </View>
        <View style={styles.rowContentContainer}>
          <AvenirText style={styles.productName} weight="demi">
            {item.code
              ? formatMessage(this.props.globalize, item.code)
              : item.name}
          </AvenirText>
          <View style={styles.productPrice}>
            <Value
              value={item.price * item.quantity}
              currency={this.props.settings.currency}
            />
            <View style={{ marginLeft: 5 }}>
              <AvenirText style={{ color: Colors.textGray }}>
                (
                <Value
                  value={item.price}
                  currency={this.props.settings.currency}
                />{" "}
                x {item.quantity})
              </AvenirText>
            </View>
          </View>
        </View>
        <View style={styles.productQuantityInput}>
          <CustomNumberInput
            value={item.quantity}
            onChange={value => {
              this._changeProductQuantity(item, value);
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  //Row press
  _rowPress = item => {
    actionSheetOption = {
      title: formatMessage(this.props.globalize, "order_product_detail_title", {
        name: item.name
      }),
      options: [
        formatMessage(this.props.globalize, "common_cancel"),
        formatMessage(this.props.globalize, "order_product_detail"),
        formatMessage(this.props.globalize, "order_product_remove")
      ],
      cancelButtonIndex: 0,
      destructiveButtonIndex: 2
    };

    this.props.showActionSheetWithOptions(actionSheetOption, buttonIndex => {
      switch (buttonIndex) {
        case 1:
          this.props.navigation.navigate(Screens.ProductDetail, {
            id: item.id
          });
          break;
        case 2:
          const items = R.omit([item.id], this.state.items);
          this.setState({
            items: items,
            ...this._calculatorSummary(items)
          });
          break;
      }
    });
  };

  //Cusomter setting
  _openCustomerSettings = () => {
    actionSheetOption = {
      title: formatMessage(this.props.globalize, "order_customer_edit_title", {
        name: this.state.shippingAddress.name
      }),
      options: [
        formatMessage(this.props.globalize, "common_cancel"),
        formatMessage(this.props.globalize, "order_customer_update_address"),
        formatMessage(this.props.globalize, "order_customer_view_detail"),
        formatMessage(this.props.globalize, "order_customer_remove")
      ],
      cancelButtonIndex: 0,
      destructiveButtonIndex: 3
    };

    this.props.showActionSheetWithOptions(actionSheetOption, buttonIndex => {
      switch (buttonIndex) {
        case 1:
          this.props.navigation.navigate(Screens.OrderShippingAddressScreen, {
            ...this.state.customer,
            callback: (state)=>{
              const { 
                name, phoneNumber, email ,company,address,address2, city, country
              } = state;
              this.setState({
                customer: {
                  ...this.state.customer,
                  name, phoneNumber, email ,company,address,address2, city, country
                }
              })
            }
          });
          break;
        case 2:
          this.props.navigation.navigate(Screens.CustomerOverview, {
            id: this.state.customerId,
            title: this.state.customer.name
          });
          break;
        case 3:
          this.setState({
            customer: null
          });
          break;
      }
    });
  };

  //Render discount info
  _renderDiscount = () => {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={this._openDiscountSetting}
      >
        <View style={{ flex: 1 }}>
          <AvenirFormattedMessage
            style={styles.buttonLink}
            message={
              this.state.discountType == OrderDiscountTypes.percent
                ? "order_discount_percent"
                : "order_discount"
            }
            value={this.state.discountValue}
          />
          {this.state.discountValue && this.state.discountReason ? (
            <AvenirText style={styles.discountReason}>
              {this.state.discountReason}
            </AvenirText>
          ) : null}
        </View>
        <AvenirText>
          {this.state.discountTotal > 0 ? (
            <Value
              style={styles.totalValue}
              value={this.state.discountTotal}
              currency={this.props.settings.currency}
            />
          ) : (
            <Icon.Entypo
              style={styles.buttonIcon}
              name="circle-with-plus"
              size={24}
            />
          )}
        </AvenirText>
      </TouchableOpacity>
    );
  };

  //Render shipping info
  _renderShippingFee = () => {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={this._openShippingSetting}
      >
        <View style={{ flex: 1 }}>
          <AvenirFormattedMessage
            style={styles.buttonLink}
            message="order_shipping"
          />
          {this.state.shippingFee && this.state.shippingNote ? (
            <AvenirText style={styles.shippingNote}>
              {this.state.shippingNote}
            </AvenirText>
          ) : null}
        </View>
        <AvenirText>
          {this.state.shippingFee > 0 ? (
            <Value
              style={styles.totalValue}
              value={this.state.shippingFee}
              currency={this.props.settings.currency}
            />
          ) : (
            <Icon.Entypo
              style={styles.buttonIcon}
              name="circle-with-plus"
              size={24}
            />
          )}
        </AvenirText>
      </TouchableOpacity>
    );
  };

  //Shipment setting
  _renderShipmentInfo = () => {
    if (
      this.state.shipmentTrackingCode ||
      this.state.shipmentNote ||
      this.state.shipmentCarrier
    ) {
      return (
        <View style={styles.shipmentInfo}>
          <TouchableOpacity
            style={{ marginBottom: -10, zIndex: 20 }}
            onPress={this._openShipmentSetting}
          >
            <AvenirFormattedMessage
              style={{ ...styles.buttonLink, textAlign: "right" }}
              weight="demi"
              message="order_edit_shipment_info"
            />
          </TouchableOpacity>
          <AvenirText style={{ marginBottom: 5 }}>
            <AvenirFormattedMessage message="order_tracking_code" />:{" "}
            <AvenirText weight="demi">
              #{this.state.shipmentTrackingCode}
            </AvenirText>
          </AvenirText>
          <AvenirText style={{ marginBottom: 5 }}>
            <AvenirFormattedMessage message="order_shipment_carrier" />:{" "}
            <AvenirText weight="demi">{this.state.shipmentCarrier}</AvenirText>
          </AvenirText>
          {this.state.shipmentNote ? (
            <AvenirText>
              <AvenirFormattedMessage message="order_shipment_note" />:{" "}
              <AvenirText>{this.state.shipmentNote}</AvenirText>
            </AvenirText>
          ) : null}
        </View>
      );
    }
    return (
      <TouchableOpacity onPress={this._openShipmentSetting}>
        <AvenirFormattedMessage
          style={styles.buttonLink}
          weight="demi"
          message="order_add_shipment_info"
        />
      </TouchableOpacity>
    );
  };

  _openShipmentSetting = () => {
    this.props.navigation.navigate(Screens.OrderShipmentSetting, {
      ...this.state,
      callback: this._updateShipment
    });
  };

  _updateShipment = ({
    shipmentTrackingCode,
    shipmentNote,
    shipmentCarrier
  }) => {
    this.setState({
      status: OrderStatus.shipping,
      shipmentTrackingCode,
      shipmentCarrier,
      shipmentNote
    });

    //State
    let savingOrderData = {
      ...this.state,
      status: OrderStatus.shipping,
      shipmentTrackingCode,
      shipmentCarrier,
      shipmentNote
    };

    this.props.updateOrder(prepareOrderData(savingOrderData));
  };

  render() {
    const { items } = this.state;

    return (
      <KeyboardAvoidingView
        style={styles.masterContainer}
        behavior={Layout.isIOS ? "padding" : null}
      >
        <ScrollView style={styles.container}>
          <DefaultPanel containerStyle={styles.topPanel} notitle="true">
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <AvenirFormattedMessage
                  style={styles.sectionTitle}
                  weight="demi"
                  message="order_customer"
                />
                {this.state.customerId  && (
                  <TouchableOpacity onPress={this._openCustomerSettings}>
                    <AvenirFormattedMessage
                      style={styles.buttonLink}
                      weight="demi"
                      message="order_customer_edit"
                    />
                  </TouchableOpacity>
                )}
              </View>

              {
                !this.state.shippingAddress || Object.keys(this.state.shippingAddress).length === 0 || !this.state.shippingAddress.name ? (
                <TouchableOpacity onPress={this._openCustomerList}>
                  <AvenirFormattedMessage
                    style={styles.buttonLink}
                    weight="demi"
                    message="order_add_customer"
                  />
                </TouchableOpacity>
              ) : (
                <CustomerInfo data={this.state.shippingAddress} />
              )}
            </View>
            <View style={styles.section}>
              <AvenirFormattedMessage
                style={styles.sectionTitle}
                weight="demi"
                message="order_items"
              />

              {Object.keys(items).length ? (
                <FlatList
                  data={R.values(this.state.items)}
                  extraData={this.state}
                  renderItem={this._renderRow}
                  style={styles.productList}
                  keyExtractor={(item, index) => "order_product_" + index}
                />
              ) : null}

              <TouchableOpacity onPress={this._openProductList}>
                <AvenirFormattedMessage
                  style={styles.buttonLink}
                  weight="demi"
                  message="order_add_product"
                />
              </TouchableOpacity>
            </View>
            <Collapsible collapsedHeight={0} duration={2000} collapsed={Object.keys(items).length == 0} renderToHardwareTextureAndroid={true}>
              <View style={styles.section}>
                <AvenirFormattedMessage
                  style={styles.sectionTitle}
                  weight="demi"
                  message="order_pricing"
                />

                {/* Order Discount */}
                {this._renderDiscount()}

                <View style={styles.button}>
                  <AvenirFormattedMessage
                    style={styles.totalText}
                    message="order_subtotal"
                  />
                  <Value
                    style={styles.totalValue}
                    value={this.state.subTotal}
                    currency={this.props.settings.currency}
                  />
                </View>
                {this._renderShippingFee()}
                <View style={styles.button}>
                  <AvenirFormattedMessage
                    style={styles.totalText}
                    weight="demi"
                    message="order_total"
                  />
                  <Value
                    style={styles.totalValue}
                    weight="demi"
                    value={this.state.total}
                    currency={this.props.settings.currency}
                  />
                </View>
              </View>

              <View style={styles.section}>
                <AvenirFormattedMessage
                  style={styles.sectionTitle}
                  weight="demi"
                  message="order_shipment"
                />

                <View style={styles.paymentOptions}>
                  <TouchableOpacity
                    style={[
                      styles.paymentButton,
                      this.state.status == OrderStatus.confirmed
                        ? styles.paymentButtonActive
                        : null
                    ]}
                    onPress={() => this._changeStatus(OrderStatus.confirmed)}
                  >
                    <Icon.Entypo
                      style={[
                        styles.paymentButtonIcon,
                        this.state.status == OrderStatus.confirmed
                          ? styles.paymentButtonActiveLabel
                          : null
                      ]}
                      size={32}
                      name="circular-graph"
                    />
                    <AvenirFormattedMessage
                      style={[
                        styles.paymentButtonLabel,
                        this.state.status == OrderStatus.confirmed
                          ? styles.paymentButtonActiveLabel
                          : null
                      ]}
                      message="order_shipment_pending"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.paymentButton,
                      this.state.status == OrderStatus.shipping
                        ? styles.paymentButtonActive
                        : null
                    ]}
                    onPress={() => this._changeStatus(OrderStatus.shipping)}
                  >
                    <Icon.MaterialIcons
                      style={[
                        styles.paymentButtonIcon,
                        this.state.status == OrderStatus.shipping
                          ? styles.paymentButtonActiveLabel
                          : null
                      ]}
                      size={32}
                      name="local-shipping"
                    />
                    <AvenirFormattedMessage
                      style={[
                        styles.paymentButtonLabel,
                        this.state.status == OrderStatus.shipping
                          ? styles.paymentButtonActiveLabel
                          : null
                      ]}
                      message="order_shipment_shipping"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.paymentButton,
                      this.state.status == OrderStatus.complete
                        ? styles.paymentButtonActive
                        : null
                    ]}
                    onPress={() => this._changeStatus(OrderStatus.complete)}
                  >
                    <Icon.MaterialIcons
                      style={[
                        styles.paymentButtonIcon,
                        this.state.status == OrderStatus.complete
                          ? styles.paymentButtonActiveLabel
                          : null
                      ]}
                      size={32}
                      name="done-all"
                    />
                    <AvenirFormattedMessage
                      style={[
                        styles.paymentButtonLabel,
                        this.state.status == OrderStatus.complete
                          ? styles.paymentButtonActiveLabel
                          : null
                      ]}
                      message="order_shipment_complete"
                    />
                  </TouchableOpacity>
                </View>

                <Collapsible
                  collapsed={
                    this.state.status != OrderStatus.shipping &&
                    this.state.status != OrderStatus.complete
                  }
                >
                  <Separator position="top" left={0} />
                  <View style={{ paddingTop: 10 }}>
                    {this._renderShipmentInfo()}
                  </View>
                </Collapsible>
              </View>
              <View style={styles.section}>
                <AvenirFormattedMessage
                  style={styles.sectionTitle}
                  weight="demi"
                  message="order_payment"
                />

                <View style={styles.paymentOptions}>
                  <TouchableOpacity
                    style={[
                      styles.paymentButton,
                      this.state.paymentStatus == OrderPaymentStatus.pending
                        ? styles.paymentButtonActive
                        : null
                    ]}
                    onPress={() =>
                      this._changePaymentStatus(OrderPaymentStatus.pending)
                    }
                  >
                    <Icon.Entypo
                      style={[
                        styles.paymentButtonIcon,
                        this.state.paymentStatus == OrderPaymentStatus.pending
                          ? styles.paymentButtonActiveLabel
                          : null
                      ]}
                      size={32}
                      name="credit-card"
                    />
                    <AvenirFormattedMessage
                      style={[
                        styles.paymentButtonLabel,
                        this.state.paymentStatus == OrderPaymentStatus.pending
                          ? styles.paymentButtonActiveLabel
                          : null
                      ]}
                      message="order_payment_pending"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.paymentButton,
                      this.state.paymentStatus == OrderPaymentStatus.paid
                        ? styles.paymentButtonActive
                        : null
                    ]}
                    onPress={() =>
                      this._changePaymentStatus(OrderPaymentStatus.paid)
                    }
                  >
                    <Icon.MaterialIcons
                      style={[
                        styles.paymentButtonIcon,
                        this.state.paymentStatus == OrderPaymentStatus.paid
                          ? styles.paymentButtonActiveLabel
                          : null
                      ]}
                      size={32}
                      name="done-all"
                    />
                    <AvenirFormattedMessage
                      style={[
                        styles.paymentButtonLabel,
                        this.state.paymentStatus == OrderPaymentStatus.paid
                          ? styles.paymentButtonActiveLabel
                          : null
                      ]}
                      message="order_payment_paid"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Collapsible>

            <View style={styles.section}>
              <AvenirFormattedMessage
                style={styles.sectionTitle}
                weight="demi"
                message="order_note"
              />

              <CustomMaterialTextInput
                value={this.state.note}
                multiline
                numberOfLines={3}
                label="order_note_placeholder"
                onChange={value => this.setState({ note: value })}
              />
            </View>
          </DefaultPanel>
        </ScrollView>

        <View style={styles.bottomPanel}>
          <TouchableOpacity
            style={{
              ...styles.roundedButton,
              opacity: Object.keys(this.state.items).length ? 1 : 0.5
            }}
            onPress={()=>this._submitForm()}
            disabled={this.state.saving || !Object.keys(this.state.items).length}
          >
            <AvenirFormattedMessage
              style={styles.roundedButtonLabel}
              weight="demi"
              message={
                this.state.id && !this.state.isDraft
                  ? "order_update"
                  : "order_create"
              }
            />
            {
              this.state.saving &&  <ActivityIndicator style={{marginLeft: 5}} size="small" color="#fff"/>
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => {
  return {
    settings: state.settings,
    orders: state.orders,
    customers: state.customers
  };
};

const wrappedComponent = withGlobalize(
  connectActionSheet(
    connect(
      mapStateToProps,
      { ...ordersOperations, ...settingsOperations}
    )(OrderDetailScreen)
  )
);

//Header option
wrappedComponent.navigationOptions = ({ navigation }) => {
  const { params = {} } = navigation.state;
  return {
    headerTitle: <AvenirFormattedMessage
      style={Styles.headerTitleStyle}
      weight="demi"
      message={params && params.id ? 'order_detail' : 'order_add'}
      order = {params.code}
    />,
    headerRight: ()=> params && params.headerRight ? params.headerRight : null
  };
};

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
  sectionHeader: {
    flexDirection: "row"
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    marginBottom: 15
  },
  topPanel: {
    // backgroundColor: "#fff",
  },
  bottomPanel: {
    backgroundColor: "#fff",
    paddingHorizontal: 15
  },
  roundedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
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
  button: {
    flexDirection: "row",
    alignContent: "space-between",
    alignItems: "center",
    paddingVertical: 10
  },
  buttonIcon: {
    color: Colors.mainColor
  },
  buttonLink: {
    flex: 1,
    color: Colors.mainColor,
    fontSize: 14
  },
  discountReason: {
    color: Colors.textGray
  },
  totalText: {
    flex: 1,
    fontSize: 14
  },
  totalValue: {
    fontSize: 16
  },
  productList: {
    marginBottom: 20
  },
  rowContentContainer: {
    flex: 1
  },
  productName: {
    fontSize: 14,
    lineHeight: 14,
    marginTop: 5,
    color: "#333"
  },
  productPrice: {
    fontSize: 14,
    color: Colors.textColor,
    flexDirection: "row",
    alignItems: "center"
  },
  rowContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor
  },
  imageContainer: {
    marginRight: 10
  },
  image: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 4,
    overflow: 'hidden'
  },
  paymentOptions: {
    flexDirection: "row"
  },
  paymentButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    marginBottom: 10,
    margin: 2,
    alignItems: "center",
    justifyContent: "center"
  },
  paymentButtonActive: {
    backgroundColor: Colors.mainColor
  },
  paymentButtonLabel: {
    textAlign: "center",
    color: Colors.mainColor,
    fontSize: 14
  },
  paymentButtonActiveLabel: {
    color: "#fff"
  },
  paymentButtonIcon: {
    color: Colors.mainColor
  },
  headerRightContainer:{
    flexDirection: 'row'
  }
});
