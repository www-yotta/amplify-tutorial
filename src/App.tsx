import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Top from "./Top";
import Detail from "./Detail";

const NotFound = () => <h1>404 Not found.</h1>;

const App = () => {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Top} />
          <Route path="/detail" component={Detail} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
