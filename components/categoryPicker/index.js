import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { AvenirFormattedMessage } from "../text/StyledText";
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import Colors from "../../constants/Colors";
import Screens from "../../constants/Screens";
import { withGlobalize } from "react-native-globalize";
import * as Icon from "@expo/vector-icons";

class CategoryPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      activeCategory: this.props.categories[this.props.value]
    };
  }

  componentWillReceiveProps(newProps) {
      if(newProps.value != this.state.value){
          this.setState({
            value: newProps.value,
            activeCategory: this.props.categories[newProps.value]
          });
      }
  }

  _onSelectCategory = category => {
    this.setState({
        value: category.id,
        activeCategory: category
    });

    if (this.props.onChange) {
      this.props.onChange(category.id);
    }
  };

  _openCategoryList = () => {
    this.props.navigation.navigate(Screens.CategoryList, {
      selectMode: true,
      selectCallback: this._onSelectCategory,
      except: this.props.exceptId
    });
  };

  render() {
    return (
      <TouchableOpacity
        {...this.props}
        style={styles.container}
        activeOpacity={0.7}
        onPress={() => {
          this._openCategoryList();
        }}
      >
        <View style={styles.iconInput}>
          <Icon.AntDesign
            style={styles.toggleIcon}
            name="tagso"
            color={Colors.mainColor}
            size={30}
          />
        </View>
        <View style={{ flex: 1 }}>
          <AvenirFormattedMessage
            style={styles.categoryLabel}
            message={"category"}
          />
          <AvenirFormattedMessage
            style={styles.categoryName}
            message={this.state.activeCategory? this.state.activeCategory.name: "select_category"}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => {
  return {
    categories: state.categories
  };
};
export default withGlobalize(
  withNavigation(
    connect(
      mapStateToProps,
      null
    )(CategoryPicker)
  )
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden"
  },
  iconInput: {
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  labelContainer: {
    paddingTop: 5
  },
  categoryName: {
    marginTop: 5,
    fontSize: 16
  },
  categoryLabel: {
    color: Colors.textGray,
    fontSize: 12
  },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
    overflow: "hidden",
    borderRadius: 4
  },
  iconContainer: {
    position: "relative"
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 14,
    marginTop: 5,
    marginLeft: 10,
    color: "#333"
  },
  text: {
    fontSize: 14
  },
  scrollView: {
    marginTop: 95,
    overflow: "visible",
    marginBottom: 20
  }
});
