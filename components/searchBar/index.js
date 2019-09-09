import React from "react";
import { SearchBar } from "react-native-elements";
import { StyleSheet } from "react-native";
import { formatMessage } from "../../utils/format";
import { withGlobalize } from "react-native-globalize";
import Colors from "../../constants/Colors";

class CustomSearchBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SearchBar
        {...this.props}
        placeholder={formatMessage(this.props.globalize,this.props.placeholder)}
        cancelButtonTitle={formatMessage(this.props.globalize,'common_cancel')}
        cancelButtonProps={{
          color: '#fff',
          buttonTextStyle: {
            fontSize: 13,
          }
        }}
        platform="ios"
        autoCorrect={true}
        returnKeyType="search"
        containerStyle={styles.containerStyle}
        inputStyle={styles.inputStyle}
        inputContainerStyle={styles.inputContainerStyle}
      />
    );
  }
}

export default withGlobalize(CustomSearchBar);

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: Colors.mainColor,
    borderColor: "transparent",
    paddingBottom: 10,
    paddingTop: 10
  },
  inputStyle: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    fontSize: 13,
    paddingVertical: 0,
    minHeight: 0,
    height: 34
  },
  inputContainerStyle: {
    backgroundColor: "#fff",
    minHeight: 34,
    height: 34,
    paddingVertical: 0
  }
});
