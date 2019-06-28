import React from 'react';
import { ToggleButton } from '@nio/ui-kit';
import { withToggleDev } from '../providers/pubkeeper';

export default withToggleDev(({ toggleDev, isDev }) => (
  <ToggleButton
    value={isDev || false}
    inactiveLabel="PK Data"
    activeLabel="Dev Data"
    onToggle={toggleDev}
    className="pull-right"
  />
));
