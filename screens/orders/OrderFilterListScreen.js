import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SectionList,
  InteractionManager
} from "react-native";
import { AvenirText, AvenirFormattedMessage, HeaderButton, SearchBar, EmptyState, Icon, Value, IOSButton, OrderRow, Badge } from "../../components";
import Colors from "../../constants/Colors";

import { connect } from "react-redux";
import R from "ramda";
import { ordersOperations } from "../../modules/orders";
import Styles from "../../constants/Styles";
import Layout from "../../constants/Layout";
import { withGlobalize } from "react-native-globalize";
import Screens from "../../constants/Screens";
import Fuse from 'fuse.js';
import { orderCodeShow } from "../../utils/commonHelper";
import { OrderStatus, OrderPaymentStatus, OrderFilterTypes } from "../../constants/Orders";
import Collapsible from "react-native-collapsible";
import Animations from "../../constants/Animations";
import { countDraftOrders } from "../../utils/orderHelper";
import { dateFormat } from "../../utils/dateHelper";

class OrderFilterListScreen extends React.Component {
  constructor(props) {
    super(props);
    const {params = {}} = this.props.navigation.state;

    this.state = {
      orders: [],
      sortable: false,
      addedDraftOrder: {},
      draftCount: 0,
      isSearching: false,
      filterType: params.filter || OrderFilterTypes.unpaid
    };
  }

  async componentDidMount() {
    InteractionManager.runAfterInteractions(()=>{
      this._initData(this.props);
    })
  }

  async componentWillReceiveProps(nextProps) {
    if (this.props.orders != nextProps.orders) {
      this._initData(nextProps);
    }
  }

  async _initData(props){
     this.setState({
       orders: await this._getOrders(props.orders),
       draftCount: countDraftOrders(props.orders)
     });
  }

  //Get order list
  async _getOrders(orders) {
    //Filter by order type
    let result = [];
    const keys = Object.keys(orders);
    for (var i = 0; i < keys.length; i++) {
      let key = keys[i];
      let order = orders[key];

      //Filter
      var isValid = false;
      if (order.deleted || order.status == OrderStatus.draft) {
        continue;
      }
      
      if (this.state.filterType == OrderFilterTypes.uncomplete) {
        if (
          order.status == OrderStatus.confirmed ||
          order.status == OrderStatus.shipping
        ) {
          isValid = true;
        }
      }else{
        if (order.status == OrderStatus.complete && order.paymentStatus == OrderPaymentStatus.pending) {
          isValid = true;
        }
      }

      if (isValid) {
        order.code = orderCodeShow(
          this.props.settings.orderIncrementPrefix,
          order.increment
        );
        result.push(order);
      }
    }

    //Get sort by order
    result = result.sort((a, b) => {
      return a.createdDate < b.createdDate;
    });
    this.orders = result;
    this.searchableOrders = new Fuse(R.values(orders), {
      keys: [
        "code",
        "shippingAddress.name",
        "shippingAddress.address",
        "shippingAddress.city"
      ]
    });
    return this._groupOrders(result);
  }

  //Group orders
  _groupOrders(data) {
    result = R.groupBy(item => {
       return dateFormat(item.createdDate, this.props.settings.dateFormat);
    }, data);

    return Object.keys(result).map((key)=>{
      return {
        title: key,
        data: result[key]
      }
    })
  }

  //Search order function
  _searchOrders = searchText => {
    const filteredData = searchText
      ? this.searchableOrders.search(searchText)
      : this.orders;
    this.setState({ orders: this._groupOrders(filteredData), isSearching: searchText!='' });
  };

  //RENDER LIST
  _renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <SearchBar
          placeholder="order_search_placeholder"
          value={this.state.searchText}
          onSubmitEditing={() => {
            this._searchOrders(this.state.searchText);
          }}
          onChangeText={text => {
            this.setState({ searchText: text });
          }}
          onClear={() => {
            this._searchOrders("");
          }}
        />
      </View>
    );
  };

  _onSelect = item => {
    if(item.status!=OrderStatus.draft){
      this.props.navigation.navigate(Screens.OrderView, {
        id: item.id
      });
    }else{
      this.props.navigation.navigate(Screens.OrderDetail, {
        id: item.id,
        isDraft: true,
        code: item.code
      });
    }
  };

  _renderRow = ({ item }) => {
    return (
      <OrderRow
        data = {item}
        onPress={() => {
          this._onSelect(item);
        }}
      />
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <SectionList
          sections={this.state.orders}
          renderItem={this._renderRow}
          keyExtractor={item => "order_" + item.id}
          style={{ flex: 1, overflow: "visible" }}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeaderContainer}>
              <AvenirFormattedMessage
                style={styles.sectionHeader}
                message={section.title}
              />
            </View>
          )}
          ListHeaderComponent={this._renderHeader}
          ListEmptyComponent={
            <EmptyState
              title="empty_orders"
              description="empty_orders_message"
              animation = {
                Animations.empty_shopping_bag
              }
            />
          }
          SectionSeparatorComponent={({ leadingItem }) =>
            leadingItem ? <View style={{ height: 20 }} /> : null
          }
          contentContainerStyle={styles.sectionListContainer}
          extraData={this.state}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    settings: state.settings,
    orders: state.orders
  };
};

const wrappedComponent = withGlobalize(connect(
  mapStateToProps,
  {
    ...ordersOperations,
  }
)(OrderFilterListScreen));

//Header option
wrappedComponent.navigationOptions = ({ navigation }) => {
  const { params = {} } = navigation.state;
  return {
    headerBackTitle: null,
    headerTitle: (
      <AvenirFormattedMessage
        style={Styles.headerTitleStyle}
        weight="demi"
        message = {
          params.title ? params.title : "order_list"
        }
      />
    )
  };
}

export default wrappedComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainColor
  },
  sectionListContainer: {
    backgroundColor: Colors.bodyColor,
    flexGrow: 1
  },
  headerContainer: {
    backgroundColor: Colors.bodyColor
  },
  rowContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor
  },
  imageContainer: {
    marginRight: 10
  },
  image: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: Colors.borderColor
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 14,
    marginTop: 5,
    color: "#333"
  },
  text: {
    fontSize: 14
  },
  sectionHeaderContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor
  },
  sectionHeader: {
    paddingHorizontal: 15,
    paddingVertical: 3,
    fontSize: 12,
    color: Colors.textGray,
    backgroundColor: "rgba(255,255,255,1)",
    textTransform: "uppercase"
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
    marginBottom: 10,
    backgroundColor: '#fff'
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
  orderLinkArrow:{
    marginLeft: 10
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
  },
  noticeBar:{
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection:'row',
    backgroundColor: Colors.mainLightColor,
    alignContent: 'center',
    alignItems: 'center'
  },
  noticeBarLabel:{
    flex: 1,
    paddingRight: 10
  }
});
