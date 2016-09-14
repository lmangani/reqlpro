import jdenticon from 'jdenticon';
import md5 from 'md5';
// import RethinkDbService from '../main/services/rethinkdb.service';

export function setState(state, newState) {
  return Object.assign({}, state, newState);
}

export function setConnections(state, connections) {
  return Object.assign({}, state, {
    connections
  });
}

export function setEmail(state, email) {
  if (email) {
    return Object.assign({}, state, {
      email
    });
  }
  return state;
}

export function showConnectionForm(state, mode) {
  switch (mode) {
    case 'NEW':
      let newState = Object.assign({}, state, {
        showAddConnectionForm: true
      })
      if (state.showEditConnectionForm) {
        delete newState.showEditConnectionForm;
      }
      return newState;
    case 'EDIT':
      console.log('EDIT', mode)
      let newState2 = Object.assign({}, state, {
        showEditConnectionForm: true
      })
      if (state.showAddConnectionForm) {
        delete newState2.showAddConnectionForm;
      }
      return newState2;
  }

  return state;
}

export function hideConnectionForm(state) {
  let newState = Object.assign({}, state)
  if (state.showEditConnectionForm) {
    delete newState.showEditConnectionForm;
  }
  if (state.showAddConnectionForm) {
    delete newState.showAddConnectionForm;
  }
  return newState;
}

export function addConnection(state, connection) {
  let connections = [];
  if (state.connections) {
    connections = state.connections.slice();
  }
  if (connection) {
    connections.push({
      name: connection.name,
      host: connection.host,
      port: connection.port,
      database: connection.database,
      database: "",
      authKey: "",
      identicon: jdenticon.toSvg(md5(connection.name), 40),
      index: state.connections ? state.connections.length : 0
    });
  }

  return Object.assign({}, state, {
    connections
  });
}

export function updateConnection(state, connection){
  
  const connectionsCopy = state.connections.slice(0);
  connectionsCopy.forEach( (c, i) => {
    if (c.index === connection.index){
      connectionsCopy[i] = connection
    }
  })

  const newState = Object.assign({}, state, {connections: connectionsCopy})
  return newState;


}

export function getConnection(dispatch, connection) {
  var RethinkDbService = require('../main/services/rethinkdb.service');
  return new Promise((resolve, reject) => {
    RethinkDbService.getConnection(connection.host, connection.port, connection.authKey).then((conn) => {
      console.log('getConnection conn', conn);
      dispatch({
        type: 'SET_CONNECTION',
        connection: conn
      });
      resolve(conn);
    }).catch(e => {
      console.log("e", e)
      dispatch({
        type: 'SET_CONNECTION',
        connection: connection
      });
    });
  });
};

export function setConnection(state, selectedFavorite) {
  return Object.assign({}, state, {
    selectedFavorite
  });
};

export function toggleConnectionActionMenu(state, toggle) {
  // Toggle existing value, if nothing is passed in
  if (toggle !== true && toggle !== false) {
    toggle = !state.showConnectionActionMenu
  }

  return Object.assign({}, state, {
    showConnectionActionMenu: toggle
  });
};

export function hideOpenMenus(state, propsToSet) {

  //if props passed in, return new state with these props set to false
  if(propsToSet){
    let updatedProps = {};
    propsToSet.forEach(
      (prop) => {
        if(state[prop]){
          updatedProps[prop] = false;
        }
      }
    )
    return Object.assign({}, state, updatedProps)
  }
  //if no props passed in return current state
  return state;
};
