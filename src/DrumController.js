import React, { Component } from 'react';
import Max from './Max';
import _ from 'lodash';
import ResonantFilterCurve from './ResonantFilterCurve';


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
    },
    presets: JSON.parse(localStorage.presets || 'false') || _.range(10).map(() => ({})),
    selectedPreset: 0,
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

  handleSelectPreset = i => {
    const preset = this.state.presets[i];
    this.setState({
      selectedPreset: i,
      drums: _.merge({}, this.state.drums, preset)
    }, () => {
      _.each(this.state.drums, (drum, drumName) => {
        _.each(drum, (element, elementName) => {
          const msgs = this.getOscMsgs(drumName, elementName);
          this.max.sendOscMsgs(msgs);
        })
      })
    });
  };

  handleSavePreset = () => {
    this.setState({
      presets: _.merge(
        this.state.presets,
        { [this.state.selectedPreset]: this.state.drums }
      )
    }, () => {
      localStorage.presets = JSON.stringify(this.state.presets);
    } );
  };

  handleSelectDrum = selectedDrum => this.setState({
    selectedDrum,
    selectedElement: '',
  });

  handleMaxRef = max => this.max = max;

  getOscMsgs = (drum, element) => {
    const oscAddr = `/${drum}/${element}`;
    const floats = _.get(this.state.drums, [drum, element], {});

    return _.map(
      {
        g: floats.g * 3,
        f: Math.pow(2, 15 * (floats.f / document.body.clientWidth)),
        q: document.body.clientWidth / floats.q
      },
      (val, key) => `${oscAddr}/${key} ${val}`
    );
  };

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
    const { drums, selectedDrum, selectedElement, selectedPreset } = this.state;


    const { h, w } = this.props;
    const elements = _.keys(drums[selectedDrum]);

    return (
      <div>
        <Max
          ref={this.handleMaxRef}
          oscMsgs={this.getOscMsgs(selectedDrum, selectedElement)}
        />

        {
          elements.map(name => {
            const element = this.getElement(name);
            const { f, g, q } = element;
              return (
                <ResonantFilterCurve
                  key={name}
                  name={name}
                  isSelected={selectedElement === name}
                  canvasHeight={h - 100}
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
            bottom: '0px',
            height: '100px',
            width: '100%',
            backgroundColor: '#201120'
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

          <br/>

          {
            this.state.presets.map((preset, i) => (
              <div
                key={i}
                style={{
                  display: 'inline-block',
                  padding: '10px',
                  margin: '5px',
                  color: _.isEmpty(preset) ? 'grey' : 'black',
                  backgroundColor: _.isEmpty(preset) ? 'black' : 'yellow',
                  textDecoration: selectedPreset === i ? 'underline' : 'none',
                  fontWeight: selectedPreset === i ? 'bold': 'normal',
                }}
                onClick={() => this.handleSelectPreset(i)}
              >
                {i}
              </div>
            ))
          }

          <button
            onClick={this.handleSavePreset}
            style={{
              backgroundColor: '#552255',
              color: 'white',
              padding: '10px',
              margin: '5px',
              border: '2px solid darkmagenta',
            }}
          >
            save preset
          </button>
        </div>
      </div>
    )
  }

}

export default DrumController;