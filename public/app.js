import { renderCanvas, Canvas, CanvasComponent } from './lib/canvasComponents.js'

class Line extends CanvasComponent {
  constructor (props) {
    super(props)
    this.props = props
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
    this.state = {}
  }

  renderLayers () {
    return [
      { id: 'Line', component: Line, props: { color: 'red' } }
    ]
  }
}

const root = document.getElementById('root')
renderCanvas(root, new RootComponent({ width: 375, height: 812 }))
