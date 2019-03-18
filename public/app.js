import { Chart } from './components/Chart.js'
import { renderCanvas, Canvas } from './lib/canvasComponents.js'
import { getChartByIndex } from './api.js'

class RootComponent extends Canvas {
  constructor (props) {
    super(props);
    this.state = {
      chartIndex: 0,
      chartData: null
    };
  }

  fetchChartData (index) {
    getChartByIndex(index)
      .then(chartData => {
        this.setState({ chartIndex: index, chartData })
      })
  }

  componentDidMount () {
    this.fetchChartData(this.state.chartIndex)
  }

  renderLayers () {
    return [
      { id: 'Chart', component: Chart, props: { color: this.state.color, x: 150, y: 150, data: this.state.chartData } }
    ];
  }
}

const root = document.getElementById('root');
renderCanvas(root, new RootComponent({ width: 375, height: 812 }));
