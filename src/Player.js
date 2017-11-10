import React, { Component } from 'react';
import Hammer from 'hammerjs';
import _ from 'lodash';

class Player extends Component {
  state = {
    pinchStart: {},
    pinchX: 0,
    pinchY: 0,
    // TODO:
    singlePanX: 0,
    singlePanY: 0,
    doublePanX: 0,
    doublePanY: 0,

    h: 50,
    w: 50,
  };

  handleRef = el => {
    if (el) {
      this.hammer = new Hammer.Manager(el, { recognizers: [[Hammer.Pinch]] });
      // this.hammer.on('hammer.input', this.handlePan);
      // this.hammer.add([new Hammer.Pinch(), new Hammer.Pan()]);
      this.hammer.on('pan', this.handlePan);
      this.hammer.on('pinch', this.handlePinch);
    } else {
      // this.hammer.off('hammer.input');
      // this.hammer.off('pan');
      this.hammer.off('pinch');
    }

  };

  handlePan = (evt) => {

  };

  getHW = () => {
    const { pinchX, pinchY, h, w } = this.state;
    const { min, max } = Math;
    return {
      h: max(0, !pinchY ? h : h * pinchY),
      w: max(0, !pinchX ? w : w * pinchX) };
  };

  handlePinch = (evt) => {
    const { pointers } = evt;

    const [{ x: x0, y: y0 }, { x, y }] = pointers;
    const dX = Math.abs(x - x0);
    const dY = Math.abs(y - y0);

    if (_.some(pointers.map(p => p.type), type => type === 'pointerup')) { // end pinch
      this.setState({
        pinchStart: {},
        pinchX: 0,
        pinchY: 0,
        ...this.getHW(), // pinch is over so lock in computed h/w
      });
    } else if (_.isEmpty(this.state.pinchStart)) { // start pinch
      this.setState({ pinchStart: { dX, dY } });
    } else { // during pinch
      const { pinchStart } = this.state;
      this.setState(
        (this.state.pinchX || dX > dY) && !this.state.pinchY // avoid switching between pinchX<->pinchY mid-pinch
          ? { pinchX: (dX / pinchStart.dX), pinchY: 0 }
          : { pinchX: 0, pinchY: (dY / pinchStart.dY) }
      );
    }
  };


  render() {

    const { h, w } = this.getHW();
    const squareStyle = {
      height: h,
      width: w,
      border: '1px solid orange',
      display: 'inline-block',
      float: 'left',
    };

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          backgroundColor: 'pink',
        }}
      >
        <div
          style={{
            width: '1000px',
            height: '400px',
            backgroundColor: 'dark-red',
          }}
          ref={this.handleRef}
        >
          {JSON.stringify(this.state)}
          {_.range(100).map(n => <div key={n} style={squareStyle}/>)}
        </div>
      </div>
    );
  }
}

export default Player;