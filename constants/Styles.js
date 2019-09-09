import Colors from "./Colors";


export default {
  fontSize: 14,
  smallFontSize: 13,
  largeFontSize: 32,
  inputIconSize: 24,

  headerTitleStyle: {
    fontSize: 16,
    color: '#fff'
  },
  titleCard : {
    fontSize: 14,
    marginBottom: 10,
  },
  colPadding: {
    paddingHorizontal: 10,
  },
  row: {
    display:'flex',   
    flexDirection: 'row',
  },
  rowWrap: {
    flexWrap: 'wrap',
  },
  rowPadding : {
    marginHorizontal: -10,
  },
  col : {
    flexBasis: 0,
    flexGrow: 1,
    maxWidth: '100%',
  },
  colAuto: {
    flexGrow: 0,
    flexShrink: 1,
    // flexBasic:'auto',
    width:'auto',
    maxWidth: '100%',
  },
  textSmall : {
    fontSize: 12,
    // color: Colors.textGray
    color: Colors.textGray
  },
  contentCenter:{ justifyContent: 'center',},
  alignItemsCenter:{ alignItems: 'center',}

};

export const colPadding = {
  paddingHorizontal: 10,
}

export const row = {
  display:'flex',   
  flexDirection: 'row',
}

export const rowPadding = {
  marginHorizontal: -10,
}

export const col = {
  flexBasis: 0,
  flexGrow: 1,
  maxWidth: '100%',
}

export const colAuto = {
  flexGrow: 0,
  flexShrink: 1,
  // flexBasic:'auto',
  width:'auto',
  maxWidth: '100%',
}

export const textSmall = {
  fontSize: 12,
  // color: Colors.textGray
  color: Colors.textGray
}

export const menuItem = {
  flexDirection: 'row',
  alignItems: "center",
  paddingHorizontal: 10
};

export const menuIcon = {
  color: Colors.mainColor,
  paddingRight: 10
};

export const headerRightContainer = {
  flexDirection: 'row',
}





