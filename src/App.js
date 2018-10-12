import React, { Component } from 'react';
import MathJax from 'react-mathjax';
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
    const tex = "ax^2 + bx + c = 0"
    this.state = {
      input: tex, 
      output: tex
    }
  }

  parse = (text) => {
    let result = text.replace(/\*/g, "\\times");
    result = result.replace(/\//g, "\\div");
    const fs = result.match(/[^ ]+%[^ ]+/g);
    if (fs != null){
      for (let f of fs){
        let k = f.match(/[^%]+/g);
        result = result.replace(f, "\\frac{" + k[0] + "}{" + k[1] + "}");
      }
    }
    const ss = result.match(/#[^ ]+/g);
    if (ss != null){
      for (let s of ss){
        let k = s.match(/[^#]+/g);
        result = result.replace(s, "\\sqrt{" + k + "}");
      }
    }
    result = result.replace(/@|#|\$|%|&/, "");
    return result
  }

  click = (e) => {
    const tex = "ax^2 + bx = 0"
    this.setState({
      input: tex, 
      output: tex
    });
  }

  change = (e) => {
    const input = e.target.value;
    const result = this.parse(input);
    this.setState({
      input: input, 
      output: result
    });
  }

  render() {
    return (
      <div className="App">
        <MathJax.Provider>
          <div>
            <MathJax.Node id="text" formula={this.state.output} />
            <input type="text" value={this.state.input} onChange={this.change} />
            <button onClick={this.click}>change</button>
          </div>
        </MathJax.Provider>
      </div>
    );
  }
}

export default App;
