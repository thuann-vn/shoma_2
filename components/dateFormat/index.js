import React from "react";
import { FormattedDate } from "react-native-globalize";
class DateText extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    var fontFamily = "avenir-next";
    switch (this.props.weight) {
      case "bold":
        fontFamily = "avenir-next-bold";
        break;
      case "cn":
        fontFamily = "avenir-next-cn";
        break;
      case "demi":
        fontFamily = "avenir-next-demi";
        break;
      case "it":
        fontFamily = "avenir-next-it";
        break;
    }
    return (
      <FormattedDate
        style={{ ...this.props.style, fontFamily: fontFamily }}
        {...this.props}
      />
    );
  }
}
export default DateText;
