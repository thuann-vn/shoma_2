import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  InteractionManager,
  ActivityIndicator
} from "react-native";
import {
  AvenirText,
  AvenirFormattedMessage,
  HeaderButton,
  SearchBar,
  EmptyState,
  Value,
  Image,
  ProductRow
} from "../../components";
import Colors from "../../constants/Colors";

import { connect } from "react-redux";
import R from "ramda";
import { productsOperations } from "../../modules/products";
import Styles from "../../constants/Styles";
import Layout from "../../constants/Layout";
import { withGlobalize } from "react-native-globalize";
import { formatMessage } from "../../utils/format";
import Screens from "../../constants/Screens";
import Fuse from 'fuse.js';
import Animations from "../../constants/Animations";
import { getListProducts } from "../../utils/productHelper";

class ProductListScreen extends React.Component {
  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;

    this.state = {
      products: [],
      loading: true,
      sortable: false,
      selectMode: params && params.selectMode,
      selectCallback: params && params.selectCallback
    };
  }

  componentDidMount() {
    this.setState({
      loading: false,
      products: this._getProducts(this.props.products),
    });
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.products != this.props.products){
      this.setState({
        products: this._getProducts(nextProps.products)
      })
    }
  }
  
  _getProducts(products) {
    //Filter by product type
    let result = getListProducts(products);

    //Get sort by order
    result = result.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    this.searchableProducts = new Fuse(result, {keys:['name']});
    return result;
  }

  _searchProducts = (searchText) => {
    const filteredData = searchText ? this.searchableProducts.search(searchText) : this.products;
    this.setState({ products: filteredData});
  }

  //RENDER LIST
  _renderHeader = () => {
    return (
      <SearchBar
        placeholder="product_search_placeholder"
        value={this.state.searchText}
        onSubmitEditing={() => {
          this._searchProducts(this.state.searchText);
        }}
        onChangeText={text => {
          this.setState({ searchText: text });
        }}
        onClear = {()=>{
          this._searchProducts('');
        }}
      />
    );
  };

  _onSelect = item => {
    if(this.state.selectMode){
        this.state.selectCallback && this.state.selectCallback(item);
        return this.props.navigation.goBack();
    }

    this.props.navigation.navigate(Screens.ProductOverview, {
      id: item.id, 
      title: item.name
    });
  };

  _renderRow = ({ item }) => {
    return (
      <ProductRow
        data = {item}
         currency = {
           this.props.settings.currency
         }
         onPress = {
           () => {
             this._onSelect(item);
           }
         }
      />
    );
  };
  
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.products}
          renderItem={this._renderRow}
          keyExtractor={item => item.id}
          style={{ flex: 1, overflow: "visible" }}
          ListHeaderComponent={this._renderHeader}
          ListEmptyComponent={
            <EmptyState
              title="empty_products"
              description="empty_products_message"
              animation={Animations.product_not_found}
            />
          }
          SectionSeparatorComponent={({ leadingItem })=> leadingItem ? (<View style={{height: 20}}></View>) : null}
          contentContainerStyle={styles.sectionListContainer}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    settings: state.settings,
    products: state.products
  };
};

const wrappedComponent = withGlobalize(connect(
  mapStateToProps,
  productsOperations
)(ProductListScreen));

//Header option
wrappedComponent.navigationOptions = ({ navigation }) => {
  return {
    headerBackTitle: null,
    headerTitle: (
      <AvenirFormattedMessage
        style={Styles.headerTitleStyle}
        weight="demi"
        message="product_list"
      />
    ),
    headerRight: () => (
      <View>
        <HeaderButton
          icon="plus"
          onPress={() => navigation.navigate(Screens.ProductDetail)}
        />
        {/* <HeaderButton onPress={params && params.headerRightCallback} label={params && params.isSorting ? "account_save_order": "account_sort"} /> */}
      </View>
    )
  };
}

export default wrappedComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainColor,
    paddingBottom: Layout.bottomOffsetWithoutNav
  },
  loadingIndicator: {
    marginTop: 10
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
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 4
  },
  productDetail: {
    flexDirection: 'column'
  },
  productName: {
    fontSize: 14,
    lineHeight: 14,
    marginTop: 5,
    color: "#333"
  },
  productPrice: {
      color: Colors.textGray
  },
  text: {
    fontSize: 14
  },
  sectionHeaderContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor
  },
  sectionHeader: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textGray,
    backgroundColor: "rgba(255,255,255,.9)",
    marginTop: 0
  },
  sectionListContainer: {
    backgroundColor: Colors.bodyColor,
    flexGrow: 1
  },
});
