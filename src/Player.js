import React, { Component } from 'react';
import Hammer from 'hammerjs';
import _ from 'lodash';
import DrumController from './DrumController';

class Player extends Component {
  state = {
    pinchStart: {},
    pinchX: 0,
    pinchY: 0,
    singlePanX: 0,
    singlePanY: 0,
    doublePanX: 0,
    doublePanY: 0,

    h: 50,
    w: 50,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  };

  getXY1 = () => {
    const { singlePanX, singlePanY, x1, y1 } = this.state;
    return {
      x1: x1 + singlePanX,
      y1: y1 + singlePanY,
    };
  };

  getXY2 = () => {
    const { doublePanX, doublePanY, x2, y2 } = this.state;
    return {
      x2: x2 + doublePanX,
      y2: y2 + doublePanY,
    };
  };

  getHW = () => {
    const { pinchX, pinchY, h, w } = this.state;
    const { min, max } = Math;
    return {
      h: max(0, !pinchY ? h : h * pinchY),
      w: max(0, !pinchX ? w : w * pinchX)
    };
  };

  handleRef = el => {
    if (el) {
      this.hammer = new Hammer.Manager(el, { recognizers: [
        [Hammer.Pan, { pointers: 0 /* n pointers */ }],
        [Hammer.Pinch, { threshold: 0.1 }],
      ] });
      this.hammer.on('pan', this.handlePan);
      this.hammer.on('pinch', this.handlePinch);
    } else {
      this.hammer.off('pan');
      this.hammer.off('pinch');
    }

  };

  handlePan = (evt) => {
    const { pointers, deltaX, deltaY } = evt;
    const isPanEnd = _.some(pointers.map(p => p.type), type => type === 'pointerup');

    if (pointers.length === 1) {
      if (isPanEnd) {
        this.setState({
          singlePanX: 0,
          singlePanY: 0,
          ...this.getXY1(),
        });
      } else {
        this.setState({ singlePanX: deltaX, singlePanY: deltaY});
      }

    } else if (pointers.length === 2) {
      if (isPanEnd) {
        this.setState({
          doublePanX: 0,
          doublePanY: 0,
          ...this.getXY2(),
        });
      } else {
        this.setState({ doublePanX: deltaX, doublePanY: deltaY});
      }
    }
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
    const { x1, y1 } = this.getXY1();
    const { x2, y2 } = this.getXY2();

    const squareStyle = {
      height: h,
      width: w,
      border: '1px solid orange',
      display: 'inline-block',
      float: 'left',
      transform: `translate(${x1}px, ${y1}px)`,
      borderTop: `solid red ${Math.max(1, -y2)}px`,
      borderBottom: `solid yellow ${Math.max(1, y2)}px`,
      borderLeft: `solid green ${Math.max(1, -x2)}px`,
      borderRight: `solid blue ${Math.max(1, x2)}px`,
    };

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          height: this.props.height,
          width: this.props.width,
          backgroundColor: '#111111',
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
          {/*{JSON.stringify(this.state)}*/}
          <DrumController
            x={x1}
            y={y1}
            q={w}
            h={this.props.height}
            w={this.props.width}
          />

          {/*{_.range(100).map(n => <div key={n} style={squareStyle}/>)}*/}
        </div>

      </div>
    );
  }
}

export default Player;