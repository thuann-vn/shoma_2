import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    FlatList,
    SafeAreaView
} from 'react-native';
import { AvenirText, Icon, SearchBar, AvenirFormattedMessage, Separator, HeaderButton } from '../../components';
import { settingsOperations } from '../../modules/settings';
import Colors from '../../constants/Colors';
import { connect } from 'react-redux';
import currencies from '../../constants/Currency';
import flags from '../../constants/Flags';
import Styles from '../../constants/Styles';
import { Header } from 'react-native-elements';

class CurrencyPickerScreen extends React.Component {
    static navigationOptions = () => {
        return {
            headerTransparent: false,
            headerTitle: (<AvenirFormattedMessage style={Styles.headerTitleStyle} weight="demi" message="common_enter_currency"/>),
            headerRight: null,
            tabBarVisible: false,
        }
    };

    constructor(props) {
        super(props);

        const {params} = this.props.navigation.state;

        this.state= {
            search: null,
            value: params && params.value || null,
            filtedCurrencies: this._filterData()
        }
    }

    _filterData = (keyword)=>{
        var results = [];
        Object.keys(currencies).map((key)=>{
            const currency = currencies[key];
            if(flags[key]){
                if(
                    !keyword ||
                    (keyword && currency.name.includes(keyword))||
                    (keyword && currency.code.includes(keyword))
                ){
                    results.push(currency);
                }
            }
        })
        return results;
    }

    _onSelect = (key) => {
        if (this.props.navigation.state.params.callback){
            this.props.navigation.state.params.callback(key);
        }
        this.props.navigation.pop();
    }

    _renderCheckedIcon = (code)=>{
        if(this.state.value==code){
            return (<Icon.Ionicons name="ios-checkmark" color={Colors.mainColor} size={26}/>)
        }
    }

    _renderRow = ({item}) => {
        return (
            <TouchableOpacity key={item.code} style={styles.button} onPress={() => this._onSelect(item.code)}>
                <View style={styles.buttonContainer}>
                    <Image source={flags[item.code]} style={styles.flag}/>
                    <View style={styles.label}>
                        <AvenirText style={styles.name}>{item.name}</AvenirText>
                        <AvenirText style={styles.code}>{item.code} - {item.symbol}</AvenirText>
                    </View>
                    {this._renderCheckedIcon(item.code)}
                   
                </View>
            </TouchableOpacity>
        )
    }

    _changeSearchText = (text) =>{
        this.setState({ 
            search:text, 
            filtedCurrencies: this._filterData(text) 
        });
    }

    render() {
        return (
          <SafeAreaView>
            <Header
              containerStyle={{ height: 50, paddingTop: 0, borderBottomWidth: 0 }}
              backgroundColor={Colors.mainColor}
              centerComponent={
                <AvenirFormattedMessage
                  style={Styles.headerTitleStyle}
                  weight="demi"
                  message="common_currency"
                />
              }
              rightComponent={
                <HeaderButton
                  label="common_close"
                  onPress={() => this.props.navigation.pop()}
                />
              }
            />
            <SearchBar
              placeholder="Search..."
              platform="ios"
              onChangeText={this._changeSearchText}
              containerStyle={{
                backgroundColor: "transparent",
                borderTopWidth: 0
              }}
              style={{ borderTopWidth: 0 }}
              value={this.state.search}
            />

            <FlatList
              data={this.state.filtedCurrencies}
              extraData={this.state}
              keyExtractor={item => item.code}
              renderItem={this._renderRow}
              ItemSeparatorComponent={({ leadingItem }) =>
                leadingItem ? <Separator left={65} /> : null
              }
            />
          </SafeAreaView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        accounts: state.accounts,
        settings: state.settings
    }
};
export default connect(mapStateToProps, settingsOperations)(CurrencyPickerScreen);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
    },
    previewContainer: {
        flex: 1,
        padding: 40,
        alignItems: 'center',
    },
    iconsContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    button: {
        flex: 1
    },
    buttonContainer:{
        backgroundColor: '#fff',
        flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
        alignItems:'center',
        padding: 7
    },
    flag:{
        height: 32, marginRight: 10,borderRadius: 2,
    },
    label: {
        flex: 1
    },
    name: {

    },
    code: {
      color: '#777'
    }
});
