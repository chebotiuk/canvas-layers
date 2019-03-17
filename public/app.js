import { renderCanvas, Canvas, CanvasComponent } from './lib/canvasComponents.js'

class Rect extends CanvasComponent {
  constructor (props) {
    super(props);
  }

  render () {
    this.ctx.fillStyle = this.props.color;
    this.ctx.lineWidth = 10;
    this.ctx.rect(10, 10, this.props.x, this.props.y);
    this.ctx.fill();
  }
}

class RootComponent extends Canvas {
  constructor (props) {
    super(props);
    this.state = {
      color: 'red',
      x: 0,
      y: 0
    };
  }

  componentDidMount () {
    console.log('ok')
    setInterval(() => {
      this.setState({
        x: this.state.x + 1,
        y: this.state.y + 1
      })
    }, 100)
  }

  renderLayers () {
    return [
      { id: 'Rect1', component: Rect, props: { color: this.state.color, x: 150, y: 150 } },
      { id: 'Rect2', component: Rect, props: { color: 'blue', x: this.state.x, y: this.state.y } }
    ];
  }
}

const root = document.getElementById('root');
renderCanvas(root, new RootComponent({ width: 375, height: 812 }));
