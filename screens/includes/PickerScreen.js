import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList} from "react-native";
import { AvenirText, Icon, Separator, AvenirFormattedMessage, HeaderButton, SearchBar } from "../../components";
import { settingsOperations } from "../../modules/settings";
import Colors from "../../constants/Colors";
import { connect } from "react-redux";
import Styles from "../../constants/Styles";
import Layout from "../../constants/Layout";
import { Header } from 'react-native-elements';
import R from 'ramda';
import Fuse from "fuse.js";

class PickerScreen extends React.Component {
  constructor(props) {
    super(props);

    const { params = {} } = this.props.navigation.state;

    this.state = {
      //Data must be array: [{ label: 'Label', value: 'Value' }]
      title: params.title,
      originalData: params.data,
      data: params.data,
      value: params ? params.value : null,
      initialIndex: this._getSelectedIndex(params.data,params.value)
    };

    this.searchableData = new Fuse(params.data, {
      keys: ["label", "value"]
    });
  }

  _onSelect = key => {
    if (
      this.props.navigation.state.params &&
      this.props.navigation.state.params.callback
    ) {
      this.props.navigation.state.params.callback(key);
    }
    this.props.navigation.pop();
  };

  _renderCheckedIcon = value => {
    if (this.state.value == value) {
      return (
        <Icon.Ionicons
          name="ios-checkmark-circle"
          color={Colors.mainColor}
          size={22}
        />
      );
    }
  };

  _getSelectedIndex = (data, value) => {
    let selectedIndex = R.findIndex(item => item.value == value, data);
    return selectedIndex || 0
  };

  _renderRow = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.value}
        style={styles.button}
        onPress={() => this._onSelect(item.value)}
      >
        <View style={styles.label}>
          <AvenirText style={styles.name}>{item.label}</AvenirText>
        </View>
        {this._renderCheckedIcon(item.value)}
      </TouchableOpacity>
    );
  };

  _getItemLayout(data, index) {
    const itemHeight = 48;
    return {
      length: itemHeight,
      offset: itemHeight * index,
      index
    };
  }

  _search = searchText => {
    const filteredData = searchText
      ? this.searchableData.search(searchText)
      : this.state.originalData;

    this.setState({ data: filteredData, initialIndex:0 });

    setTimeout(()=>{
      this.flatListRef.scrollToOffset({ offset: 0, animated: false });
    },0)
  };

  //RENDER LIST
  _renderHeader = () => {
    return (
      <SearchBar
        style={styles.searchBar}
        placeholder="common_picker_search_placeholder"
        value={this.state.searchText}
        onSubmitEditing={() => {
          this._search(this.state.searchText);
        }}
        onChangeText={text => {
          this.setState({ searchText: text });
        }}
        onClear={() => {
          this._search("");
        }}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          containerStyle={{
            height: 50,
            paddingTop: 0,
            borderBottomWidth: 0
          }}
          backgroundColor={Colors.mainColor}
          centerComponent={
            <AvenirFormattedMessage
              style={Styles.headerTitleStyle}
              weight="demi"
              message={this.state.title || "common_picker"}
            />
          }
          rightComponent={
            <HeaderButton
              label="common_close"
              onPress={() => this.props.navigation.pop()}
            />
          }
        />

        <FlatList
          data={this.state.data}
          keyExtractor={(item, index) => index}
          renderItem={this._renderRow}
          ItemSeparatorComponent={() => <Separator left={0} />}
          ref={ref => {
            this.flatListRef = ref;
          }}
          initialScrollIndex={this.state.initialIndex}
          getItemLayout={(data, index) => this._getItemLayout(data, index)}
          ListHeaderComponent={this._renderHeader}
          stickyHeaderIndices={[0]}
          maxToRenderPerBatch={15}
          initialNumToRender={15}
          style={{ flex: 1 }}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    settings: state.settings
  };
};
export default connect(
  mapStateToProps,
  settingsOperations
)(PickerScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainColor,
    paddingBottom: Layout.bottomOffsetWithoutNav
  },
  button: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 48
  },
  flag: {
    height: 32,
    marginRight: 10,
    borderRadius: 2
  },
  label: {
    flex: 1
  },
  name: {
    fontSize: 16
  },
  code: {
    color: "#777"
  },
  flatListContainer: {
    backgroundColor: Colors.bodyColor,
    flexGrow: 1
  }
});
