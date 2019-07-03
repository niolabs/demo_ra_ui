import React from 'react';
import { Switch, Route } from 'react-router';

import Home from '../pages/home';
import Thresholds from '../pages/thresholds';
import Notifications from '../pages/notifications';

const Routes = () => (
  <Switch>
    <Route exact component={Home} path="/" />
    <Route exact component={Thresholds} path="/thresholds" />
    <Route exact component={Notifications} path="/notifications" />
  </Switch>
);

export default Routes;
