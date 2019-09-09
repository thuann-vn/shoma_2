import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  InteractionManager
} from "react-native";
import { connect } from "react-redux";
import { 
  AvenirFormattedMessage, 
  HeaderButton, 
  SearchBar, 
  DefaultPanel,
  CardComponent,
  ProductRow,
  EmptyState,
} from "../../components";
import Colors from "../../constants/Colors";
import Styles from "../../constants/Styles";
import Layout from "../../constants/Layout";
import Screens from "../../constants/Screens";
import * as Icon from '@expo/vector-icons';
import { withGlobalize } from "react-native-globalize";
import R from 'ramda';
import { dateFormat } from "../../utils/dateHelper";
import { productsOperations } from "../../modules/products";
import Fuse from "fuse.js";
import Collapsible from "react-native-collapsible";
import Animations from "../../constants/Animations";
import { getListProducts } from "../../utils/productHelper";

class ProductMainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topSellProducts: [],
      isSearching: false
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(this._getTopSellProducts);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.orders != this.props.orders ||
      nextProps.products != this.props.products
    ) {
      this._getTopSellProducts(nextProps);
    }
  }

  _getTopSellProducts = props => {
    if (!props) {
      props = this.props;
    }
    const { products, orders } = props;
    let results = {};

    //Map product with orders
    R.map(order => {
      if (!order.deleted && order.items) {
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
    lastOrderProducts = R.sort(
      (a, b) => b.createdAt - a.createdAt,
      R.values(results)
    );

    //Searchable products
    searchableProducts = R.sort(
      (a, b) => a.name.localeCompare(b.name),
      R.values(products)
    );
    this.searchableProducts = new Fuse(searchableProducts, { keys: ["name"] });

    //Set state
    this.setState({
      topSellProducts:
        topSellProducts.length < 5
          ? topSellProducts
          : topSellProducts.slice(0, 5),
      lastOrderProducts:
        lastOrderProducts.length < 5
          ? lastOrderProducts
          : lastOrderProducts.slice(0, 5)
    });
  };

  //Search products
  _searchProducts = searchText => {
    if(searchText){
      const filteredData = this.searchableProducts.search(searchText);
      this.setState({ searchProducts: filteredData, isSearching: true });
    }else{
      this.setState({ isSearching: false });
    }
  };

  //Render header
  _renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <SearchBar
          placeholder="product_search_placeholder"
          value={this.state.searchText}
          onSubmitEditing={() => {
            this._searchProducts(this.state.searchText);
          }}
          onChangeText={text => {
            this.setState({ searchText: text });
          }}
          onClear={() => {
            this._searchProducts("");
          }}
        />
        <Collapsible
          style={styles.productLinkContainer}
          collapsed={this.state.isSearching}
        >
          <TouchableOpacity
            style={styles.productLink}
            onPress={() =>
              this.props.navigation.navigate(Screens.ProductList)
            }
          >
            <Icon.Feather color={Colors.mainColor} size={24} name="tag" />
            <AvenirFormattedMessage
              message="product_all_list"
              count={getListProducts(this.props.products).length}
              style={styles.productLinkText}
            />
            <Icon.Ionicons
              name="ios-arrow-forward"
              style={styles.productLinkArrow}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.productLink}
            onPress={() =>
              this.props.navigation.navigate(Screens.CategoryList)
            }
          >
            <Icon.Feather
              color={Colors.mainColor}
              size={24}
              name="folder"
            />

            <AvenirFormattedMessage
              message="categories"
              style={styles.productLinkText}
            />
            <Icon.Ionicons
              name="ios-arrow-forward"
              style={styles.productLinkArrow}
            />
          </TouchableOpacity>
        </Collapsible>
      </View>
    );
  };

  //Render row
  _renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardItem}
      onPress={() =>
        this.props.navigation.navigate(Screens.ProductOverview, { id: item.id, title: item.name })
      }
    >
      <CardComponent header={item.name} image={item.image}>
        <AvenirFormattedMessage
          style={styles.orderCount}
          message="product_order_count"
          count={item.orderCount}
        />
      </CardComponent>
    </TouchableOpacity>
  );

  _renderLastItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardItem}
      onPress={() =>
        this.props.navigation.navigate(Screens.ProductOverview, { id: item.id, title: item.name })
      }
    >
      <CardComponent header={item.name} image={item.image}>
        <AvenirFormattedMessage
          style={styles.lastOrderDate}
          message="product_last_order"
          date={dateFormat(item.lastOrderDate)}
        />
      </CardComponent>
    </TouchableOpacity>
  );

  //Render search list
  _renderSearchList = () => {
    return (
      <FlatList
        data={this.state.searchProducts}
        renderItem={({ item }) => (
          <ProductRow currency={this.props.settings.currency} data={item} />
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <EmptyState
            title="empty_products"
            description="empty_products_message"
            animation={Animations.product_not_found}
          />
        }
        SectionSeparatorComponent={({ leadingItem }) =>
          leadingItem ? <View style={{ height: 20 }} /> : null
        }
        contentContainerStyle={styles.sectionListContainer}
      />
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


  //Render top sell product
  _renderTopSellProduct = () => {
    return (
      <View>
        <DefaultPanel
          containerStyle={[styles.sectionContainer]}
          title="product_top_sell"
        >
          <FlatList
            keyExtractor={item => item.id}
            data={this.state.topSellProducts}
            horizontal={true}
            style={styles.listStyle}
            renderItem={this._renderItem}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            ListEmptyComponent={this._renderListEmptyComponent}
          />
        </DefaultPanel>

        <DefaultPanel
          containerStyle={[styles.sectionContainer]}
          title="product_recent_sell"
        >
          <FlatList
            keyExtractor={item => item.id}
            data={this.state.lastOrderProducts}
            horizontal={true}
            style={styles.listStyle}
            renderItem={this._renderLastItem}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            ListEmptyComponent={this._renderListEmptyComponent}
          />
        </DefaultPanel>
      </View>
    );
  };

  //Render
  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollViewContainer}
          contentContainerStyle={styles.scrollViewContainer}
        >
          <View style={styles.contentContainer}>
            {this._renderHeader()}
            {this.state.isSearching
              ? this._renderSearchList()
              : this._renderTopSellProduct()}
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

const wrappedComponent = withGlobalize(connect(
  mapStateToProps,
  productsOperations
)(ProductMainScreen));

//Header option
wrappedComponent.navigationOptions = ({ navigation }) => {
  return {
    headerBackTitle: null,
    headerTitle: (
      <AvenirFormattedMessage
        style={Styles.headerTitleStyle}
        weight="demi"
        message="products"
      />
    ),
    headerRight: () =>(
      <View>
        <HeaderButton
          icon="plus"
          onPress={() => navigation.navigate(Screens.ProductDetail)}
        />
      </View>
    )
  };
}

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
    paddingBottom: Layout.bottomOffset,
    minHeight: Layout.window.height
  },
  cardItem: {
    width: 220
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

  productLinkContainer: {
    backgroundColor: "#fff"
  },
  productLink: {
    flexDirection: "row",
    paddingVertical: 12,
    alignContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 1
  },
  productLinkText: {
    flex: 1,
    marginLeft: 5
  },
  productLinkIcon: {
    color: Colors.mainColor
  },
  productLinkArrow: {
    marginLeft: 10
  },
  sectionListContainer: {
    backgroundColor: Colors.bodyColor,
    flexGrow: 1
  },
  noneData: {
    textAlign: "center",
    fontSize: 16,
    color: "#e6e4e4",
    paddingLeft: 5
  },
});
