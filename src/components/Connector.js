import React, {PropTypes} from 'react';


export default class Connector extends React.Component {

  static propTypes = {
    connector: PropTypes.object,
    connectorStyle: PropTypes.object,
    end: PropTypes.object.isRequired,
    start: PropTypes.object.isRequired,
    removeConnector: PropTypes.func
  };


  getStyle() {
    const {connectorStyle} = this.props;

    return Object.assign({}, {
      color: '#000000',
      r: 4,
      width: 2
    }, connectorStyle);

  }


  getDistance(start, end) {
    return Math.sqrt( (end.x - start.x) * (end.x - start.x) + (end.y - start.y) * (end.y - start.y) );
  }


  getCurve(start, end) {
    const distance = this.getDistance(start, end);
    return `M${start.x},${start.y} C${start.x + distance * 0.5},${start.y} ${end.x - distance * 0.5},${end.y}  ${end.x},${end.y}`;
  }


  removeConnector() {
    const {connector, removeConnector} = this.props;

    if (typeof removeConnector === 'function') removeConnector(connector);
  }


  render() {
    const {start, end} = this.props;
    const style = this.getStyle();

    return (
      <g>
        <circle cx={start.x} cy={start.y} r={style.r} fill={style.color} />
        <circle cx={end.x} cy={end.y} r={style.r} fill={style.fill} />
        <path d={this.getCurve(start, end)} fill="none" strokeWidth={style.width} stroke={style.color} style={{cursor: 'pointer'}} onMouseUp={() => this.removeConnector()} />
      </g>
    );

  }

}
