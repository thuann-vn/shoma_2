import v1 from 'uuid';
import R from 'ramda';

export const getNextId = ()=>{
  return v1()
}

export const getById = (state, id) => {
  return state[id];
}

export const insert = (state, item) => {
  let id = item.id;
  if (!id) {
    let maxKey  = Object.keys(state).length;
    item.id = `${maxKey > 0 ? maxKey + 1 : 1}`;
  }

  return {
    ...state,
    [item.id]: { ...item }
  };
};
  
  export const insertWithUUID = (state, item) => {
    let id = item.id;
    if(!id){
      id = v1();
      item.id = id;
    }
    return {
      ...state,
      [id]: {...item}
    };
  };
  
  export const insertAllWithUUID = (state, items) => R.reduce(insertWithUUID, state, items);
  
  export const insertAll = (state, items) => R.reduce(insert, state, items);
  
  export const remove = (state, {id}) => {
    let item = {
      ...state[id],
      deleted: true
    }

    return {
      ...state,
      [id]: item
    }
  };
  
  export const update = (state, id, props) => {
    const item = state[id];
  
    return item ? {
      ...state,
      [id]: { ...item, ...props},
    } : state;
  };
  