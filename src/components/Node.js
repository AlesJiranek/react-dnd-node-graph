import Pin from './Pin';
import React, {PropTypes} from 'react';
import {DragSource} from 'react-dnd';


class Node extends React.Component {

  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    endConnector: PropTypes.func.isRequired,
    getNodeId: PropTypes.func.isRequired,
    getNodeTitle: PropTypes.func,
    getPinTitle: PropTypes.func,
    getPinId: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    node: PropTypes.object.isRequired,
    nodeStyle: PropTypes.object.isRequired,
    pins: PropTypes.array.isRequired,
    pinStyle: PropTypes.object.isRequired,
    startConnector: PropTypes.func.isRequired
  };


  getStyle() {
    const {nodeStyle: {headerHeight, ...nodeStyle}} = this.props; //eslint-disable-line

    return Object.assign({}, {
      borderStyle: 'solid',
      boxSizing: 'border-box',
      position: 'absolute'
    }, nodeStyle);
  }


  getNodeTitle() {
    const {getNodeTitle, node} = this.props;

    if (typeof getNodeTitle === 'function') return getNodeTitle(node);
    return node.title;
  }


  renderHeader() {
    const {connectDragSource, nodeStyle: {headerHeight}} = this.props;

    return connectDragSource(
      <div className="rdng-node-header" style={{height: headerHeight}}>
          <span className="rdng-node-title">{this.getNodeTitle()}</span>
      </div>
    );
  }


  renderPins() {
    const {endConnector, getNodeId, getPinTitle, getPinId, node, pins, pinStyle, startConnector} = this.props;

    return pins.map(pin =>
      <li key={getPinId(pin)}>
        <Pin {...{endConnector, node, pin, getNodeId, getPinId, getPinTitle, pinStyle, startConnector}} />
      </li>
    );
  }


  render() {
    const {connectDragPreview, isDragging} = this.props;
    const visibility = {
      visibility: isDragging ? 'hidden' : 'visible'
    };

    return connectDragPreview(
      <div className="rdng-node" style={{...this.getStyle(), ...visibility}}>
        {this.renderHeader()}
        <div className="rdng-node-content">
          <ul style={{padding: 0, listStyleType: 'none', margin: 0}}>
            {this.renderPins()}
          </ul>
        </div>
      </div>
    );

  }

}


const nodeSource = {
  beginDrag(props) {
    const {getNodeId, node, nodeStyle} = props;
    return {id: getNodeId(node), left: nodeStyle.left, top: nodeStyle.top};
  }
};

const Source = DragSource('rdng-node', nodeSource, (connect, monitor) => ({
  connectDragPreview: connect.dragPreview(),
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(Node);


export default Source;
