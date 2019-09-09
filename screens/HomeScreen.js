import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  InteractionManager,
  Image,
  ActivityIndicator} from "react-native";
import { connect } from "react-redux";
import {
  AvenirFormattedMessage,
  DefaultPanel,
  AvenirText,
  Value
} from "../components";
import Colors from "../constants/Colors";
import Styles from "../constants/Styles";
import Images from "../constants/Images";
// Images
import Layout from "../constants/Layout";
import Screens from "../constants/Screens";
import * as Icon from "@expo/vector-icons";
import { withGlobalize } from "react-native-globalize";
import R from "ramda";
import { productsOperations } from "../modules/products";
import { formatMessage, formatDate, formatNumber } from "../utils/format";
import { sumOrderByDate } from "../utils/orderHelper";
import moment from "moment";
import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";
import { getFontFamily, formatChartNumber } from "../utils/commonHelper";
import {
  VictoryChart,
  VictoryBar,
  VictoryTheme,
  VictoryAxis
} from "victory-native";
import {
  OrderPaymentStatus,
  OrderStatus,
  OrderFilterTypes
} from "../constants/Orders";
import { dateFormat } from "../utils/dateHelper";

moment.locale = 'fr';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPeriod: 0,
      orderCount: 0,
      periods: [],
      topSellProducts: [],
      loading: true
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(this._initData);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.orders != this.props.orders ||
      nextProps.products != this.props.products
    ) {
      this._initData(nextProps);
    }
  }

  _initData = props => {
    if (!props) {
      props = this.props;
    }

    let periodsKeys = ["today", "yesterday", "this_week", "this_month"];
    periods = periodsKeys.map(key => {
      return {
        key: key,
        title: formatMessage(props.globalize, "common_" + key),
        ...this._getPeriodData(props, key)
      };
    });

    //Set state
    this.setState({
      loading: false,
      periods: periods,
      topSellProducts: this._getTopSellProducts(
        periods[this.state.selectedPeriod].period,
        props
      ),
      ...this._countOrders(props)
    });
  };

  //Count orders
  _countOrders(props) {
    var unCompleteOrder = 0;
    var unPaidOrder = 0;

    R.map(order => {
      if(order.deleted){
        return;
      }

      if (
        order.status == OrderStatus.confirmed ||
        order.status == OrderStatus.shipping
      ) {
        unCompleteOrder++;
      }

      if (
        order.status == OrderStatus.complete &&
        order.paymentStatus == OrderPaymentStatus.pending
      ) {
        unPaidOrder++;
      }
    }, R.values(props.orders));

    return { unCompleteOrder, unPaidOrder };
  }

  //Period data initialize
  _getPeriodData = (props, key) => {
    const {
      language
    } = this.props.settings;
    let labels = 7;
    let data = [];
    let orderCount = 0;
    let total = 0;
    let period = {};
    switch (key) {
      case "today":
        //Set labels will be show
        labels = 8;
        period = {
          from: moment().startOf("day"),
          to: moment().endOf("day")
        };

        for (var i = 0; i <= 23; i++) {
          let from = moment()
            .set("hour", i)
            .startOf("hour");
          let to = moment()
            .set("hour", i)
            .endOf("hour");
          let sumOrder = sumOrderByDate(props.orders, from, to);
          orderCount += sumOrder.count;
          total += sumOrder.sum;
          data.push({
            x: dateFormat(from, "hA", language),
            y: formatChartNumber(sumOrder.sum, props.settings)
          });
        }
        break;
      case "yesterday":
        labels = 8;
        period = {
          from: moment()
            .subtract(1, "day")
            .startOf("day"),
          to: moment()
            .subtract(1, "day")
            .endOf("day")
        };

        for (var i = 0; i <= 23; i++) {
          let from = moment()
            .subtract(1, "day")
            .set("hour", i)
            .startOf("hour");
          let to = moment()
            .subtract(1, "day")
            .set("hour", i)
            .endOf("hour");
          let sumOrder = sumOrderByDate(props.orders, from, to);
          orderCount += sumOrder.count;
          total += sumOrder.sum;
          data.push({
            x: dateFormat(from, "hA", language),
            y: formatChartNumber(sumOrder.sum, props.settings)
          });
        }
        break;
      case "this_week":
        labels = 7;
        period = {
          from: moment().startOf("week"),
          to: moment().endOf("week")
        };

        var runDate = moment().startOf("week");
        while (runDate.isSameOrBefore(moment().endOf("week"))) {
          let from = runDate.clone().startOf("day");
          let to = runDate.clone().endOf("day");
          let sumOrder = sumOrderByDate(props.orders, from, to);
          orderCount += sumOrder.count;
          total += sumOrder.sum;
          data.push({
            x: dateFormat(runDate, "ddd", language),
            y: formatChartNumber(sumOrder.sum, props.settings)
          });
          runDate = runDate.subtract(-1, "day");
        }

        break;
      case "this_month":
        labels = 8;
        period = {
          from: moment().startOf("month"),
          to: moment().endOf("month")
        };

        for (
          var i = 0; i < period.to.date(); i++
        ) {
          let from = moment()
            .startOf("month")
            .subtract(-i, "day")
            .startOf("day");

          let to = moment()
            .startOf("month")
            .subtract(-i, "day")
            .endOf("day");
          let sumOrder = sumOrderByDate(props.orders, from, to);
          orderCount += sumOrder.count;
          total += sumOrder.sum;
          data.push({
            x: from.format("D"),
            y: sumOrder.sum
          });
        }
        break;
    }

    return {
      period: period,
      orderCount: orderCount,
      total: total,
      dataChart: data,
      labels: labels
    };
  };

  _getTopSellProducts = (period, props) => {
    if (!props) {
      props = this.props;
    }
    const { products, orders } = props;
    let results = {};

    //Map product with orders
    R.map(order => {
      if (
        !order.deleted &&
        moment(order.createdDate).isSameOrAfter(period.from) &&
        moment(order.createdDate).isSameOrBefore(period.to) &&
        order.items
      ) {
        R.map(item => {
          const id = item.id;
          let product = products[id];

          if (product && !product.deleted) {
            //Check if existed
            existedProducts = results[id];
            if (existedProducts) {
              existedProducts.orderCount++;
              existedProducts.sellCount += item.quantity;
              if (order.createdAt > existedProducts.lastOrderDate) {
                existedProducts.createdAt = order.createdAt;
              }
            } else {
              results[id] = {
                ...product,
                orderCount: 1,
                sellCount: item.quantity,
                lastOrderDate: order.createdAt
              };
            }
          }
        }, R.values(order.items));
      }
    }, R.values(orders));

    //Sort by orders
    topSellProducts = R.sort(
      (a, b) => b.orderCount - a.orderCount,
      R.values(results)
    );
    return topSellProducts.length < 5
      ? topSellProducts
      : topSellProducts.slice(0, 5);
  };

  //Render header
  _renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.orderLinkContainer}>
          <TouchableOpacity
            style={styles.orderLink}
            onPress={() =>
              this.props.navigation.navigate(Screens.OrderFilterList, {
                filter: OrderFilterTypes.unpaid,
                title: "order_unpaid_list"
              })
            }
          >
            <Icon.Ionicons
              color={Colors.mainColor}
              size={24}
              style={styles.iconWidth}
              name="md-clipboard"
            />
            <AvenirFormattedMessage
              message="home_unpaid_order"
              style={styles.orderLinkText}
              text={
                <AvenirFormattedMessage
                  weight="demi"
                  message="home_count_order"
                  order={this.state.unPaidOrder}
                />
              }
            />
            <Icon.Ionicons
              name="ios-arrow-forward"
              style={[styles.orderLinkArrow]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.orderLink}
            onPress={() =>
              this.props.navigation.navigate(Screens.OrderFilterList, {
                filter: OrderFilterTypes.uncomplete,
                title: "order_uncomplete_list"
              })
            }
          >
            <Icon.FontAwesome5
              color={Colors.mainColor}
              size={24}
              name="clipboard-list"
              style={styles.iconWidth}
            />

            <AvenirFormattedMessage
              message="home_uncomplete_order"
              style={styles.orderLinkText}
              text={
                <AvenirFormattedMessage
                  weight="demi"
                  message="home_count_order"
                  order={this.state.unCompleteOrder}
                />
              }
            />
            <Icon.Ionicons
              name="ios-arrow-forward"
              style={styles.orderLinkArrow}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //Render row
  _renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.cardItem, Styles.row, Styles.alignItemsCenter]}
      onPress={() =>
        this.props.navigation.navigate(Screens.ProductOverview, { id: item.id, title: item.name })
      }
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.imgLeft} />
      ) : (
        <Image source={Images.imagePlaceholder} style={styles.imgLeft} />
      )}

      <AvenirText>{item.name}</AvenirText>
      <AvenirText style={styles.numRight}>{item.sellCount}</AvenirText>
    </TouchableOpacity>
  );

  _renderTabChart = period => {
    return (
      <View
        style={[styles.containerTabContent]}
        key={period.key}
        tabLabel={period.title}
        pointerEvents="none"
      >
        <Value
          weight="demi"
          style={{
            ...styles.labelChart,
            ...styles.textStrong
          }}
          value={period.total || 0}
          currency={this.props.settings.currency}
        />
        <AvenirFormattedMessage
          message="home_count_order"
          order={period.orderCount}
          style={styles.labelChart}
        />

        <VictoryChart
          theme={VictoryTheme.material}
          height={220}
          padding={{ right: 20, top: 10, bottom: 40, left: 60 }}
          domainPadding={{ x: 15, y: 10 }}
        >
          <VictoryBar
            style={{ data: { fill: "#fff" } }}
            data={period.dataChart}
            x="x"
            y="y"
            alignment="middle"
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 }
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: { fill: "#fff" },
              grid: { stroke: "rgba(255,255,255,.3)" }
            }}
            tickFormat={t => {
              return t > 1000
                ? `${formatNumber(
                    this.props.globalize,
                    t / 1000
                  )}k`
                : t;
            }}
          />
          <VictoryAxis
            style={{
              tickLabels: { fill: "#fff" },
              grid: { stroke: "rgba(255,255,255,.3)" }
            }}
            tickCount={period.labels}
          />
        </VictoryChart>
      </View>
    );
  };

  _renderListHeaderComponent = (title1 = "products", title2 = "home_count") => {
    return (
      <View style={[styles.headerTable]}>
        <AvenirFormattedMessage style={Styles.textSmall} message={title1} />
        <AvenirFormattedMessage style={Styles.textSmall} message={title2} />
      </View>
    );
  };

  _renderListEmptyComponent = () => {
    return (
      <AvenirFormattedMessage
        message="common_none_data"
        weight="demi"
        style={[styles.noneData]}
      />
    );
  };

  _renderCharts = () => {
    var items = [];
    this.state.periods.map(period => {
      items.push(this._renderTabChart(period));
    });
    return items;
  };

  _changePeriod = ({ i }) => {
    const currentPeriod = this.state.periods[i];
    this.setState({
      selectedPeriod: i,
      topSellProducts: this._getTopSellProducts(currentPeriod.period)
    });
  };

  //Render
  render() {
    const { loading, periods, selectedPeriod } = this.state;

    if (loading) {
      return <ActivityIndicator />;
    }

    const currentPeriod = periods[selectedPeriod];
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollViewContainer}
          contentContainerStyle={styles.scrollViewContainer}
        >
          <View style={styles.contentContainer}>
            <ScrollableTabView
              onChangeTab={this._changePeriod}
              style={{ backgroundColor: Colors.mainColor, height: 350 }}
              tabBarActiveTextColor={Colors.mainColor}
              renderTabBar={() => (
                <DefaultTabBar
                  style={{ height: 30, borderBottomWidth: 0 }}
                  backgroundColor={Colors.mainColor}
                  activeTextColor="#fff"
                  inactiveTextColor="#fff"
                  textStyle={{
                    color: "#fff",
                    fontWeight: "300",
                    fontFamily: getFontFamily(),
                    textTransform: "uppercase",
                    fontSize: 12
                  }}
                  tabStyle={{ paddingVertical: 2, borderBottomWidth: 0 }}
                  underlineStyle={{
                    borderBottomWidth: 0,
                    borderBottomColor: "#fff",
                    backgroundColor: "#fff",
                    height: 2
                  }}
                />
              )}
              initialPage={0}
              prerenderingSiblingsNumber={0}
            >
              {this._renderCharts()}
            </ScrollableTabView>

            {this._renderHeader()}

            <DefaultPanel
              containerStyle={[styles.sectionContainer]}
              title="home_top_sell"
              description="home_top_sell_des"
              descriptionParams={{
                period: currentPeriod.title.toLowerCase()
              }}
              topTitle={currentPeriod.title.toUpperCase()}
            >
              <FlatList
                keyExtractor={item => item.id}
                data={this.state.topSellProducts}
                style={styles.listStyle}
                renderItem={this._renderItem}
                contentContainerStyle={{ paddingHorizontal: 10 }}
                ListHeaderComponent={this._renderListHeaderComponent()}
                ListEmptyComponent={this._renderListEmptyComponent()}
              />
            </DefaultPanel>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    settings: state.settings,
    products: state.products,
    orders: state.orders
  };
};

const wrappedComponent = withGlobalize(
  connect(
    mapStateToProps,
    productsOperations
  )(HomeScreen)
);

//Header option
wrappedComponent.navigationOptions = () => {
  return {
    headerBackTitle: null,
    headerTitle: (
      <AvenirFormattedMessage
        style={Styles.headerTitleStyle}
        weight="demi"
        message="home"
      />
    )
  };
};

export default wrappedComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainColor
  },
  scrollViewContainer: {
    backgroundColor: Colors.mainColor
    // minHeight: Layout.window.height
  },
  contentContainer: {
    backgroundColor: Colors.backgroundColor,
    paddingBottom: Layout.bottomOffset
  },
  cardItem: {
    // width: 220
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 1,
    paddingVertical: 10
  },
  orderCount: {
    fontSize: 14,
    color: Colors.textGray
  },
  lastOrderDate: {
    fontSize: 14,
    color: Colors.textGray
  },
  text: {
    fontSize: 14
  },
  sectionContainer: {
    paddingTop: 20,
    backgroundColor: "#fff"
  },
  listStyle: {
    marginTop: 10,
    paddingBottom: 20
  },

  orderLinkContainer: {
    backgroundColor: "#fff"
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
  orderLinkArrow: {
    marginLeft: 10
  },
  labelChart: {
    color: "white",
    fontSize: 12,
    justifyContent: "center",
    textAlign: "center",
    marginVertical: 3
  },
  textStrong: {
    fontSize: 20
  },
  containerTabContent: {
    height: 300,
    backgroundColor: Colors.mainColor,
    justifyContent: "center",
    paddingTop: 10
  },
  containerChart: {
    marginTop: 10
  },
  iconWidth: {
    width: 30,
    textAlign: "center"
  },
  noneData: {
    marginTop: 15,
    justifyContent: "center",
    textAlign: "center",
    fontSize: 16,
    color: "#e6e4e4"
  },
  headerTable: {
    justifyContent: "space-between",
    flexWrap: "nowrap",
    flexDirection: "row",
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
    paddingBottom: 6
  },
  footerTable: {
    paddingTop: 15,
    paddingBottom: 0,
    borderBottomWidth: 0
  },
  imgLeft: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 4,
    marginRight: 10
  },
  numRight: {
    marginLeft: "auto",
    paddingRight: 5
  }
});
