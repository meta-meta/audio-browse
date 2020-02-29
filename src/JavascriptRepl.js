import Max from './Max';
import React, {Component} from 'react';

class JavascriptRepl extends Component {
  constructor(props) {
    super(props);

    window.addEventListener('message', this.handleMessage);

    // TODO: this is a hack. It acts like send on the Repl because for some reason we can't postMessage to the iframe and so we need to code fns against this window instead of the repl's. If going down this road, gotta implement sendFn as well.
    window.send = (msg) => this.max.sendOscMsgs([msg]);
  }

  state = {
    fns: {},
    isConnected: false,
  };

  handleIframeRef = replIframe => {
    this.replIframe = replIframe && replIframe.contentWindow;
  };

  handleMaxRef = max => {
    this.max = max;
    window.max = max;
  };

  handleMessage = ({data: {isRepl, fnObj, msg}, data}) => {
    console.debug('JavascriptRepl.handleMessage', data);

    if (isRepl && msg) {
      this.max.sendOscMsgs([msg]);
    }

    if (isRepl && fnObj) {
      const { fn, fnName } = fnObj;
      this.setState(({ fns }) => ({ fns: { ...fns, [fnName]: eval(fn) } }));
    }
  };

  handleOsc = (addr, args) => {
    if (addr === '/fn') {
      const [fnName] = args;
      console.debug('JavascriptRepl.handleOsc', addr, args);
      // this.replIframe.postMessage({ isRepl: true, fnName }, '*'); // TODO: why won't this work??

      if (this.state.fns[fnName]) this.state.fns[fnName]();

    }
  };

  render() {
    return (
      <div style={{
        color: 'grey',
      }}>
        <h1>REPL</h1>
        <iframe
          allowFullScreen="true"
          allowTransparency="true"
          frameBorder="no"
          height="400px"
          // sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"
          ref={this.handleIframeRef}
          scrolling="no"
          src="https://repl.it/@PaulChristian/javascriptRepl?lite=true&outputonly=1"
          width="100%"
        />
        <Max
          ref={this.handleMaxRef}
          onConnectionChange={isConnected => this.setState({isConnected})}
          onOsc={this.handleOsc}
        />
      </div>)
  }
}

export default JavascriptRepl;
