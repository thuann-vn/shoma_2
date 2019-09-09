import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Image
} from "react-native";
import {
  AvenirText,
  AvenirFormattedMessage,
  HeaderButton,
  SearchBar,
  EmptyState,
} from "../../components";
import Colors from "../../constants/Colors";

import { connect } from "react-redux";
import { customersOperations } from "../../modules/customers";
import Styles from "../../constants/Styles";
import Layout from "../../constants/Layout";
import { withGlobalize } from "react-native-globalize";
import { formatMessage } from "../../utils/format";
import Screens from "../../constants/Screens";
import Fuse from "fuse.js";
import Images from "../../constants/Images";
import Animations from "../../constants/Animations";
import { getListCustomers } from "../../utils/customerHelper";

class CustomerListScreen extends React.Component {
  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;

    this.state = {
      customers: [],
      sortable: false,
      selectMode: params && params.selectMode,
      selectCallback: params && params.selectCallback
    };
  }

  async componentDidMount() {
    this.setState({
      customers: await this._getCustomers(this.props.customers)
    });
  }

  async componentWillReceiveProps(nextProps) {
    if (this.props.customers != nextProps.customers) {
      this.setState({
        customers: await this._getCustomers(nextProps.customers)
      });
    }
  }

  async _getCustomers(customers) {
    //Filter by customer type
    let result = getListCustomers(customers);

    //Get sort by order
    result = result.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    
    this.customers = result;
    this.searchableCustomers = new Fuse(result, { keys: ["name"] });
    return result;
  }

  _searchCustomers = searchText => {
    const filteredData = searchText
      ? this.searchableCustomers.search(searchText)
      : this.customers;
    this.setState({ customers: filteredData });
  };

  //RENDER LIST
  _renderHeader = () => {
    return (
      <SearchBar
        placeholder="customer_search_placeholder"
        value={this.state.searchText}
        onSubmitEditing={() => {
          this._searchCustomers(this.state.searchText);
        }}
        onChangeText={text => {
          this.setState({ searchText: text });
        }}
        onClear={() => {
          this._searchCustomers("");
        }}
      />
    );
  };

  _onSelect = item => {
    if (this.state.selectMode) {
      this.state.selectCallback && this.state.selectCallback(item);
      return this.props.navigation.goBack();
    }

    this.props.navigation.navigate(Screens.CustomerOverview, {
      id: item.id,
      title: item.name
    });
  };

  _renderRow = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.rowContainer}
        activeOpacity={0.5}
        onPress={() => {
          this._onSelect(item);
        }}
      >
        <View style={styles.imageContainer}>
          <Image source={Images.defaultAvatar} style={styles.image} />
        </View>
        <View style={styles.customerDetail}>
          <AvenirText style={styles.customerName}>
            {item.code
              ? formatMessage(this.props.globalize, item.code)
              : item.name}
          </AvenirText>

          <AvenirText
            style={styles.customerInfo}
          >
          {item.address + ', ' + item.city + ', ' + item.country}
          </AvenirText>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.customers}
          renderItem={this._renderRow}
          keyExtractor={item => "customer_" + item.id}
          style={{ flex: 1, overflow: "visible" }}
          ListEmptyComponent={
            <EmptyState
              title="empty_customers"
              description="empty_customers_message"
              animation={Animations.empty_shopping_bag}
            />
          }
          contentContainerStyle={styles.sectionListContainer}
          ListHeaderComponent={this._renderHeader}
          SectionSeparatorComponent={({ leadingItem }) =>
            leadingItem ? <View style={{ height: 20 }} /> : null
          }
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    settings: state.settings,
    customers: state.customers
  };
};

const wrappedComponent = withGlobalize(
  connect(
    mapStateToProps,
    customersOperations
  )(CustomerListScreen)
);

//Header option
wrappedComponent.navigationOptions = ({ navigation }) => {
  return {
    headerBackTitle: null,
    headerTitle: (
      <AvenirFormattedMessage
        style={Styles.headerTitleStyle}
        weight="demi"
        message="customer_list"
      />
    ),
    headerRight: ()=>(
      <View>
        <HeaderButton
          icon="plus"
          onPress={() => navigation.navigate(Screens.CustomerDetail)}
        />
        {/* <HeaderButton onPress={params && params.headerRightCallback} label={params && params.isSorting ? "account_save_order": "account_sort"} /> */}
      </View>
    )
  };
};

export default wrappedComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainColor,
    paddingBottom: Layout.bottomOffsetWithoutNav
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
  },
  customerDetail: {
    flex: 1,
    flexDirection: "column"
  },
  customerName: {
    fontSize: 14,
    lineHeight: 14,
    marginTop: 5,
    color: "#333"
  },
  customerInfo: {
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
