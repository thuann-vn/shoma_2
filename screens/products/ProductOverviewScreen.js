import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  FlatList} from 'react-native';
import {
  DefaultPanel,
  AvenirFormattedMessage,
  HeaderButton,
  AvenirText,
  Icon,
  OrderRow} from '../../components';
import { connect } from 'react-redux';
import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';
import { formatMessage, formatNumber, formatMoney } from '../../utils/format';
import { withGlobalize } from 'react-native-globalize';
import Layout from '../../constants/Layout';
import Carousel, { Pagination } from "react-native-snap-carousel";
import { dateFormat } from '../../utils/dateHelper';
import { filterOrderByItem } from '../../utils/orderHelper';
import moment from "moment";
import Screens from '../../constants/Screens';

class ProductOverviewScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    let { params = {} } = this.props.navigation.state;
    // params.id = "2167b513-b05b-4297-aecb-9115700969e7";
    // params.id = "45de4053-8e18-4e14-b168-1f75aa81cde2";
    if (params.id) {
      this.setState({
        ...this._prepareData(params.id),
        loading: false
      });
    } else {
      this.props.navigation.navigate(Screens.Home);
    }
  }

  _prepareData = id => {
    var product = this.props.products[id];
    let orders = filterOrderByItem(this.props.orders, product.id);
    let revenues = 0;
    let lastOrderDate = null;
    orders.map(order => {
      const { price, quantity } = order.items[id];
      revenues += price * quantity;

      if (!lastOrderDate || moment(lastOrderDate).isAfter(order.createdDate)) {
        lastOrderDate = order.createdDate;
      }
    });

    return {
      ...product,
      revenues,
      orders,
      lastOrderDate
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
        title: "product_overview_recent_order",
        subtitle: "",
        value: this.state.lastOrderDate
          ? dateFormat(new Date(), this.props.settings.dateFormat + " HH:mm")
          : ""
      },
      {
        icon: <Icon.Ionicons color="#fff" size={50} name="md-clipboard" />,
        title: "product_overview_revenue",
        description: formatMessage(
          this.props.globalize,
          "product_overview_revenue_description",
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
            containerStyle={styles.topPanel}
            title="product_recent_orders"
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
    products: state.products,
    orders: state.orders
  };
};

const wrappedComponent = withGlobalize(connect(mapStateToProps, null)(ProductOverviewScreen));

//Header option
wrappedComponent.navigationOptions = ({ navigation }) => {
  const { params = {} } = navigation.state;
  return {
    headerBackTitle: null,
    headerTitle: (<AvenirText style={Styles.headerTitleStyle} weight="demi">{params.title || 'Product Overview'}</AvenirText>),
    headerRight: ()=> (<HeaderButton icon="edit" iconSize={20} onPress={()=> navigation.navigate(Screens.ProductDetail, {id: params.id})}/>)
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
  topPanel: {
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
  noneData: {
    textAlign: "center",
    fontSize: 16,
    color: "#e6e4e4",
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 10
  }
});
