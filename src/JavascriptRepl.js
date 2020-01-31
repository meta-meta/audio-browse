import Max from './Max';
import React, {Component} from 'react';

class JavascriptRepl extends Component {
  constructor(props) {
    super(props);

    window.addEventListener('message', this.handleMessage);
  }

  state = {
    isConnected: false,
  };

  handleMaxRef = max => {
    this.max = max;
    window.max = max;
  };

  handleMessage = ({data: {isRepl, msg}}) => {
    if (isRepl && msg) {
      this.max.sendOscMsgs([msg]);
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
          scrolling="no"
          src="https://repl.it/@PaulChristian/javascriptRepl?lite=true&outputonly=1"
          width="100%"
        />
        <Max
          ref={this.handleMaxRef}
          onConnectionChange={isConnected => this.setState({isConnected})}
        />
      </div>)
  }
}

export default JavascriptRepl;
