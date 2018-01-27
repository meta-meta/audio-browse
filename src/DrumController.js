import React, { Component } from 'react';
import Max from './Max';
import _ from 'lodash';
import ResonantFilterCurve from './ResonantFilterCurve';
import Hammer from 'hammerjs';


class DrumController extends Component {
  state = {

    selectedDrum: 'snare',
    selectedElement: 'low',
    drums: {
      hihat: {
        topHigh: { g: 0, f: 0, q: 10 },
        topLow: { g: 0, f: 0, q: 10 },
        bottomHigh: { g: 0, f: 0, q: 10 },
        bottomLow: { g: 0, f: 0, q: 10 },
      },
      ride: {
        low: { g: 0, f: 0, q: 10 },
        high: { g: 0, f: 0, q: 10 },
      },
      snare: {
        low: { g: 0, f: 0, q: 10 },
        mid: { g: 0, f: 0, q: 10 },
        high: { g: 0, f: 0, q: 10 },
        snares: { g: 0, f: 0, q: 10 },
      },
      kick: {
        low: { g: 0, f: 0, q: 10 },
        mid: { g: 0, f: 0, q: 10 },
        high: { g: 0, f: 0, q: 10 },
      }
    }
  };

  getElement = (element) => {
    const { drums, selectedDrum } = this.state;
    return drums[selectedDrum][element];
  };

  getSelectedElement = () => this.getElement(this.state.selectedElement);

  handleSelectElement = selectedElement => {
    const { drums, selectedDrum } = this.state;
    const { g, f, q } = drums[selectedDrum][selectedElement];
    this.setState({ selectedElement }, () => {
      this.props.setParams({
        x: f,
        y: -g,
        q
      })
    });
  };

  handleSelectDrum = selectedDrum => this.setState({
    selectedDrum,
    selectedElement: '',
  });

  componentWillReceiveProps(nextProps) {
    const { drums, selectedDrum, selectedElement } = this.state;
    const { x, y, q } = nextProps;

    if (!selectedElement) return;

    this.setState({
      drums: {
        ...drums,
        [selectedDrum]: {
          ...drums[selectedDrum],
          [selectedElement]: {
            f: x,
            g: -y,
            q
          }
        }
      }
    })
  }

  render() {
    const { drums, selectedDrum, selectedElement } = this.state;
    const oscAddr = `/${selectedDrum}/${selectedElement}`;
    const floats = _.get(this.state.drums, [selectedDrum, selectedElement], {});

    const { h, w } = this.props;
    const elements = _.keys(drums[selectedDrum]);

    return (
      <div>
        <Max
          oscAddr={oscAddr}
          floats={{
            g: floats.g * 3,
            f: Math.pow(2, 15 * (floats.f / document.body.clientWidth)),
            q: document.body.clientWidth / floats.q
          }} />

        {
          elements.map(name => {
            const element = this.getElement(name);
            const { f, g, q } = element;
              return (
                <ResonantFilterCurve
                  key={name}
                  name={name}
                  isSelected={selectedElement === name}
                  canvasHeight={h}
                  canvasWidth={w}
                  centerX={f}
                  amplitude={g}
                  width={q}
                />
              )
            })
        }

        <div
          style={{
            position: 'absolute',
            top: '400px',
            height: '50px',
            width: '100%',
          }}>

          {
            _.keys(drums).map(name => (
              <div
                key={name}
                name={name}
                style={{
                  display: 'inline-block',
                  padding: '10px',
                  color: 'cyan',
                  textDecoration: selectedDrum === name ? 'overline' : 'none',
                }}
                onClick={() => this.handleSelectDrum(name)}
              >
                {name}
              </div>
            ))

          }

          <div
            style={{
              display: 'inline-block',
              padding: '10px',
            }}
          >
            ||
          </div>

          {
            elements.map(name => (
              <div
                key={name}
                name={name}
                style={{
                  display: 'inline-block',
                  padding: '10px',
                  color: 'magenta',
                  textDecoration: selectedElement === name ? 'overline' : 'none',
                }}
                onClick={() => this.handleSelectElement(name)}
              >
                {name}
              </div>
            ))
          }
        </div>
      </div>
    )
  }

}

export default DrumController;