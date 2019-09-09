import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Alert
} from "react-native";
import {
  DefaultPanel,
  AvenirFormattedMessage,
  Image,
  AvenirText,
  Value,
  Icon,
  CustomerInfo,
  Badge,
  DateText,
  Separator,
  MenuItem
} from "../../components";
import { connect } from "react-redux";
import Colors from "../../constants/Colors";
import Styles, { menuItem, menuIcon } from "../../constants/Styles";
import { formatMessage } from "../../utils/format";
import { withGlobalize } from "react-native-globalize";
import Layout from "../../constants/Layout";
import { ordersOperations } from "../../modules/orders";
import Screens from "../../constants/Screens";
import Images from "../../constants/Images";
import R from "ramda";
import {
  OrderStatus,
  OrderPaymentStatus,
  OrderDiscountTypes
} from "../../constants/Orders";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import {
  getOrderById,
  prepareOrderData
} from "../../utils/orderHelper";
import { settingsOperations } from "../../modules/settings";
import { orderCodeShow } from "../../utils/commonHelper";
import { getCustomerById } from "../../utils/customerHelper";
import Menu, { MenuDivider } from "react-native-material-menu";
import { iOSColors } from "react-native-typography";

class OrderViewScreen extends React.Component {
  constructor(props) {
    super(props);
    let { params = {} } = this.props.navigation.state;
    if (params && params.id) {
      this.state = {
        ...this._prepareData(this.props)
      };
    } else {
      this.props.navigation.navigate(Screens.OrderList);
    }

    //Set header right
    this.props.navigation.setParams({
      headerRight: (
        <Menu
          ref={ref => (this._menu = ref)}
          button={
            <TouchableOpacity
              onPress={() => this._menu.show()}
              style={{ paddingLeft: 10 }}
            >
              <Icon.Entypo
                name="dots-three-vertical"
                size={16}
                style={{ color: "#fff", marginRight: 5 }}
              />
            </TouchableOpacity>
          }
        >
          <MenuItem onPress={this._openEditScreen}>
            <View style={menuItem}>
              <Icon.Feather
                name="edit-3"
                style={menuIcon}
                size={22}
              />
              <AvenirFormattedMessage weight="demi" message="order_edit" />
            </View>
          </MenuItem>
          <MenuDivider />
          <MenuItem
            onPress={() => {
              this._deleteOrder();
            }}
          >
            <View style={menuItem}>
              <Icon.Feather name="trash" style={menuIcon} size={22} />
              <AvenirFormattedMessage
                weight="demi"
                message="order_delete"
              />
            </View>
          </MenuItem>
        </Menu>
      )
    });
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.orders != this.props.orders){
      this.setState({
       ...this._prepareData(nextProps)
      })
    }
  }

  _prepareData(props) {
      let {
        params = {}
      } = props.navigation.state;
    let order = getOrderById(props.orders, params.id);
    return {
      ...order,
      code: orderCodeShow(props.settings.orderIncrementPrefix, order.increment)
    }
  }

  //Delete order
  _deleteOrder = () => {
    let title = formatMessage(this.props.globalize, 'order_delete_title');
    let message = formatMessage(this.props.globalize, "order_delete_message");
    let options = [{
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
          this.props.removeOrder({
            id: this.state.id
          });
          this.props.navigation.pop();
        }
      }
    ];
    Alert.alert(title, message, options, {
      cancelable: true
    });
  }
  
  _openEditScreen = () => {
    this._menu.hide();
    this.props.navigation.navigate(Screens.OrderDetail, { 
      id: this.state.id,
      code: this.state.code });
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

  //Render products
  _renderRow = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate(Screens.ProductSummary, {
            id: item.id
          })
        }
        style={styles.rowContainer}
        activeOpacity={0.5}
      >
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image source={item.image} style={styles.image} />
          ) : (
            <Image source={Images.imagePlaceholder} style={styles.image} />
          )}
          <Badge
            value={item.quantity}
            status="primary"
            badgeStyle={styles.productBadge}
          />
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
      </TouchableOpacity>
    );
  };

  //Render discount info
  _renderDiscount = () => {
    return (
      <View style={styles.button}>
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
          <Value
            style={styles.totalValue}
            value={this.state.discountTotal}
            currency={this.props.settings.currency}
          />
        </AvenirText>
      </View>
    );
  };

  //Render shipping info
  _renderShippingFee = () => {
    return (
      <View style={styles.button}>
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
          <Value
            style={styles.totalValue}
            value={this.state.shippingFee}
            currency={this.props.settings.currency}
          />
        </AvenirText>
      </View>
    );
  };

  //Shipment
  _openShipmentSetting = () => {
    this._shipmentMenu && this._shipmentMenu.hide();
    this.props.navigation.navigate(Screens.OrderShipmentSetting, {
      ...this.state,
      callback: this._updateShipping
    });
  };

  _updateShipping = ({
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

  _updateShipped = () => {
    this.setState({
      status: OrderStatus.complete
    });

    //State
    let savingOrderData = {
      ...this.state,
      status: OrderStatus.complete
    };

    this.props.updateOrder(prepareOrderData(savingOrderData));
  };

  _cancelShipment = () =>{
    actionSheetOption = {
      title: formatMessage(
        this.props.globalize,
        "order_cancel_shipment_title",
        {code: this.state.code}
      ),
      options: [
        formatMessage(this.props.globalize, "common_cancel"),
        formatMessage(this.props.globalize, "common_ok")
      ],
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1
    };
    
    this.props.showActionSheetWithOptions(
      actionSheetOption,
      buttonIndex => {
        switch (buttonIndex) {
          case 1:
            //State
            this.setState({
              status: OrderStatus.confirmed
            });

            //Update redux
            let savingOrderData = {
              ...this.state,
              shipmentCarrier: '',
              shipmentTrackingCode: '',
              shipmentNote: '',
              shippingDate: new Date(),
              status: OrderStatus.confirmed
            };

            this.props.updateOrder(prepareOrderData(savingOrderData));
            break;
        }

        //Hide shipment menu
        this._shipmentMenu && this._shipmentMenu.hide();
      }
    );
  }

  _renderShipmentInfo = () => {
    if (
      (this.state.status == OrderStatus.shipping ||
      this.state.status == OrderStatus.complete)
      && (
        this.state.shipmentTrackingCode || this.state.shipmentCarrier || this.state.shipmentNote
      )
    ) {
      return (
        <View style={styles.shipmentInfo}>
          {this.state.shipmentTrackingCode ? (
            <AvenirText weight="demi">
              <AvenirText weight="demi">
                {this.state.shipmentCarrier}
              </AvenirText>{" "}
              #{this.state.shipmentTrackingCode}
            </AvenirText>
          ) : null}
          {this.state.shipmentNote ? (
            <AvenirText style={{ color: Colors.textGray }}>
              {this.state.shipmentNote}
            </AvenirText>
          ) : null}
        </View>
      );
    }
    return null;
  };


  //Payment
  _updatePaymentStatus = (status) => {
    actionSheetOption = {
      title: formatMessage(
        this.props.globalize,
        status == OrderPaymentStatus.paid ? "order_mask_as_paid_message" : 'order_clear_paid_message',
        {code: this.state.code}
      ),
      options: [
        formatMessage(this.props.globalize, "common_cancel"),
        formatMessage(this.props.globalize, "common_ok")
      ],
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1
    };
    
    this.props.showActionSheetWithOptions(
      actionSheetOption,
      buttonIndex => {
        switch (buttonIndex) {
          case 1:
            //State
            this.setState({
              paymentStatus: status,
              paidDate: new Date()
            });

            //Update redux
            let savingOrderData = {
              ...this.state,
              paymentStatus: status
            };

            this.props.updateOrder(prepareOrderData(savingOrderData));
            break;
        }
      }
    );
  }

  //Render
  render() {
    const { items } = this.state;

    return (
      <KeyboardAvoidingView
        style={styles.masterContainer}
        behavior={Layout.isIOS ? "padding" : null}
      >
        <ScrollView style={styles.container}>
          <View style={styles.topInfoContainer}>
            <AvenirText weight="demi" style={styles.orderCode}>
              {this.state.code}
            </AvenirText>
            <DateText
              style={styles.orderDate}
              value={new Date(this.state.createdDate) || new Date()}
              datetime="short"
            />
            <View style={styles.orderStatusContainer}>
              <View
                style={[
                  styles.orderStatus,
                  this.state.paymentStatus == OrderPaymentStatus.pending
                    ? styles.orderPendingPayment
                    : null
                ]}
              >
                <Icon.FontAwesome5
                  style={styles.orderStatusIcon}
                  name="money-bill-wave-alt"
                  size={10}
                />
                <AvenirFormattedMessage
                  style={styles.orderStatusText}
                  message={
                    "order_payment_status_" + this.state.paymentStatus
                  }
                />
              </View>
              <View
                style={[
                  styles.orderStatus,
                  this.state.status == OrderStatus.shipping ||
                  this.state.status == OrderStatus.confirmed
                    ? styles.orderPendingShipping
                    : null
                ]}
              >
                <Icon.FontAwesome5
                  style={styles.orderStatusIcon}
                  name="shipping-fast"
                  size={10}
                />
                <AvenirFormattedMessage
                  style={styles.orderStatusText}
                  message={"order_status_" + this.state.status}
                />
              </View>
            </View>
          </View>

          <DefaultPanel containerStyle={styles.topPanel} notitle="true">
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <AvenirFormattedMessage
                  style={styles.sectionTitle}
                  weight="demi"
                  message="order_customer"
                />
              </View>


              {
                !this.state.shippingAddress || Object.keys(this.state.shippingAddress).length === 0 || !this.state.shippingAddress.name ? (
                <AvenirFormattedMessage
                  style={{...styles.buttonLink, color: Colors.textGray}}
                  weight="demi"
                  message="order_customer_unknown"
                />
              ) : (
                <CustomerInfo data={this.state.shippingAddress} />
              )}
            </View>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View
                  style={[
                    styles.orderStatusCircle,
                    this.state.status == OrderStatus.complete
                      ? styles.orderStatusCheckedCircle
                      : null
                  ]}
                >
                  {this.state.status == OrderStatus.complete ? (
                    <Icon.MaterialCommunityIcons
                      style={styles.orderStatusCheckedIcon}
                      name="check-circle-outline"
                      size={20}
                    />
                  ) : (
                    <View style={styles.orderStatusCircleDashedIcon} />
                  )}
                </View>
                <AvenirFormattedMessage
                  style={styles.sectionTitle}
                  weight="demi"
                  message={"order_status_" + this.state.status}
                />
                {(this.state.status == OrderStatus.shipping ||
                  this.state.status == OrderStatus.complete) && (
                  <Menu
                    ref={ref => (this._shipmentMenu = ref)}
                    button={
                      <TouchableOpacity
                        style={{ paddingLeft: 10 }}
                        onPress={() => this._shipmentMenu.show()}
                      >
                        <Icon.Entypo
                          name="dots-three-vertical"
                          size={18}
                          style={{ color: Colors.mainColor }}
                          iconStyle={{ marginRight: 10 }}
                        />
                      </TouchableOpacity>
                    }
                  >
                    <MenuItem onPress={this._openShipmentSetting}>
                      <View style={styles.menuItem}>
                        <Icon.Feather
                          name="edit-3"
                          style={styles.menuIcon}
                          iconStyle={{ marginRight: 10 }}
                          size={18}
                        />
                        <AvenirFormattedMessage
                          weight="demi"
                          message="order_edit_shipment"
                        />
                      </View>
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem onPress={this._cancelShipment}>
                      <View style={styles.menuItem}>
                        <Icon.MaterialIcons
                          name="remove-circle"
                          style={[
                            styles.menuIcon,
                            { color: iOSColors.red }
                          ]}
                          size={18}
                        />
                        <AvenirFormattedMessage
                          weight="demi"
                          message="order_cancel_shipment"
                          style={{ color: iOSColors.red }}
                        />
                      </View>
                    </MenuItem>
                  </Menu>
                )}
              </View>

              {Object.keys(items).length ? (
                <FlatList
                  data={R.values(this.state.items)}
                  extraData={this.state}
                  renderItem={this._renderRow}
                  style={styles.productList}
                  keyExtractor={(item, index) => "order_product_" + index}
                />
              ) : null}

              {this.state.status == OrderStatus.confirmed && (
                <TouchableOpacity
                  onPress={this._openShipmentSetting}
                  style={[
                    styles.roundedButton,
                    styles.roundedButtonDefault
                  ]}
                >
                  <AvenirFormattedMessage
                    style={[
                      styles.roundedButtonLabel,
                      styles.roundedButtonDefaultLabel
                    ]}
                    message="order_mark_as_shipping"
                  />
                </TouchableOpacity>
              )}

              {(this.state.status == OrderStatus.confirmed ||
                this.state.status == OrderStatus.shipping) && (
                <TouchableOpacity
                  onPress={this._updateShipped}
                  style={styles.roundedButton}
                >
                  <AvenirFormattedMessage
                    style={styles.roundedButtonLabel}
                    message="order_mark_as_shipped"
                  />
                </TouchableOpacity>
              )}
              {this._renderShipmentInfo()}
            </View>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View
                  style={[
                    styles.orderStatusCircle,
                    this.state.paymentStatus == OrderPaymentStatus.paid
                      ? styles.orderStatusCheckedCircle
                      : null
                  ]}
                >
                  {this.state.paymentStatus == OrderPaymentStatus.paid ? (
                    <Icon.MaterialCommunityIcons
                      style={styles.orderStatusCheckedIcon}
                      name="check-circle-outline"
                      size={20}
                    />
                  ) : (
                    <View style={styles.orderStatusCircleDashedIcon} />
                  )}
                </View>
                <AvenirFormattedMessage
                  style={styles.sectionTitle}
                  weight="demi"
                  message={
                    "order_payment_status_" + this.state.paymentStatus
                  }
                />
              </View>

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

              <View>
                  <Separator left={0} position="top"/>
                  <TouchableOpacity style={[styles.roundedButton, { marginTop: 10 }, this.state.paymentStatus == OrderPaymentStatus.pending ? styles.roundedButtonDanger : styles.roundedButtonDefault]} onPress={()=>this._updatePaymentStatus(this.state.paymentStatus == OrderPaymentStatus.pending ? OrderPaymentStatus.paid : OrderPaymentStatus.pending)}>
                    <AvenirFormattedMessage
                      style={[styles.roundedButtonLabel, this.state.paymentStatus == OrderPaymentStatus.pending ? styles.roundedButtonDangerLabel : styles.roundedButtonDefaultLabel ]}
                      message={ this.state.paymentStatus == OrderPaymentStatus.pending ? "order_mark_as_paid": "order_clear_paid" }
                    />
                  </TouchableOpacity>
                </View>
            </View>
            <View style={styles.section}>
              <AvenirFormattedMessage
                style={styles.sectionTitle}
                weight="demi"
                message="order_note"
              />
              <AvenirText>{this.state.note}</AvenirText>
            </View>
          </DefaultPanel>
          <View style={{height:40}}></View>
        </ScrollView>
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
      { ...ordersOperations, ...settingsOperations }
    )(OrderViewScreen)
  )
);

//Header option
wrappedComponent.navigationOptions = ({ navigation }) => {
  const { params } = navigation.state;
  return {
    headerTitle: (
      <AvenirFormattedMessage
        style={Styles.headerTitleStyle}
        weight="demi"
        message="order_info"
      />
    ),
    headerRight: () =>
      params && params.headerRight ? params.headerRight : null
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16
  },
  topInfoContainer: {
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 5
  },
  topPanel: {
    // backgroundColor: "#fff",
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
    marginBottom: 10,
    paddingTop: 15,
    paddingBottom: 15
  },
  roundedButtonLabel: {
    fontSize: 16,
    color: "#fff"
  },
  roundedButtonDanger: {
    backgroundColor: Colors.red,
  },
  roundedButtonDefault: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.borderColor
  },
  roundedButtonDefaultLabel: {
    color: Colors.mainColor
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
    marginRight: 10,
    position: "relative"
  },
  image: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 4,
    overflow: 'hidden'
  },
  productBadge: {
    position: "absolute",
    top: -50,
    right: -10
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
  menuItem: {
    flexDirection: 'row',
    alignItems: "center",
    paddingHorizontal: 10
  },
  menuIcon: {
    color: Colors.mainColor,
    paddingRight: 10,
  },
  orderCode: {
    fontSize: 18
  },
  orderDate: {
    color: Colors.textGray,
    marginBottom: 5,
    marginTop: 5
  },
  orderStatusContainer: {
    flexDirection: "row",
    marginTop: 5
  },
  orderStatus: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "flex-end",
    backgroundColor: "#F2F3F6",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 5,
    borderColor: "#fff",
    borderWidth: 1
  },
  orderStatusText: {
    color: "#21252B",
    fontSize: 8,
    textTransform: "uppercase"
  },
  orderStatusIcon: {
    color: "#89919D",
    marginRight: 5
  },
  orderPendingPayment: {
    backgroundColor: "#F6BD8B"
  },
  orderPendingShipping: {
    backgroundColor: "#FCE78A"
  },
  orderStatusCircle: {
    borderRadius: 22,
    borderColor: "#FCE78A",
    borderWidth: 4,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5
  },
  orderStatusCircleDashedIcon: {
    width: 18,
    height: 18,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#F6BD8B",
    borderStyle: "dotted"
  },
  orderStatusCheckedCircle: {
    width: 26,
    height: 26,
    borderRadius: 26,
    borderColor: Colors.green_light,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  orderStatusCheckedIcon: {
    color: Colors.green,
    top: -1,
    left: -0.7
  },
  shipmentInfo: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
    paddingTop: 10
  }
});
