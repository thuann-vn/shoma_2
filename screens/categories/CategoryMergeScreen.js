import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { RoundedButton, DefaultPanel, AvenirFormattedMessage, CategoryPicker, Icon } from '../../components';
import { categoriesOperations } from '../../modules/categories';
import { connect } from 'react-redux';
import { getCategoryById } from '../../utils/categoryHelper';
import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';
import { formatMessage } from '../../utils/format';
import { withGlobalize } from 'react-native-globalize';

class CategoryMergeScreen extends React.Component {
  constructor(props) {
    super(props);
    let { params } = this.props.navigation.state;
    fromCategory = params && params.id ? params.id : null;
    isIncome = true;
    if (fromCategory){
      isIncome = getCategoryById(this.props.categories, fromCategory).isIncome;
    }

    this.state = {
      fromCategory: fromCategory,
      isIncome: isIncome,
      toCategory: null,
      callback: params && params.callback? params.callback:null
    }
  }

  _submitForm = () => {
    if(!this.state.fromCategory || !this.state.toCategory){
      return;
    }

    Alert.alert(formatMessage(this.props.globalize, 'category_merge_alert'), formatMessage(this.props.globalize, 'category_merge_alert_message'), [
      {
        text: formatMessage(this.props.globalize, 'common_cancel'),
        onPress: () => { },
        style: "cancel"
      },
      {
        text: formatMessage(this.props.globalize, 'common_ok'),
        onPress: () => {
          //Delete old category
          const fromCategoryData = getCategoryById(this.props.categories, this.state.fromCategory);
          if (!fromCategoryData.code){
            this.props.removeCategory({id: fromCategoryData.id});
          }
          //Go back
          this.props.navigation.pop(2);
        }
      }
    ])
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <ScrollView style={styles.container}>
          <DefaultPanel containerStyle={styles.topPanel} notitle="true">
            <View style={styles.row}>
              <AvenirFormattedMessage message="category_merge_from" style={styles.label}/>
              <CategoryPicker
                value={this.state.fromCategory}
                disabled={true}
              />
            </View>
            <View style={styles.row}>
              <Icon.MaterialCommunityIcons name="arrow-down" style={{color: Colors.textGray}} size={42}/>
            </View>
            <View style={styles.row}>
              <AvenirFormattedMessage message="category_merge_to" style={styles.label} />
              <CategoryPicker
                value={this.state.toCategory}
                expenseOnly={!this.state.isIncome}
                incomeOnly={this.state.isIncome}
                onChange={value => {
                  this.setState({ toCategory: value });
                }}
              />
            </View>
          </DefaultPanel>
          <View style={styles.systemNote}>
            <AvenirFormattedMessage style={{ color: Colors.textGray }} message="category_merge_note" />
          </View>
        </ScrollView>
        <View style={styles.bottomPanel}>
          <RoundedButton style={styles.button} onPress={this._submitForm}>
            <AvenirFormattedMessage weight="demi" message="common_save"></AvenirFormattedMessage>
          </RoundedButton>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
    transactions: state.transactions,
    categories: state.categories,
    plans: state.plans
  }
};

const wrappedComponent = withGlobalize(connect(mapStateToProps, { ...categoriesOperations})(CategoryMergeScreen));

//Header option
wrappedComponent.navigationOptions = () => {
  return {
    headerTitle: (<AvenirFormattedMessage style={Styles.headerTitleStyle} weight="demi" message='category_merge'/>),
  }
}

export default wrappedComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  },
  topPanel: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#fefefe",
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10
  },
  bottomPanel: {
    backgroundColor: "#fff",
    paddingHorizontal: 15
  },
  row: {
    backgroundColor: '#fff',
    paddingVertical: 0
  },
  iconInput: {
    width: 65
  },
  nameInput: {
    flex: 1,
    height: 60,
    fontSize: 20,
    marginLeft: 10,
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
  button: {
    marginTop: 20
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
    width: '50%'
  },
  hideCategory: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    overflow: 'hidden',
    backgroundColor: "#fefefe",
    borderRadius: 10,
  },
  systemNote:{
    paddingHorizontal: 15,
    paddingVertical: 7
  },
  label:{
    textTransform: 'uppercase',
    marginBottom: 5,
    color: Colors.textGray
  }
});
