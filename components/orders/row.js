import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { AvenirText, AvenirFormattedMessage } from "../text/StyledText";
import { orderCodeShow } from "../../utils/commonHelper";
import { OrderPaymentStatus, OrderStatus } from "../../constants/Orders";
import Value from "../value";
import * as Icon from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { connect } from "react-redux";

class OrderRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.data,
    };
  }

  componentWillReceiveProps = (nextProps)=>{
      if(this.state.item != nextProps.data){
        this.setState({
          item: nextProps.data
        })
      }
  }

  _renderOrderStatus(item){
    if (item.status != OrderStatus.draft) {
      return  (
         <View style={styles.orderStatusContainer}>
            <View
              style={[
                styles.orderStatus,
                item.paymentStatus == OrderPaymentStatus.pending
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
                message={"order_payment_status_" + item.paymentStatus}
              />
            </View>
            <View
              style={[
                styles.orderStatus,
                item.status == OrderStatus.shipping ||
                item.status == OrderStatus.confirmed
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
                message={"order_status_" + item.status}
              />
            </View>
          </View>
      )
    }
    return null;
  }

  render() {
    const { item } = this.state;
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.5}
        {...this.props}
      >
        <View style={styles.orderLeft}>
          <AvenirText style={styles.orderCode} weight="demi">
            {orderCodeShow(
              item.status == OrderStatus.draft
                ? this.props.settings.orderDraftIncrementPrefix
                : this.props.settings.orderIncrementPrefix,
              item.increment
            )}
          </AvenirText>
          {item.shippingAddress && item.shippingAddress.name ? (
            <AvenirText style={styles.orderCustomer}>
              {item.shippingAddress.name}
            </AvenirText>
          ) : (
            <AvenirFormattedMessage
              style={styles.orderCustomer}
              message="order_customer_unknown"
            />
          )}
          {/* <AvenirText style={styles.orderCustomerAddress}>{getOrderShippingAddress(item.shippingAddress)}</AvenirText> */}
         {this._renderOrderStatus(item)}
        </View>
        <View style={styles.orderRight}>
          <View style={styles.orderPrice}>
            <Value
              weight="demi"
              style={styles.orderTotal}
              value={item.total}
              currency={this.props.settings.currency}
            />
          </View>
          <View style={styles.orderImage} />
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => {
  return {
    settings: state.settings
  };
};

export default connect(
  mapStateToProps, null
)(OrderRow);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor
  },
  text: {
    fontSize: 14
  },
  orderLeft: {
    flexDirection: "column",
    flex: 1
  },
  orderCode: {
    borderRadius: 2,
    fontSize: 14,
    overflow: "hidden"
  },
  orderCustomer: {
    fontSize: 13,
    marginTop: 3
  },
  orderCustomerAddress: {
    fontSize: 12
  },
  orderDate: {
    fontSize: 10,
    color: Colors.textGray
  },
  orderLinkContainer: {
    marginBottom: 10
  },
  orderLink: {
    flexDirection: "row",
    paddingVertical: 12,
    alignContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 1
  },
  orderLinkText: {
    flex: 1,
    marginLeft: 5
  },
  orderLinkIcon: {
    color: Colors.mainColor
  },
  orderRight: {},
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
    marginBottom: 2,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 5
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
  orderTotal: {
    textAlign: "right",
    fontSize: 16
  },
  orderPendingPayment: {
    backgroundColor: "#F6BD8B"
  },
  orderPendingShipping: {
    backgroundColor: "#FCE78A"
  }
});
