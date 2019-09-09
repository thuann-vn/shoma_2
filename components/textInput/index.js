import React from 'react';
import { TextInput } from 'react-native';
import { withGlobalize } from 'react-native-globalize';
import { formatMessage } from '../../utils/format';

class CustomTextInput extends React.Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        if (this.props.onRef != null) {
            this.props.onRef(this)
        }
    }

    focus(){
        this.refs.input.focus();
    }

    render() {
        return (<TextInput
            {...this.props}
            ref="input"
            placeholder={formatMessage(this.props.globalize, this.props.placeholder)}
        />)
    }
}

export default withGlobalize(CustomTextInput)