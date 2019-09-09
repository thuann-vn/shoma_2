import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { connect } from "react-redux";
import Images from "../../constants/Images";
import * as firebase from 'firebase';
import {
  CacheManager
} from "react-native-expo-image-cache";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: false
    };
  }

  componentDidMount() {
    this._getState(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this._getState(nextProps);
  }

  _getState = async (props)=>{
    let user = firebase.auth().currentUser;
    let photoUrl = props.photoURL || user.photoURL;

    if (photoUrl){
      if (photoUrl.indexOf('facebook')) {
        photoUrl + '?type=large';
      }
      
      photoUrl = await CacheManager.get(photoUrl).getPath() || photoUrl;
    }

    this.setState({
      initialized: true,
      profile: user,
      photoUrl: photoUrl
    });
  }

  render() {
    return (
      <TouchableOpacity {...this.props} style={styles.container}>
        <View style={styles.iconContainer}>
            {
              this.state.initialized && (<Image source={ this.state.photoUrl ? { uri: this.state.photoUrl } : Images.defaultAvatar} style={{...styles.avatar, ...this.props.avatarStyle || {}}}/>)
            }
        </View>
      </TouchableOpacity>
    );
  }
}
const mapStateToProps = state => {
  return {
    settings: state.settings
  };
};
export default connect(mapStateToProps)(UserProfile);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginLeft: 15,
    alignItems: "center"
  },
  avatar:{
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
