import React, {PropTypes} from 'react';


export default class Pin extends React.Component {

  static propTypes = {
    endConnector: PropTypes.func.isRequired,
    getNodeId: PropTypes.func.isRequired,
    getPinId: PropTypes.func.isRequired,
    getPinTitle: PropTypes.func,
    node: PropTypes.object.isRequired,
    pin: PropTypes.object.isRequired,
    pinStyle: PropTypes.object.isRequired,
    startConnector: PropTypes.func.isRequired
  };


  getTitle() {
    const {getPinTitle, pin} = this.props;

    if (typeof getPinTitle === 'function') return getPinTitle(pin);
    return pin.title;
  }


  getStyle() {
    const {pinStyle} = this.props;

    return Object.assign({}, {
      textAlign: 'center'
    }, pinStyle);
  }


  startConnector(e) {
    const {getNodeId, getPinId, node, pin, startConnector} = this.props;
    const nodeId = getNodeId(node);
    const pinId = getPinId(pin);

    startConnector(e, {nodeId, pinId});
  }


  endConnector(e) {
    const {endConnector, getNodeId, getPinId, node, pin} = this.props;
    const nodeId = getNodeId(node);
    const pinId = getPinId(pin);

    endConnector(e, {nodeId, pinId});
  }


  render() {
    const style = this.getStyle();

    return (
      <div style={style}>
        <span className="rdng-pin-in" onMouseUp={e => this.endConnector(e)} style={{float: 'left', height: style.height, cursor: style.cursor}}>
           <svg height={style.height} width={style.height}>
            <circle r="4" fill="none" stroke="black" strokeWidth="1" cx={style.height / 2} cy={style.height / 2} />
          </svg>
        </span>
        <span className="rdng-pin-title">
          {this.getTitle()}
        </span>
        <span className="rdng-pin-out" onMouseDown={e => this.startConnector(e)} style={{float: 'right', cursor: 'pointer', height: style.height}}>
          <svg height={style.height} width={style.height}>
            <circle r="4" fill="none" stroke="black" strokeWidth="1" cx={style.height / 2} cy={style.height / 2} />
          </svg>
        </span>
      </div>
    );

  }

}
