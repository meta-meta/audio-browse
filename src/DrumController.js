import React, { Component } from 'react';
import Max from './Max';
import _ from 'lodash';
import ResonantFilterCurve from './ResonantFilterCurve';


class DrumController extends Component {
  state = {
    isConnected: false,
    selectedDrum: 'snare',
    selectedElement: 'low',
    drums: {
      kick: {
        low: { g: 0, f: 0, q: 10 },
        mid: { g: 0, f: 0, q: 10 },
        high: { g: 0, f: 0, q: 10 },
      },
      snare: {
        low: { g: 0, f: 0, q: 10 },
        mid: { g: 90, f: 220, q: 280 },
        high: { g: 170, f: 580, q: 80 },
        snares: { g: 100, f: 400, q: 170 },
      },
      'hi-tom': {
        low: { g: 0, f: 0, q: 10 },
        mid: { g: 0, f: 0, q: 10 },
        high: { g: 0, f: 0, q: 10 },
        snares: { g: 0, f: 0, q: 10 },
      },
      'lo-tom': {
        low: { g: 0, f: 0, q: 10 },
        mid: { g: 0, f: 0, q: 10 },
        high: { g: 0, f: 0, q: 10 },
        snares: { g: 0, f: 0, q: 10 },
      },
      hihat: {
        topHigh: { g: 0, f: 0, q: 10 },
        topLow: { g: 0, f: 0, q: 10 },
        // bottomHigh: { g: 0, f: 0, q: 10 },
        // bottomLow: { g: 0, f: 0, q: 10 },
        topPitch: { g: 0, f: 0, q: 10 },
        // bottomPitch: { g: 0, f: 0, q: 10 },
      },
      crash: {
        low: { g: 0, f: 0, q: 10 },
        high: { g: 0, f: 0, q: 10 },
        pitch: { g: 0, f: 0, q: 10 },
      },
      ride: {
        low: { g: 0, f: 0, q: 10 },
        high: { g: 0, f: 0, q: 10 },
        pitch: { g: 0, f: 0, q: 10 },
      },
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
    const { drums, isConnected, selectedDrum, selectedElement, selectedPreset } = this.state;


    const { h, w } = this.props;
    const elements = _.keys(drums[selectedDrum]);

    <Max
      ref={this.handleMaxRef}
      oscMsgs={this.getOscMsgs(selectedDrum, selectedElement)}
      onConnectionChange={isConnected => this.setState({ isConnected })}
    />
    return (
      <div>

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
                  selectHandler={() => this.handleSelectElement(name)}
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

          <div style={{
            backgroundColor: isConnected ? 'lightgreen': '#003300',
            borderRadius: 50,
            width: 10,
            height: 10,
            marginLeft: 10,
            display: 'inline-block',
          }}/>

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
                  backgroundColor: _.isEmpty(preset) ? 'black' : 'rgba(0,255,255,0.2)',
                  // textDecoration: selectedPreset === i ? 'underline' : 'none',
                  fontWeight: selectedPreset === i ? 'bold': 'normal',
                  border: selectedPreset === i ? '2px solid rgba(240,0,240,0.6)' : '2px solid black',
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
