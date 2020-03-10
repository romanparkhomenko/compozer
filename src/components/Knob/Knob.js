import React, { Component } from 'react';

export default class Knob extends Component {
  constructor(props) {
    super(props);
    this.fullAngle = props.degrees;
    this.startAngle = (360 - props.degrees) / 2;
    this.endAngle = this.startAngle + props.degrees;
    this.margin = props.size * 0.15;
    this.currentDeg = Math.floor(
      this.convertRange(props.min, props.max, this.startAngle, this.endAngle, props.value),
    );
    this.state = { deg: this.currentDeg };
  }

  startDrag = e => {
    e.preventDefault();
    const knob = e.target.getBoundingClientRect();
    const pts = {
      x: knob.left + knob.width / 2,
      y: knob.top + knob.height / 2,
    };
    const moveHandler = e => {
      this.currentDeg = this.getDeg(e.clientX, e.clientY, pts);
      if (this.currentDeg === this.startAngle) this.currentDeg--;
      const newValue = this.convertRange(
        this.startAngle,
        this.endAngle,
        this.props.min,
        this.props.max,
        this.currentDeg,
      );
      this.setState({ deg: this.currentDeg });
      this.props.onChange(newValue);
    };
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', e => {
      document.removeEventListener('mousemove', moveHandler);
    });
  };

  getDeg = (cX, cY, pts) => {
    const x = cX - pts.x;
    const y = cY - pts.y;
    let deg = (Math.atan(y / x) * 180) / Math.PI;
    if ((x < 0 && y >= 0) || (x < 0 && y < 0)) {
      deg += 90;
    } else {
      deg += 270;
    }
    const finalDeg = Math.min(Math.max(this.startAngle, deg), this.endAngle);
    return finalDeg;
  };

  convertRange = (oldMin, oldMax, newMin, newMax, oldValue) =>
    ((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;

  renderTicks = () => {
    const ticks = [];
    const incr = this.fullAngle / this.props.numTicks;
    const size = this.margin + this.props.size / 2;
    for (let deg = this.startAngle; deg <= this.endAngle; deg += incr) {
      const tick = {
        deg,
        tickStyle: {
          height: size + 10,
          left: size - 1,
          top: size + 2,
          transform: `rotate(${deg}deg)`,
          transformOrigin: 'top',
        },
      };
      ticks.push(tick);
    }
    return ticks;
  };

  dcpy = o => JSON.parse(JSON.stringify(o));

  render() {
    const kStyle = {
      width: this.props.size,
      height: this.props.size,
    };
    const iStyle = this.dcpy(kStyle);
    const oStyle = this.dcpy(kStyle);
    const pStyle = this.dcpy(kStyle);
    oStyle.margin = this.margin;
    if (this.props.color) {
      oStyle.backgroundImage = `radial-gradient(100% 70%,hsl(210, ${this.currentDeg}%, ${this
        .currentDeg / 5}%),hsl(${Math.random() * 100},20%,${this.currentDeg / 36}%))`;
    }
    iStyle.transform = `rotate(${this.state.deg}deg)`;
    pStyle.transform = `rotate(${-this.state.deg}deg)`;

    return (
      <div className="knob" style={kStyle}>
        <div className="ticks">
          {this.props.numTicks &&
            this.renderTicks().map((tick, i) => (
              <div
                key={i}
                className={`tick${tick.deg <= this.currentDeg ? ' active' : ''}`}
                style={tick.tickStyle}
              />
            ))}
        </div>
        <div
          className="knob outer"
          style={oStyle}
          onMouseDown={this.startDrag}
          onTouchStart={this.startDrag}
        >
          <div className="knob inner" style={iStyle}>
            <div className="grip" />
            <p id="knob-value-display" style={pStyle}>
              {this.convertRange(
                this.startAngle,
                this.endAngle,
                this.props.min,
                this.props.max,
                this.currentDeg,
              ).toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
