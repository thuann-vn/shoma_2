import React from 'react';
import { withGlobalize } from 'react-native-globalize';
import { formatMessage } from '../../utils/format';
import { TextField } from 'react-native-material-textfield';

class CustomMaterialTextInput extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.onRef != null) {
            this.props.onRef(this)
        }
    }

    focus() {
        this.refs.input.focus();
    }
    
    render() {
        return (
            <TextField
                {...this.props}
                ref = "input"
                label={formatMessage(this.props.globalize, this.props.label)}
            />
        )
    }
}

export default withGlobalize(CustomMaterialTextInput)