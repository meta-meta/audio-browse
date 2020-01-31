import React, { Component } from 'react';
import './App.css';
import JavascriptRepl from './JavascriptRepl';
import TouchCanvas from './TouchCanvas';

class App extends Component {
  state = {
    height: 0,
    width: 0,
  };

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    const { innerHeight, innerWidth } = window;
    this.setState({ height: innerHeight, width: innerWidth });
  };

  render() {
    return (
      <div className="App">
        {/*<JavascriptRepl/>*/}
        <TouchCanvas {...this.state} />
      </div>
    );
  }
}

export default App;
