import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import {
  DefaultPanel,
  AvenirFormattedMessage,
  CustomMaterialTextInput,
  CustomSwitch,
  ImagePicker,
  HeaderButton
} from '../../components';
import { categoriesOperations } from '../../modules/categories';
import { connect } from 'react-redux';
import { getCategoryById, prepareCategoryData } from '../../utils/categoryHelper';
import { defaultCategoryData, LogEvents } from '../../constants/Common';
import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';
import { formatMessage } from '../../utils/format';
import { withGlobalize } from 'react-native-globalize';
import { logToAmplitude } from '../../utils/logHelper';
import { getNextId } from '../../utils/stateHelper';
import Layout from '../../constants/Layout';
import { postImage } from '../../utils/firebaseHelper';
import * as firebase from 'firebase';

class CategoryDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    let { params } = this.props.navigation.state;

    if (params && params.id) {
      var category = getCategoryById(this.props.categories, params.id);
      this.state = { ...category};

      this._navigationSetting();
    } else {
      this.state = { ...defaultCategoryData}
    }
  }

  _navigationSetting = () =>{
    this.props.navigation.setParams({
      headerRight: <HeaderButton icon="trash-2" onPress={this._deleteCategory}/>
    });
  }

  _deleteCategory = () => {
     const { id } = this.state;
     let title = formatMessage(
       this.props.globalize,
       "category_delete_title"
     );
     let message = formatMessage(
       this.props.globalize,
       "category_delete_message"
     );
     let options = [
       {
         text: formatMessage(this.props.globalize, "common_cancel"),
         onPress: () => {},
         style: "cancel"
       },
       {
         text: formatMessage(this.props.globalize, "common_ok"),
         style: "destructive",
         onPress: () => {
           this.props.removeCategory({ id: id });
           this.props.navigation.pop();
         }
       }
     ];

     Alert.alert(title, message, options, { cancelable: true });
  }

  //Validate
  _validateForm = () => {
    if (!this.state.name) {
      this.setState({
        errors: {
          name: formatMessage(this.props.globalize, 'category_name_required')
        }
      })
      return false;
    }
    return true;
  };

  //Submit
  _submitForm = async () => {
    if(!this._validateForm()){
      return;
    }

    let savingCategory = prepareCategoryData(this.state);
    //Upload image
    const tempId = savingCategory.id ? savingCategory.id : getNextId();
    if (savingCategory.image && savingCategory.imageChanged) {
        savingCategory.image = await postImage(firebase, 'category_' + tempId, savingCategory.image);
    }

    if (this.state.id) {
      this.props.updateCategory(savingCategory);
    } else {
      savingCategory.id = tempId;
      this.props.addCategory(savingCategory);
    }


    this.props.navigation.goBack();
  }

  render() {
    let {
      errors = {}
    } = this.state;

    return (
      <KeyboardAvoidingView 
        style={styles.masterContainer} 
        behavior={Layout.isIOS? 'padding':null} 
        enabled={Layout.isIphoneX}
      >
        <ScrollView style={styles.container}>
          <View style={styles.imagePicker}>
            <ImagePicker 
              value = {
                this.state.image
              }
              onChange = {
                (value) => {
                  this.setState({
                    image: value,
                    imageChanged: true
                  })
                }
              }
            />
          </View>
          <DefaultPanel containerStyle={styles.topPanel} notitle="true">
            <CustomMaterialTextInput
              editable={!this.state.code}
              label="category_name"
              style={styles.nameInput}
              onChangeText={(text) => this.setState({ name: text })}
              value={this.state.name}
              autoFocus={true}
              clearButtonMode='while-editing'
              ref={this.nameInputRef}
              error={errors.name}
            />

            <View style={styles.hideCategory}>
              <View style={{flex: 1}}>
                <AvenirFormattedMessage style={styles.hideCategoryLabel} message="category_hide" />
                <AvenirFormattedMessage style={{ color: Colors.textGray }} message="category_hide_note" />
              </View>
              <CustomSwitch value={this.state.isHide} onValueChange={(value) => { this.setState({ isHide: value }) }}></CustomSwitch>
            </View>
          </DefaultPanel>
        </ScrollView>
        <View style={styles.bottomPanel}>
          <TouchableOpacity style={styles.roundedButton} onPress={this._submitForm}>
            <AvenirFormattedMessage style={styles.roundedButtonLabel} weight="demi" message="common_save" />
          </TouchableOpacity> 
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
    categories: state.categories,
    products: state.products
  };
};

const wrappedComponent = withGlobalize(connect(mapStateToProps, { ...categoriesOperations })(CategoryDetailScreen));

//Header option
wrappedComponent.navigationOptions = ({ navigation }) => {
  const { params } = navigation.state;
  return {
    headerBackTitle: null,
    headerTitle: (<AvenirFormattedMessage style={Styles.headerTitleStyle} weight="demi" message={params && params.id ? 'category_edit' : 'category_add'} />),
    headerRight: ()=> params && params.headerRight ? params.headerRight : null
  }
}

export default wrappedComponent;

const styles = StyleSheet.create({
  masterContainer: {
    backgroundColor: Colors.backgroundColor,
    ...Platform.select({
      ios: {
        flex: 1
      },
      android: {
        height : Layout.window.height - Layout.headerHeight
      },
    })
  },
  toastContainer: {
    backgroundColor: Colors.yellow
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  },
  imagePicker: {
    marginTop: 10
  },
  topPanel: {
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  bottomPanel: {
    backgroundColor: "#fff",
    paddingHorizontal: 15
  },
  row: {
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  iconInput: {
    width: 65
  },
  nameInput: {
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 44,
    padding: 6,
    backgroundColor: 'rgba(255,255,255,.8)',
    marginRight: 10
  },
  icon: {
    width: 32,
    height: 32
  },
  categoryType:{
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    overflow: 'hidden',
    backgroundColor: "#fefefe",
    borderRadius: 10,
  },
  categoryTypeLabel:{
    marginBottom: 10
  },
  hideCategory: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    backgroundColor: "#fefefe",
    borderRadius: 10,
    paddingBottom: 10,
    paddingTop: 10
  },
  hideCategoryLabel: {
    fontSize: 16
  },
  systemNote:{
    paddingHorizontal: 15,
    paddingVertical: 7
  },
  roundedButton: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: Colors.mainColor,
    color: '#fff',
    marginTop: 20,
    marginBottom: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  roundedButtonLabel: {
    fontSize: 16,
    color: '#fff'
  }
});
