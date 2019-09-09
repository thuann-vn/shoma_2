import React from 'react';
import { Image } from 'react-native';
import { getCacheImage } from "../../utils/cacheHelper";

export default class CustomImage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            source : null
        }
    }

    async componentDidMount(){
        if(typeof this.props.source == 'string'){
            return this.setState({
                source: {
                    uri: await getCacheImage(this.props.source)
                }
            });
        }

        this.setState({
            source: this.props.source
        })
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.source == this.props.source){
            return;
        }
        if (typeof nextProps.source == 'string') {
            return this.setState({
                source: {
                    uri: await getCacheImage(nextProps.source)
                }
            });
        }

        this.setState({
            source: nextProps.source
        })
    }

    render() {
        return <Image {...this.props} source={ this.state.source }/>;
    }
}
