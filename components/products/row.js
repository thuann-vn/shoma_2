import React from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image} from "react-native";
import { AvenirText } from "../text/StyledText";
import Images from "../../constants/Images";
import { formatMessage } from "../../utils/format";
import { withGlobalize } from "react-native-globalize";
import Value from "../value";
import Colors from "../../constants/Colors";

class ProductRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      item: this.props.data
    };
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data != this.state.item) {
      this.setState({
        item: nextProps.data
      });
    }
  }

  render() {
    const { item } = this.state;
    return (
      <TouchableOpacity
        style={styles.rowContainer}
        activeOpacity={0.5}
        {...this.props}
      >
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.image} />
          ) : (
            <Image source={Images.imagePlaceholder} style={styles.image} />
          )}
        </View>
        <View style={styles.productDetail}>
          <AvenirText style={styles.productName}>
            {item.code
              ? formatMessage(this.props.globalize, item.code)
              : item.name}
          </AvenirText>
          <Value
            style={styles.productPrice}
            value={item.price}
            currency={this.props.currency}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

export default withGlobalize(ProductRow);

const styles = StyleSheet.create({
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
    flexDirection: "column"
  },
  productName: {
    fontSize: 14,
    lineHeight: 14,
    marginTop: 5,
    color: "#333"
  },
  productPrice: {
    color: Colors.textGray
  }
});
