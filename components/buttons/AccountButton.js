import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import * as Icon from '@expo/vector-icons';
import { AvenirText, AvenirFormattedMessage } from "../text/StyledText";
import Value from "../value";
import Colors from "../../constants/Colors";
import { IconShower } from "../icon";
import AccountTypes from "../../constants/AccountTypes";
import { withGlobalize } from "react-native-globalize";
import { formatMessage, formatNumber } from "../../utils/format";

class AccountButton extends React.Component {
  constructor(props){
    super(props);
  }

  _renderBalance = ()=>{
    const {account, currency} = this.props;
    if(account.type == AccountTypes.Credit){
       return (
         <View style={styles.balanceContainer}>
           <View style={styles.creditLimitBox}>
             <AvenirFormattedMessage
              style={styles.balance} 
              weight="demi"
              message={account.balance >= 0 ? "account_credit_current_balance" : "account_credit_used_balance"}
              limit={
                <Value
                weight="demi"
                value={account.creditLimit}
                currency={currency}
                />
              } 
              balance={
                <Value
                weight="demi"
                value={account.balance}
                currency={currency}
                />
              }
              used = { 
                <Value
                weight="demi"
                style={{color: Colors.alertColor}}
                value={Math.abs(account.balance)}
                currency={currency}
                />}
             />
           </View>
         </View>
       );
    }
    return (
      <Value
        weight="demi"
        style={styles.balance}
        value={this.props.balance}
        currency={this.props.currency}
      />
    );
  }


  render() {
    const isChecked = () => {
      if (this.props.editMode) {
        return (
          <Icon.MaterialIcons
            style={styles.checked}
            name="chevron-right"
            size={22}
          />
        );
      } else if (this.props.isChecked) {
        return (
          <Icon.MaterialCommunityIcons
            style={styles.checked}
            size={24}
            name="checkbox-marked-circle"
          />
        );
      }
    };

    let accountTypeName = "";
    switch (this.props.type) {
      case AccountTypes.Default:
        accountTypeName = formatMessage(
          this.props.globalize,
          "account_type_default"
        );
        break;
      case AccountTypes.Credit:
        accountTypeName = formatMessage(
          this.props.globalize,
          "account_type_credit"
        );
        break;
      case AccountTypes.Saving:
        accountTypeName = formatMessage(
          this.props.globalize,
          "account_type_saving"
        );
        break;
      default:
        accountTypeName = formatMessage(
          this.props.globalize,
          "account_type_summary"
        );
        break;
    }
    return (
      <TouchableOpacity
        {...this.props}
        style={styles.container}
        activeOpacity={0.5}
      >
        <View style={styles.iconContainer}>
          <IconShower
            isSquare
            color={this.props.color}
            size={42}
            icon={this.props.icon}
          />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.accountNameContainer}>
            <AvenirText style={styles.subtitle} weight="demi">
              {this.props.summaryAccount
                ? formatMessage(this.props.globalize, "account_total")
                : this.props.label}
            </AvenirText>
            {!this.props.summaryAccount && (
              <AvenirText style={styles.accountType}>
                {accountTypeName}
              </AvenirText>
            )}
          </View>

          {this._renderBalance()}
          {isChecked()}
        </View>
      </TouchableOpacity>
    );
  }
}

export default withGlobalize(AccountButton);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    overflow: "hidden",
    position: "relative"
  },
  iconContainer: {
    marginRight: 15
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom: 20
    // borderBottomWidth: 1,
    // borderBottomColor: '#efefef',
  },
  accountNameContainer: {
    flex: 1
  },
  subtitle: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold"
  },
  balance: {
    fontSize: 14,
    color: Colors.textGray,
    textAlign: 'right'
  },
  checked: {
    color: Colors.mainColor,
    marginLeft: 10
  },
  balanceContainer:{
    alignItems: 'flex-end'
  },
  creditLimitBox:{
    flexDirection:'row'
  }
});
