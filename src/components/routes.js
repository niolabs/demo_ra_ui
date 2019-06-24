import React from 'react';
import { Switch, Route } from 'react-router';

import Home from '../pages/home';
import Thresholds from '../pages/thresholds';

const Routes = () => (
  <Switch>
    <Route exact component={Home} path="/" />
    <Route exact component={Thresholds} path="/thresholds" />
  </Switch>
);

export default Routes;
