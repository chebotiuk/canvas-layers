import { CanvasComponent } from '../lib/canvasComponents.js'

export class Chart extends CanvasComponent {
  constructor (props) {
    super(props);
  }

  componentDidUpdate () {
    console.log(this.props)
  }

  render () {
    if (this.props.data === null) return

    this.ctx.fillStyle = this.props.color;
    this.ctx.lineWidth = 10;
    this.ctx.rect(10, 10, this.props.x, this.props.y);
    this.ctx.fill();
  }
}
