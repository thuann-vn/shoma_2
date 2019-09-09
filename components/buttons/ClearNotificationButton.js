import React from "react";
import { connect } from "react-redux";
import { notificationsOperations } from "../../modules/notifications";
import { getListNotifications, clearUnreadNotifications } from "../../utils/localNotificationHelper";
import { IOSButton } from "./StyledButton";
class ClearNotificationButton extends React.Component {
  constructor(props) {
    super(props);
  }

  _clearNotifications  = () => {
    clearUnreadNotifications(this.props);
  }

  render() {
    return (
      <IOSButton
        onPress={this._clearNotifications}
        text="notifications_read_all"
        style={{
          marginRight: 10,
          paddingVertical: 5
        }}
      />
    );
  }
}
const mapStateToProps = state => {
  return {
    notifications: state.notifications
  };
};
export default connect(
  mapStateToProps,
  {
    ...notificationsOperations
  }
)(ClearNotificationButton);
