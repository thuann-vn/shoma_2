import React, {Component} from 'react';
import { StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Icon from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

import Styles from '../../constants/Styles';
import { connect } from 'react-redux';
import { withGlobalize } from 'react-native-globalize';
import { formatMessage } from '../../utils/format';
import {
    connectActionSheet,
  } from '@expo/react-native-action-sheet';
import { getCacheImage } from '../../utils/cacheHelper';

class CustomImagePicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            searchText: null,
            selectedImage: null,
            multiple: this.props.multiple
        };
    }

    async componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
        this.setState({
          selectedImage: this.props.value
            ? await getCacheImage(this.props.value)
            : null
        });
    }

    _setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    _onChange= (image) => {
        if(this.props.onChange){
            this.props.onChange(image);
        }
    }

    _launchImageLibrary = async (isCameraLaunching) => {
        let image = null;
        let isGranted = true;
        let permissionName = isCameraLaunching ? Permissions.CAMERA : Permissions.CAMERA_ROLL;

        const permission = await Permissions.getAsync(permissionName);
        if (permission.status !== 'granted') {
            isGranted = false;
            const newPermission = await Permissions.askAsync(permissionName);
            if (newPermission.status === 'granted') {
                isGranted = true;
            }
        }
        

        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [400,400],
            quality: 0
        }
        if (isGranted){
            if (isCameraLaunching) {
                image = await ImagePicker.launchCameraAsync(options);
            } else {
                image = await ImagePicker.launchImageLibraryAsync(options);
            }
            if (image && image.cancelled == false){
                this.setState({ selectedImage : image.uri });
                this._onChange(image.uri);
            }
        }
    }

    _openImagePicker = () => {
        if(this.props.disabled) return ;
        
        let _this = this;

        let options = [this._formatMessage('common_cancel'), this._formatMessage('image_picker_library'), this._formatMessage('image_picker_capture')];
        
        option = {
            title: this._formatMessage('image_picker_title'),
            message: this._formatMessage('image_picker_message'), //'Select a image from internet or from your photo library',
            options: options,
            cancelButtonIndex: 0,
        }
        if(this.state.selectedImage){
            options.push(this._formatMessage('image_picker_remove'));
            option.destructiveButtonIndex = 3;
        }
        this.props.showActionSheetWithOptions(option, (buttonIndex) => {
            switch(buttonIndex){
                case 1:
                    _this._launchImageLibrary();
                    break;
                case 2:
                    _this._launchImageLibrary(true);
                    break;
                case 3: 
                    _this.setState({selectedImage: null, modalVisible: false });
                    this._onChange(null);
                    break;
            }
        });
    }

    _formatMessage = (message) => {
        return formatMessage(this.props.globalize, message);
    }

    render() {
        if (this.state.selectedImage) {
          return (
            <TouchableOpacity
              style={{
                ...styles.buttonToggle,
                alignItems: "flex-start",
                paddingVertical: 0,
                marginHorizontal: 0
              }}
              onPress={this._openImagePicker}
            >
              <ImageBackground
                source={{ uri: this.state.selectedImage }}
                style={[styles.imageContainer, this.props.imageStyle]}
              />
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            style={styles.buttonToggle}
            onPress={this._openImagePicker}
          >
            <Icon.Feather
              style={styles.toggleIcon}
              name="image"
              size={Styles.inputIconSize}
            />
          </TouchableOpacity>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        transactions: state.transactions,
    }
};
export default connectActionSheet(withGlobalize(connect(mapStateToProps, null)(CustomImagePicker)));

const styles = StyleSheet.create({
    buttonToggle:{
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingVertical: 20,
        marginHorizontal: 10,
        borderRadius: 8,
        backgroundColor: '#fff'
    },
    toggleIcon:{
        color: Colors.mainColor,
        width: 25,
        textAlign: 'center'
    },
    content: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0, 
        paddingTop: 92,
        backgroundColor: '#fff',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        overflow: 'hidden'
    },
    contentContainer:{
        marginTop: 92,
        paddingBottom: Layout.bottomOffset,
    },
    imageRow:{
    },
    imageContainer: { 
        height: 100,
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    imageTitle:{
        color: '#fff'
    },
    loadMoreButton: {
        marginHorizontal: 15,
        marginTop: 10,
        padding: 10,
        backgroundColor: Colors.mainColor,
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyMessage:{
        alignItems: 'center',
        height: 400,
        paddingLeft: 50,
        paddingRight: 50,
        marginTop: 100,
    },
    emptyIcon:{
        color: Colors.textGray
    },
    emptyText:{
        color: Colors.textGray,
        textAlign: 'center'
    }
  });