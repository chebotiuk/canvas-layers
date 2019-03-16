import { renderCanvas, Canvas, CanvasComponent } from './lib/canvasComponents.js'

class Line extends CanvasComponent {
  constructor (props) {
    super(props)
  }

  render () {
    this.ctx.fillStyle = this.props.color;
    this.ctx.lineWidth = 10;
    this.ctx.rect(10, 10, 100, 100);
    this.ctx.fill();
  }
}

class RootComponent extends Canvas {
  constructor (props) {
    super(props)
    this.state = {
      color: 'red'
    }
  }

  renderLayers () {
    setTimeout(() => { this.setState({ color: 'yellow' }) }, 3000)
    return [
      { id: 'Line', component: Line, props: { color: this.state.color } }
    ]
  }
}

const root = document.getElementById('root')
renderCanvas(root, new RootComponent({ width: 375, height: 812 }))
