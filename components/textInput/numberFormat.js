import React from 'react';
import { withGlobalize } from 'react-native-globalize';
import CustomMaterialTextInput  from './material';
import NumberFormat from 'react-number-format';

class NumberFormatTextInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          text: this.props.value || '0'
        }
    }

    componentWillReceiveProps(nextProps){
      if (nextProps.value != this.props.value) {
        this.setState({
           text: nextProps.value || '0'
        })
      }
    }
    
    render() {
        return (
            <NumberFormat
                value={this.state.text}
                displayType={'text'}
                thousandSeparator={true}
                onValueChange= {this.props.onValueChange}     
                renderText={value => (
                  <CustomMaterialTextInput
                    onRef={this.props.onRef}
                    onChangeText = {
                      (text) => {
                        this.setState({
                          text: text
                        })
                      }
                    }
                    value = {
                      value
                    }
                    prefix = {
                      this.props.currency
                    }
                    suffix = {
                      this.props.suffix
                    }
                    clearButtonMode = "while-editing"
                    keyboardType = "number-pad"
                    label = {
                      this.props.label
                    }
                    autoFocus = {
                      this.props.autoFocus
                    }
                    selectTextOnFocus={true}
                  />
                )}
              />
        )
    }
}

export default withGlobalize(NumberFormatTextInput)