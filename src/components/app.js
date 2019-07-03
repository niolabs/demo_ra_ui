import React, { Component } from 'react';
import { Navbar, NavbarToggler, Nav, NavItem, Collapse } from '@nio/ui-kit';
import { NavLink } from 'react-router-dom';

import '../app.scss';
import Routes from './routes';
import ToggleDev from './toggleDev';

class App extends Component {
  state = { navOpen: false };

  handleNavigation = () => {
    this.setState({ navOpen: false });
  };

  render = () => {
    const { navOpen } = this.state;

    return (
      <div>
        <Navbar id="app-nav" dark fixed="top" expand="md">
          <div className="navbar-brand">
            <NavLink to="/"><div id="logo" /></NavLink>
          </div>
          <NavbarToggler right onClick={() => this.setState({ navOpen: !navOpen })} isOpen={navOpen} />
          <Collapse isOpen={navOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink onClick={this.handleNavigation} exact to="/">Analytics</NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={this.handleNavigation} exact to="/thresholds">Adjust Thresholds</NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={this.handleNavigation} exact to="/notifications">Manage Notifications</NavLink>
              </NavItem>
              <NavItem>
                <ToggleDev />
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <div id="app-container">
          <Routes />
        </div>
      </div>
    );
  }
}

export default App;
