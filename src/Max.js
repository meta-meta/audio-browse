import { State, CONNECTION_STATES, SUPPORTED_OBJECTS } from 'xebra.js';

import React, { Component } from 'react';
import _ from 'lodash';

class Max extends Component {
  constructor(props) {
    super(props);

    console.log('supported objs:', SUPPORTED_OBJECTS);

    this.xebraState = new State({
      hostname: '127.0.0.1',
      // hostname: '10.30.87.25',
      port: 8086,
      supported_objects: SUPPORTED_OBJECTS
    });

    this.xebraState.connect();
    // this.xebraState.getPatchers();
  }

  render() {
    const { floats } = this.props;

    if (this.xebraState.connectionState === CONNECTION_STATES.CONNECTED) {
      _.each(floats, (val, key) => {
        this.xebraState.sendMessageToChannel(
          'osc',
          `${this.props.oscAddr}/${key} ${val}`
        );
      });
    }

    return null;
  }

}

export default Max;