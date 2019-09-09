import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SectionList} from "react-native";
import { AvenirText, Icon, AvenirFormattedMessage, Value, IconShower, ClearNotificationButton } from "../../components";
import { settingsOperations } from "../../modules/settings";
import Colors from "../../constants/Colors";
import { connect } from "react-redux";
import Styles from "../../constants/Styles";
import Layout from "../../constants/Layout";
import { getListNotifications } from "../../utils/localNotificationHelper";
import { LocalNotificationTypes } from "../../constants/NotificationTypes";
import { getCategoryById } from "../../utils/categoryHelper";
import { withGlobalize, FormattedRelativeTime } from "react-native-globalize";
import { formatMessage } from "../../utils/format";
import Screens from "../../constants/Screens";

class NotificationsScreen extends React.Component {
  constructor(props) {
		super(props);
    const notifications = getListNotifications(this.props.notifications);
    this.state = {
      data: this._groupData(notifications)
    };
  }

  componentWillReceiveProps(nextProps){
    const notifications = getListNotifications(nextProps.notifications);
    this.setState({
      data: this._groupData(notifications)
    });
  }

  _groupData = (notifications)=>{
    let groups = [];

    Object.keys(notifications).map((key)=>{
      groups.push({
        title: key,
        data: notifications[key]
      })
    })
    return groups;
  }

  _renderRepeatNotification = (item) =>{
    const category = getCategoryById(this.props.categories, item.data.category);
    const account = getAccountById(this.props.accounts, item.data.account);

    const categoryName = category.code ? formatMessage(this.props.globalize, category.code) : category.name;

    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          this.props.setActiveAccount(account.id),
            this.props.navigation.navigate(Screens.History, {
              account: account.id
            });
        }}
      >
        <View style={styles.buttonContainer}>
          <View style={styles.buttonContent}>
            <View style={styles.buttonTitleContainer}>
              {!item.isRead && (
                <AvenirText
                  style={{
                    color: Colors.red,
                    fontSize: 18,
                    marginRight: 5,
                    marginBottom: 4
                  }}
                >
                  ●
                </AvenirText>
              )}
              <AvenirFormattedMessage
                style={styles.messageTitle}
                message="local_notification_repeat_transaction_title"
              />
              <FormattedRelativeTime
                value={new Date(item.date)}
                unit="best"
                style={styles.time}
              />
            </View>
            <View style={styles.label}>
              <IconShower icon={category.icon} size={40} isSquare={true} />
              <AvenirFormattedMessage
                style={styles.messageContent}
                message={item.message}
                category={categoryName}
                account={
                  <AvenirText weight="demi">{account.name}</AvenirText>
                }
                value={
                  <Value
                    style={{
                      color: item.data.value > 0 ? Colors.red : Colors.blue
                    }}
                    currency={account.currency}
                    value={item.data.value}
                  />
                }
              />
              <Icon.MaterialIcons
                style={styles.arrow}
                name="chevron-right"
                size={22}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  _renderRow = ({ item }) => {
    switch(item.data.type){
      case LocalNotificationTypes.repeatTransaction:
        return this._renderRepeatNotification(item);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <SectionList
          contentContainerStyle={{ flexGrow: 1 }}
          sections={this.state.data}
          extraData={this.state}
          keyExtractor={(item, key) => key.toString()}
          renderSectionHeader={({ section }) => (
            <AvenirFormattedMessage
              weight="demi"
              style={styles.sectionTitle}
              message={section.title}
            />
          )}
          ListEmptyComponent={<View style={styles.notification_empty}>
            <Icon.Ionicons style={styles.notification_empty_icon} size={100} name="ios-notifications-outline"/>
            <AvenirFormattedMessage style={styles.notification_empty_des} message="notifications_empty"/>
          </View>}
          renderItem={this._renderRow}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    categories: state.categories,
    accounts: state.accounts,
    settings: state.settings,
    notifications: state.notifications
  };
};

const wrappedComponent = withGlobalize(connect(
  mapStateToProps,
  settingsOperations
)(NotificationsScreen))

wrappedComponent.navigationOptions = () => {
  return {
    headerTransparent: false,
    headerTitle: (<AvenirFormattedMessage style={Styles.headerTitleStyle} weight="demi" message="notifications"/>),
    headerRight: <ClearNotificationButton/>,
    tabBarVisible: false
  };
};
export default wrappedComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingBottom: Layout.bottomOffsetWithoutNav
  },
  previewContainer: {
    flex: 1,
    padding: 40,
    alignItems: "center"
  },
  iconsContainer: {
    flex: 1,
    flexDirection: "column"
  },
  button: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 4,
    shadowColor: Colors.gray,
  },
  buttonContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8
  },
  buttonContent: { paddingLeft: 10, paddingRight: 15, flex: 1 },
  buttonTitleContainer: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center"
  },
  flag: {
    height: 32,
    marginRight: 10,
    borderRadius: 2
  },
  label: {
    flex: 1,
    flexDirection:'row',
    alignItems: 'center',
    paddingTop: 5
  },
  name: {
    fontSize: 16
  },
  code: {
    color: "#777"
  },
  time: {
    color: Colors.textGray,
    paddingLeft: 10
  },
  icon: {
    marginRight: 10
  },
  messageTitle: {
    flex: 1,
    color: Colors.mainColor,
    fontSize: 14,
    textTransform: "uppercase"
  },
  messageContent: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 14,
    textTransform: "uppercase",
    color: Colors.textGray,
    paddingHorizontal: 15,
    backgroundColor: Colors.backgroundColor,
    paddingBottom: 5,
    paddingTop: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: Colors.borderColor,
    borderBottomColor: Colors.borderColor
  },
  arrow: {
    color: Colors.textGray,
    marginLeft: 10
  },
  notification_empty:{
    flex: 1,
    alignItems:'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  notification_empty_icon:{
    color: Colors.textGray,
  },
  notification_empty_des:{
    color: Colors.textGray,
    fontSize: 18
  }
});
