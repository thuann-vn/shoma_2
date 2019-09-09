import React from 'react';
import { FormattedCurrency } from 'react-native-globalize';
import { getFontFamily } from '../../utils/commonHelper';

class Value extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <FormattedCurrency style={{...this.props.style, fontFamily: getFontFamily(this.props.weight)}} currency={this.props.currency || 'VND'} value={this.props.value ? this.props.value:0} minimumFractionDigits={0} maximumFractionDigits ={2}></FormattedCurrency>
        )
    }
}
export default Value