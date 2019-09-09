import React from "react";
import { TouchableOpacity, View, StyleSheet, Image, Linking } from "react-native";
import Colors from "../../constants/Colors";
import { AvenirText, AvenirFormattedMessage } from "../text/StyledText";
import Images from "../../constants/Images";
import * as Icon from '@expo/vector-icons';

class CustomerInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      customer: this.props.data
    };
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data != this.state.customer) {
      this.setState({
        customer: nextProps.data
      });
    }
  }

  focus() {
    this.refs.input.focus();
  }

  render() {
    const {customer} = this.state;
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.customerInfoContainer}>
          <View style={styles.imageContainer}>
            <Image source={Images.defaultAvatar} style={styles.customerImage} />
          </View>
          <View style={styles.customerDetail}>
            <AvenirText style={styles.customerName}>
              {customer.name}
            </AvenirText>

            <AvenirText style={styles.customerInfo}>
              {customer.address +
                ", " +
                customer.city +
                ", " +
                customer.country}
            </AvenirText>
          </View>
        </View>
        {
          customer.note ? <View style={styles.customerNoteContainer}>
            <AvenirFormattedMessage weight="demi" message='customer_note'/>
            <AvenirFormattedMessage message={customer.note}/>
          </View> : null
        }

        <View style={styles.contactOptions}>
            <TouchableOpacity style={{...styles.contactButton, opacity: customer.phoneNumber ? 1 : 0.5}} onPress={()=>{customer.phoneNumber && Linking.openURL('tel:' + customer.phoneNumber);} }>
                <Icon.Entypo name="phone" style={styles.contactIcon} size={18}/>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.contactButton, opacity: customer.phoneNumber ? 1 : 0.5}} onPress={()=>{customer.phoneNumber && Linking.openURL('sms:' + customer.phoneNumber);} }>
                <Icon.Entypo name="message" style={styles.contactIcon} size={18}/>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.contactButton, opacity: customer.email ? 1 : 0.5}} onPress={()=>{customer.email && Linking.openURL('mailto:' + customer.email);} }>
                <Icon.Entypo name="mail" style={styles.contactIcon} size={18}/>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default CustomerInfo;

const styles = StyleSheet.create({
  customerInfoContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10
  },
  imageContainer: {
    marginRight: 10
  },
  customerImage: {
    width: 36,
    height: 36
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
  customerNoteContainer: {
    borderTopColor: Colors.borderColor,
    borderTopWidth: 1,
    paddingTop: 20,
    paddingBottom: 10
  },
  contactOptions:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopColor: Colors.borderColor,
    borderTopWidth: 1
  },
  contactButton:{
    width: 36,
    height: 36,
    borderRadius: 36,
    backgroundColor: Colors.mainColor,
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contactIcon:{
    color: '#fff'
  }
});
