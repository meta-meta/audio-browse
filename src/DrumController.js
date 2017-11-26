import React, { Component } from 'react';
import Max from './Max';
import _ from 'lodash';
import Hammer from 'hammerjs';


class DrumController extends Component {
  state = {
    selectedDrum: 'snare',
    selectedElement: 'low',
    drums: {
      snare: {
        low: { g: 0, f: 0, q: 0 },
        mid: { g: 0, f: 0, q: 0 },
        high: { g: 0, f: 0, q: 0 },
        snares: { g: 0, f: 0, q: 0 },
      },
      kick: {
        low: { g: 0, f: 0, q: 0 },
        mid: { g: 0, f: 0, q: 0 },
        high: { g: 0, f: 0, q: 0 },
        snares: { g: 0, f: 0, q: 0 },
      }
    }
  };



  render() {
    const { selectedDrum, selectedElement } = this.state;
    const oscAddr = `/${selectedDrum}/${selectedElement}`;
    const floats = _.get(this.state.drums, [selectedDrum, selectedElement])

    const { h, w, x, y, q } = this.props;

    const c1x = x - q/2;
    const c1y = h/2;
    const c2x = x + q/2;
    const c2y = h/2;

    const g = -y;

    return (
      <div>
        <svg width={w} height={h}>


          <path
            d={`
            M ${c1x} ${c1y}
            Q ${c1x + (c2x - c1x) / 2} ${h/2 - g}, ${c2x} ${c2y}
            `}
            stroke="cyan"
            fill="blue"
          />

          <circle cx={x} cy={h/2} r="20" fill="magenta" fillOpacity={0.5} />

          <text x={x} y={h/2 + h/60} textAnchor="middle">low</text>
        </svg>

        <Max
          oscAddr={oscAddr}
          floats={floats} />
      </div>
    )
  }

}

export default DrumController;