import React from 'react';
import Graph from 'react-dnd-node-graph';


export default class App extends React.Component {

  constructor(props) {
    super(props);

    const nodes = [
      {id: 1, title: 'Node 1', top: 0, left: 0, pins: [
        {id: 1, title: 'Pin 1'},
        {id: 2, title: 'Pin 2'}
      ]},
      {id: 2, title: 'Node 2', pins: [
        {id: 1, title: 'Pin 1'},
        {id: 2, title: 'Pin 2'}]
      }];
    const connectors = [{start: {nodeId: 1, pinId: 1}, end: {nodeId: 2, pinId: 1}}];

    this.state = {nodes, connectors};
  }


  onAddConnector(connector) {
    let state = this.state;
    state.connectors.push(connector);
    this.setState(state);
  }


  removeConnector(connector) {
    let state = this.state;
    const index = state.connectors.indexOf(connector);
    state.connectors.splice(index, 1);

    this.setState(state);
  }


  onNodeMove(id, left, top) {
    let state = this.state;
    const nodeIndex = state.nodes.map(n => n.id).indexOf(id);

    state.nodes[nodeIndex].left = left;
    state.nodes[nodeIndex].top = top;

    this.setState(state);
  }


  render() {
    const {connectors, nodes} = this.state

    const style={width: '100%', height: '1000px'};

    return (
      <div>
        <Graph {...{connectors, nodes}}
          graphStyle={style}
          onAddConnector={(c) => this.onAddConnector(c)}
          onRemoveConnector={(c) => this.removeConnector(c)} />
      </div>
    );

  }

}
