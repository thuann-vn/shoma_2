import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SectionList,
  Image
} from "react-native";
import { AvenirText, AvenirFormattedMessage, HeaderButton, SearchBar, EmptyState } from "../../components";
import Colors from "../../constants/Colors";

import { connect } from "react-redux";
import R from "ramda";
import { categoriesOperations } from "../../modules/categories";
import Styles from "../../constants/Styles";
import Layout from "../../constants/Layout";
import { withGlobalize } from "react-native-globalize";
import { formatMessage } from "../../utils/format";
import Screens from "../../constants/Screens";
import { getCategoryList } from "../../utils/categoryHelper";
import Fuse from 'fuse.js';
import Images from "../../constants/Images";
import Animations from "../../constants/Animations";

class CategoryListScreen extends React.Component {
  constructor(props) {
    super(props);
    const { params = {} } = this.props.navigation.state;
    this.state = {
      categories: [],
      sortable: false,
      selectMode: params && params.selectMode,
      selectCallback: params && params.selectCallback
    };
  }

  async componentDidMount() {
    this.props.navigation.setParams({ headerRightCallback: this._sortToggle });

    this.setState({
      categories: await this._getCategories(this.props.categories),
    });
  }

  async componentWillReceiveProps(nextProps) {
    if(this.props.categories != nextProps.categories){
      this.setState({
        categories: await this._getCategories(
          nextProps.categories
        )
      });
    }
  }
  
  async _getCategories(categories) {
    //Filter by category type
    let result = getCategoryList(categories);

    //Get sort by order
    result = result.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    this.categories = result;
    this.searchableCategories = new Fuse(result, {keys:['name']});
    return this._groupCategories(result);
  }

  _groupCategories(data){
    result = R.groupBy(item => (item.isHide ? "hide" : "show"), data);

    let returnData = [];
    if (result.show) {
      returnData.push({
        title: "category_showing",
        data: result.show || []
      });
    }

    if (result.hide) {
      returnData.push({
        title: "category_hided",
        data: result.hide || []
      });
    }

    return returnData;
  }

  _searchCategories = (searchText) => {
    const filteredData = searchText ? this.searchableCategories.search(searchText) : this.categories;
    this.setState({ categories: this._groupCategories(filteredData)});
  }

  //RENDER LIST
  _renderHeader = () => {
    return (
      <SearchBar
        placeholder="category_search_placeholder"
        value={this.state.searchText}
        onSubmitEditing={() => {
          this._searchCategories(this.state.searchText);
        }}
        onChangeText={text => {
          this.setState({ searchText: text });
        }}
        onClear = {()=>{
          this._searchCategories('');
        }}
      />
    );
  };

  _onSelect = item => {
    if(this.state.selectMode){
      this.state.selectCallback && this.state.selectCallback(item);
      return this.props.navigation.goBack();
    }

    this.props.navigation.navigate(Screens.CategoryDetail, {
      id: item.id,
      isSystem: item.code
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
          {item.image ? ( <Image source={{uri:item.image}} style={styles.image} /> ) : ( <Image source={Images.imagePlaceholder} style={styles.image} /> )}
        </View>
        <AvenirText
          style={{
            ...styles.subtitle,
            color: item.isHide ? Colors.textGray : Colors.textColor
          }}
        >
          {item.code
            ? formatMessage(this.props.globalize, item.code)
            : item.name}
        </AvenirText>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <SectionList
          sections={this.state.categories}
          renderItem={this._renderRow}
          keyExtractor={item => "category_" + item.id}
          style={{ flex: 1, overflow: "visible" }}
          // ItemSeparatorComponent={({ leadingItem }) =>
          //   leadingItem ? <Separator left={0} /> : null
          // }
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
              title="empty_categories"
              description="empty_categories_message"
              animation={Animations.empty_shopping_bag}
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
    categories: state.categories
  };
};

const wrappedComponent = withGlobalize(connect(
  mapStateToProps,
  categoriesOperations
)(CategoryListScreen));

//Header option
wrappedComponent.navigationOptions = ({ navigation }) => {
  return {
    headerBackTitle: null,
    headerTitle: (
      <AvenirFormattedMessage
        style={Styles.headerTitleStyle}
        weight="demi"
        message="category_list"
      />
    ),
    headerRight: ()=> (
      <View>
        <HeaderButton
          icon="plus"
          onPress={() => navigation.navigate(Screens.CategoryDetail)}
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
    backgroundColor: Colors.bodyColor,
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

  sectionListContainer: {
    backgroundColor: Colors.bodyColor,
    flexGrow: 1
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
  sortList: {
    flex: 1
  }
});
