import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  FlatList} from 'react-native';
import {
  DefaultPanel,
  AvenirFormattedMessage,
  CustomMaterialTextInput,
  NumberFormatTextInput,
  ImagePicker,
  CategoryPicker,
  HeaderButton,
  AvenirText,
  Value,
  Icon,
  OrderRow,
  CustomerInfo
} from '../../components';
import { productsOperations } from '../../modules/products';
import { connect } from 'react-redux';
import { defaultProductData } from '../../constants/Common';
import { row, col, rowPadding, colPadding, textSmall } from '../../constants/Styles';
import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';
import { formatMessage, formatNumber, formatMoney } from '../../utils/format';
import { withGlobalize } from 'react-native-globalize';
import { getNextId } from '../../utils/stateHelper';
import Layout from '../../constants/Layout';
import { getCurrencySetting } from '../../utils/commonHelper';
import { postImage } from '../../utils/firebaseHelper';
import Carousel, { Pagination } from "react-native-snap-carousel";
import { dateFormat } from '../../utils/dateHelper';
import numberFormat from '../../components/textInput/numberFormat';
import { filterOrderByItem, filterOrderByCustomer } from '../../utils/orderHelper';
import moment from "moment";
import Screens from '../../constants/Screens';
import { getCustomerById } from '../../utils/customerHelper';

class CustomerOverviewScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    let { params = {} } = this.props.navigation.state;
    // params.id = "cd920784-47dd-4c33-bf5c-5a16277d053f";
    // params.id = "f52e6c57-836d-4630-8485-7d00f4ef5d0e";
    if (params.id) {
      this.setState({
        ...this._prepareData(params.id),
        loading: false
      });
    } else {
      this.props.navigation.navigate(Screens.CustomerList);
    }
  }

  _prepareData = id => {
    var customer = getCustomerById(this.props.customers, id);
    let orders = filterOrderByCustomer(this.props.orders, customer.id);
    let revenues = 0;
    let lastOrderDate = null;
    orders.map(order => {
      const { total } = order;
      revenues += total;

      if (!lastOrderDate || moment(lastOrderDate).isAfter(order.createdDate)) {
        lastOrderDate = order.createdDate;
      }
    });

    return {
      lastOrderDate,
      ...customer,
      revenues,
      orders
    };
  };

  _renderOverviewItem = ({ item }) => {
    return (
      <View style={styles.overviewItem}>
        {item.icon}
        <AvenirFormattedMessage
          style={styles.overviewItemTitle}
          message={item.title}
          product={this.state.name}
        />
        <AvenirText weight="demi" style={styles.overviewItemValue}>
          {item.value}
        </AvenirText>

        {item.description ? (
          <AvenirText style={styles.overviewItemDescription}>
            {item.description}
          </AvenirText>
        ) : null}
      </View>
    );
  };

  overview = () => {
    const { slider1ActiveSlide = 0 } = this.state;
    const overviews = [
      {
        icon: (
          <Icon.MaterialCommunityIcons
            color="#fff"
            size={50}
            name="progress-clock"
          />
        ),
        title: "customer_overview_recent_order",
        subtitle: "",
        value: this.state.lastOrderDate
          ? dateFormat(
              this.state.lastOrderDate,
              this.props.settings.dateFormat + " HH:mm"
            )
          : "-"
      },
      {
        icon: <Icon.Ionicons color="#fff" size={50} name="md-clipboard" />,
        title: "customer_overview_revenue",
        description: formatMessage(
          this.props.globalize,
          "customer_overview_revenue_description",
          {
            count: formatNumber(this.props.globalize, this.state.orders.length)
          }
        ),
        value: formatMoney(
          this.props.globalize,
          this.state.revenues,
          this.props.settings.currency
        )
      }
    ];
    return (
      <View style={styles.overviewContainer}>
        <Carousel
          data={overviews}
          renderItem={this._renderOverviewItem}
          hasParallaxImages={true}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          sliderWidth={Layout.window.width}
          itemWidth={Layout.window.width}
          // inactiveSlideShift={20}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          loop={true}
          loopClonesPerSide={2}
          autoplay={true}
          autoplayDelay={500}
          autoplayInterval={3000}
          onSnapToItem={index => this.setState({ slider1ActiveSlide: index })}
        />
        <Pagination
          dotsLength={overviews.length}
          activeDotIndex={slider1ActiveSlide}
          containerStyle={styles.paginationContainer}
          dotColor={"rgba(255, 255, 255, 1)"}
          inactiveDotColor="rgba(255,255,255,0.1)"
          dotStyle={styles.paginationDot}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </View>
    );
  };

  //Empty component
  _renderListEmptyComponent = () => {
    return (
      <AvenirFormattedMessage
        message="common_none_data"
        weight="demi"
        style={styles.noneData}
      />
    );
  };

  //Render
  render() {
    let { loading } = this.state;

    if (loading) return <View />;

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {this.overview()}
        <View style={styles.contentContainer}>
          <DefaultPanel
            containerStyle={styles.infoPanel}
            title="customer_info"
            headerStyle={{ paddingTop: 10 }}
          >
            <CustomerInfo style={styles.customerInfo} data={this.state} />
          </DefaultPanel>

          <DefaultPanel
            containerStyle={styles.recentOrderPanel}
            title="customer_recent_orders"
            headerStyle={{ paddingTop: 10 }}
          >
            <FlatList
              data={this.state.orders}
              renderItem={({ item }) => (
                <OrderRow
                  data={item}
                  onPress={() =>
                    this.props.navigation.navigate(Screens.OrderView, {
                      id: item.id
                    })
                  }
                />
              )}
              keyExtractor={item => "order_" + item.id}
              ListEmptyComponent={this._renderListEmptyComponent}
            />
          </DefaultPanel>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
    customers: state.customers,
    orders: state.orders
  };
};

const wrappedComponent = withGlobalize(connect(mapStateToProps, null)(CustomerOverviewScreen));

//Header option
wrappedComponent.navigationOptions = ({ navigation }) => {
  const { params = {} } = navigation.state;
  return {
    headerBackTitle: null,
    headerTitle: (<AvenirText style={Styles.headerTitleStyle} weight="demi">{params.title || 'Customer Overview'}</AvenirText>),
    headerRight: ()=> (<HeaderButton icon="edit" iconSize={20} onPress={()=> navigation.navigate(Screens.CustomerDetail, {id: params.id})}/>)
  }
}

export default wrappedComponent;

const styles = StyleSheet.create({
  masterContainer: {
    backgroundColor: Colors.mainColor
  },
  container: {
    flex: 1,
    backgroundColor: Colors.mainColor
  },
  contentContainer: {
    backgroundColor: Colors.backgroundColor,
    flexGrow: 1
  },
  overviewContainer: {
    backgroundColor: Colors.mainColor,
    paddingTop: 20
  },
  infoPanel: {
    backgroundColor: "#fff",
    paddingBottom: 20
  },
  recentOrderPanel: {
    backgroundColor: "#fff"
  },
  overviewItem: {
    alignContent: "center",
    alignItems: "center"
  },
  overviewItemTitle: {
    color: "#fff",
    fontSize: 16
  },
  overviewItemDescription: {
    color: "#fff",
    fontSize: 14
  },
  overviewItemValue: {
    color: "#fff",
    fontSize: 16
  },
  customerInfo: {
    paddingHorizontal: 15
  },
  noneData: {
    textAlign: "left",
    fontSize: 16,
    color: "#e6e4e4",
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 10
  }
});
