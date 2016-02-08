import Connector from './Connector';
import HTML5Backend from 'react-dnd-html5-backend';
import Node from './Node';
import React, {PropTypes} from 'react';
import {DropTarget, DragDropContext} from 'react-dnd';


class Graph extends React.Component {

  static propTypes = {
    connectors: PropTypes.array.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    connectorStyle: PropTypes.object,
    getNodeId: PropTypes.func,
    getNodeTitle: PropTypes.func,
    getNodePins: PropTypes.func,
    getPinId: PropTypes.func,
    getPinTitle: PropTypes.func,
    graphStyle: PropTypes.object,
    nodes: PropTypes.array.isRequired,
    nodeStyle: PropTypes.object,
    onNodeMove: PropTypes.func,
    onAddConnector: PropTypes.func,
    onRemoveConnector: PropTypes.func
  };


  constructor(props) {
    super(props);
    this.state = {positions: {}};
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }


  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }


  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }


  onMouseMove(e) {
    const {newConnectorStart} = this.state;

    if (newConnectorStart) {
      let state = this.state;
      state.mousePos = this.getMousePosition(e);
      this.setState(state);
    }
  }


  onMouseUp() {
    let state = this.state;
    state.newConnectorStart = null;
    state.mousePos = null;
    this.setState(state);
  }


  getMousePosition(e) {
    const {svg} = this.refs;
    //Get svg element position to substract offset top and left
    const svgRect = svg.getBoundingClientRect();

    return ({
      x: e.pageX - svgRect.left,
      y: e.pageY - svgRect.top
    });
  }


  moveNode(id, left, top) {
    const {onNodeMove} = this.props;
    let state = this.state;

    if (typeof onNodeMove === 'function') return onNodeMove({id, left, top});

    state.positions[id] = {left, top};
    this.setState(state);
  }


  getNodeStyle(node) {
    const {nodeStyle} = this.props;
    const nodeId = this.getNodeId(node);
    const position = this.state.positions[nodeId] ? this.state.positions[nodeId] : {left: 0, top: 0};
    const userPosition = node.left && node.top ? {left: node.left, top: node.top} : {};

    return Object.assign({}, {
      borderWidth: 1,
      headerHeight: 30,
      margin: 0,
      padding: 10,
      width: 180
    }, position, nodeStyle, userPosition);
  }


  getPinStyle() {
    const {pinStyle} = this.props;
    const {newConnectorStart} = this.state;

    return Object.assign({}, {
      height: 20,
      cursor: newConnectorStart ? 'pointer' : 'default' // show pointer on input pin only when new connector is dragged
    }, pinStyle);
  }


  getNodeId(node) {
    const {getNodeId} = this.props;
    return typeof getNodeId === 'function' ? getNodeId(node) : node.id;
  }


  getPinId(pin) {
    const {getPinId} = this.props;
    return typeof getPinId === 'function' ? getPinId(pin) : pin.id;
  }


  startConnector(e, {nodeId, pinId}) {
    let state = this.state;
    state.newConnectorStart = {nodeId, pinId};
    state.mousePos = this.getMousePosition(e);
    this.setState(state);
  }


  createConnector(e, end) {
    let state = this.state;
    const {newConnectorStart: start} = state;
    if (!start) return;

    const {onAddConnector} = this.props;

    if (typeof onAddConnector === 'function')
      onAddConnector({start, end});

    state.newConnectorStart = null;
    state.mousePos = null;
    this.setState(state);
  }


  getConnectorStartPosition({nodeId, pinId}) {
    const node = this.getNode(nodeId);
    const nodeStyle = this.getNodeStyle(node);
    const pinStyle = this.getPinStyle();
    const getId = this.getPinId.bind(this);
    const pinIndex = this.getNodePins(node).map(p => getId(p)).indexOf(pinId);

    const x = nodeStyle.left // node offset left
      + nodeStyle.width // node width
      + nodeStyle.margin // node margin
      - nodeStyle.borderWidth // node border width
      - nodeStyle.padding // node padding right
      - (pinStyle.height / 2); // center of pin circle connector - width is same as height

    const y = nodeStyle.top // node offset top
     + nodeStyle.borderWidth // node border width
     + nodeStyle.margin // node margin
     + nodeStyle.padding // node padding top
     + nodeStyle.headerHeight // node header height
     + pinStyle.height * pinIndex  // pin offset top
     + (pinStyle.height / 2); // center of pin circle connector - width is same as height

    return {x, y};
  }


  getConnectorEndPosition({nodeId, pinId}) {
    const node = this.getNode(nodeId);
    const nodeStyle = this.getNodeStyle(node);
    const pinStyle = this.getPinStyle();
    const getId = this.getPinId.bind(this);
    const pinIndex = this.getNodePins(node).map(p => getId(p)).indexOf(pinId);

    const x = nodeStyle.left // node offset left
      + nodeStyle.margin  // node margin
      + nodeStyle.borderWidth // noder border width
      + nodeStyle.padding // node padding left
      + (pinStyle.height / 2); // center of pin circle connector - width is same as height

    const y = nodeStyle.top // node offset top
      + nodeStyle.borderWidth // node border width
      + nodeStyle.margin // node margin
      + nodeStyle.padding // node padding top
      + nodeStyle.headerHeight // node header height
      + pinStyle.height * pinIndex  // pin offset top
      + (pinStyle.height / 2); // center of pin circle connector - width is same as height

    return {x, y};
  }


  getNode(nodeId) {
    const {nodes} = this.props;
    const getId = this.getNodeId.bind(this);
    const index = nodes.map(n => getId(n)).indexOf(nodeId);

    return nodes[index];
  }


  getNodePins(node) {
    const {getNodePins} = this.props;

    if(typeof getNodePins === 'function') return getNodePins(node);

    return node.pins;
  }


  render() {
    const {connectDropTarget, connectors, connectorStyle, getNodeTitle, getPinTitle, graphStyle, nodes, onRemoveConnector} = this.props;
    const {newConnectorStart, mousePos} = this.state;

    const style = Object.assign({}, {
      boxSizing: 'border-box',
      height: '100%',
      width: '100%',
      position: 'relative',
      WebkitTouchCallout: 'none', /* iOS Safari */
      WebkitUserSelect: 'none',   /* Chrome/Safari/Opera */
      MozUserSelect: 'none',      /* Firefox */
      msUserSelect: 'none',       /* IE/Edge */
      userSelect: 'none'
    }, graphStyle);


    return connectDropTarget(
      <div style={style}>
      {
        nodes.map(node =>
          <Node
            {...{getNodeTitle, getPinTitle, node}}
            key={this.getNodeId(node)}
            endConnector={(e, c) => this.createConnector(e, c)}
            getNodeId={n => this.getNodeId(n)}
            getPinId={p => this.getPinId(p)}
            nodeStyle={this.getNodeStyle(node)}
            pins={this.getNodePins(node)}
            pinStyle={this.getPinStyle()}
            ref={this.getNodeId(node)}
            startConnector={(e, c) => this.startConnector(e, c)} />
        )
      }

        <svg className="rdng-connectors" height="100%" ref="svg" width="100%">
          {
            connectors.map(connector =>
              <Connector
                connector={connector}
                connectorStyle={connectorStyle}
                key={`${connector.start.nodeId}_${connector.start.pinId}_${connector.end.nodeId}_${connector.end.pinId}`}
                removeConnector={onRemoveConnector}
                start={this.getConnectorStartPosition(connector.start)}
                end={this.getConnectorEndPosition(connector.end)}/>
            )
          }

          {
            newConnectorStart &&
            <Connector
              connectorStyle={connectorStyle}
              start={this.getConnectorStartPosition(newConnectorStart)}
              end={mousePos} />
          }
        </svg>
      </div>
    );

  }

}


const dropTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    const delta = monitor.getDifferenceFromInitialOffset();
    const left = Math.round(item.left + delta.x);
    const top = Math.round(item.top + delta.y);

    component.moveNode(item.id, left, top);
  }
};


// Babel 6 doesn`t support decorators yet
const Target = DropTarget('rdng-node', dropTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(Graph);
const DNDContext = DragDropContext(HTML5Backend)(Target);

export default DNDContext;
