import { CanvasComponent } from '../lib/canvasComponents.js';
import { scale } from '../lib/math.js';

export class Chart extends CanvasComponent {
  constructor (props) {
    super(props);
  }

  render () {
    const { dates, values, color } = this.props
    if (!values) return

    dates.shift();
    values.shift();

    const { height, width } = this.canvas
    const scaledDates = scale(dates, [0, width]);
    const scaledValues = scale(values, [0, height]);

    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(0, height);
    scaledDates.forEach((date, i) => {
      this.ctx.lineTo(date, height - scaledValues[i]);
    });
    this.ctx.stroke();
  }
}
