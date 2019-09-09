import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Animated,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { StoreReview } from "expo";
import * as Icon from '@expo/vector-icons';
import { randomColor } from "../../utils";
import Colors from "../../constants/Colors";
import { withNavigation } from "react-navigation";
import screens from "../../constants/Screens";
import { connect } from "react-redux";
import { settingsOperations } from "../../modules/settings";
import moment from "moment";
import Layout from "../../constants/Layout";

const BUTTON_WIDTH = 60;

class AddButton extends Component {
  constructor(props) {
    super(props);
  }

  activation = new Animated.Value(0);
  state = {
    measured: false,
    active: false,
    adsClosed: true
  };

  togglePressed = () => {
    this.props.navigation.navigate(screens.TransactionDetail, {
      callback: this._onCallback
    });
  };

  _onCallback = () => {
    if (
      !this.props.settings.lastTimeAskReview ||
      Math.abs(moment().diff(this.props.settings.lastTimeAskReview, "day")) > 3
    ) {
      //setLastTimeAskReview
      if (StoreReview.isSupported()) {
        StoreReview.requestReview();
      }
      this.props.setReviewTime(new Date());
    }
  };

  render() {
    const activationRotate = this.activation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "135deg"]
    });

    const activationScale = this.activation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.25, 1]
    });

    return (
      <View pointerEvents="box-none" style={Styles.container}>
        <TouchableWithoutFeedback onPress={this.togglePressed}>
          <Animated.View
            style={[
              Styles.toggleButton,
              {
                transform: [
                  { rotate: activationRotate },
                  { scale: activationScale }
                ]
              }
            ]}
          >
            <Icon.Feather name="plus" style={Styles.toggleIcon} />
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

AddButton.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      routeName: PropTypes.string,
      color: PropTypes.string
    })
  )
};

AddButton.defaultProps = {
  routes: [...new Array(2)].map(() => ({
    color: randomColor()
  }))
};

const Styles = {
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  toggleButton: {
    top: 15,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    width: BUTTON_WIDTH,
    height: BUTTON_WIDTH,
    borderRadius: BUTTON_WIDTH,
    backgroundColor: Layout.isIOS ? Colors.tabIconSelected : '#fff',
    borderWidth: Layout.isIOS  ? 0 : 4,
    borderColor: Layout.isIOS ? Colors.backgroundColor : Colors.mainColor,
  },
  toggleIcon: {
    fontSize: 30,
    color: Layout.isIOS ? "#fff" : Colors.mainColor
  },
  actionsWrapper: {
    position: "absolute",
    bottom: 0
  },
  actionContainer: {
    position: "absolute"
  },
  actionContent: {
    flex: 1,
    width: 50,
    height: 50,
    borderRadius: 50
  }
};

const mapStateToProps = state => {
  return {
    settings: state.settings
  };
};
const AddButtonContainer = connect(
  mapStateToProps,
  {
    ...settingsOperations
  }
)(withNavigation(AddButton));

export { AddButtonContainer as AddButton };
