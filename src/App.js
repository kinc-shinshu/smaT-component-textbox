import React, { Component } from 'react';
import MathJax from 'react-mathjax';
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
    const tex = "ax^2 + bx + c = 0"
    this.state = {
      input: tex, 
      output: tex, 
      answer: this.ansify(tex)
    }
  }

  parse = (text) => {
    let result = text.replace(/\*/g, "\\times");
    result = result.replace(/\//g, "\\div");
    result = result.replace(/\+-/g, "\\pm");
    result = result.replace(/-\+/g, "\\mp");
    const ss = result.match(/#{.+?}/g);
    if (ss != null){
      for (let s of ss){
        let k = s.match(/[^#]+/g);
        result = result.replace(s, "\\sqrt{" + k[0].slice(1, -1) + "}");
      }
    }
    const fs = result.match(/\[.+?]%\[.+?]/g);
    if (fs != null){
      for (let f of fs){
        console.log(f);
        let k = f.match(/[^%]+/g);
        result = result.replace(f, "\\frac{" + k[0].slice(1, -1) + "}{" + k[1].slice(1, -1) + "}");
      }
    }
    result = result.replace(/@|#|\$|%|&/, "");
    console.log(result);
    return result
  }

  ansify = (text) => {
    let result = text.replace(/[0-9a-w]+/g, "\\boxed{\\phantom{0}}");
    return result;
  }

  add = (text) => {
    const input = document.querySelector("#input");
    const cursor = input.selectionStart;
    const before = this.state.input.slice(0, cursor);
    const after = this.state.input.slice(cursor);
    const changed_text = before + text + after;
    this.setState({
      input: changed_text, 
      output: this.parse(changed_text)
    }, () => {
      input.focus();
      input.setSelectionRange(cursor, cursor + text.length);
    });
  }

  sqrt = () => {
    this.add("#{?}");
  }

  frac = () => {
    this.add("[?]%[?]");
  }

  index = () => {
    this.add("?^{?}");
  }

  change = (e) => {
    const input = e.target.value;
    const result = this.parse(input);
    this.setState({
      input: input, 
      output: result
    });
  }

  click = () => {
    const result = this.state.output;
    const answer = this.ansify(result);
    this.setState({
      answer: answer
    });
  }

  render() {
    return (
      <div className="App">
        <MathJax.Provider>
          <div>
            <div style={{background: "#ccc", padding: 3, margin: 3}}>
              <MathJax.Node id="text" formula={this.state.answer} />
            </div>
            <div style={{background: "#ccc", padding: 3, margin: 3}}>
              <MathJax.Node id="text" formula={this.state.output} />
            </div>
            <input id="input" type="text" value={this.state.input} onChange={this.change} style={{height: "1em", fontSize: "3em"}} />
            <button onClick={this.sqrt}>
              <MathJax.Node formula="\sqrt{\boxed{\phantom{0}}}" />
            </button>
            <button onClick={this.frac}>
              <MathJax.Node formula="\frac{\boxed{\phantom{0}}}{\boxed{\phantom{0}}}" />
            </button>
            <button onClick={this.index}>
              <MathJax.Node formula="\boxed{\phantom{0}}^{\boxed{\phantom{0}}}" />
            </button>
            <button onClick={this.click}>Render</button>
          </div>
        </MathJax.Provider>
      </div>
    );
  }
}

export default App;
