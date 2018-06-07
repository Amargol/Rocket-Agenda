//import liraries
import React, { Component } from "react";
import { Provider } from "mobx-react";

import HomeScreen from "./screens/HomeScreen";

import Store from "./stores/Store";

const store = new Store();

// create a component
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );
  }
}

//make this component available to the app
export default App;
