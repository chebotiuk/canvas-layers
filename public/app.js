import { Chart } from './components/Chart.js'
import { renderCanvas, Canvas } from './lib/canvasComponents.js'
import { getChartByIndex } from './api.js'

class RootComponent extends Canvas {
  constructor (props) {
    super(props);
    this.state = {
      chartIndex: 0
    };
  }

  fetchChartData (index) {
    getChartByIndex(index)
      .then(chartData => {
        const newState = Object.assign({ chartIndex: index }, chartData)
        this.setState(newState)
      })
  }

  componentDidMount () {
    this.fetchChartData(this.state.chartIndex)
  }

  renderLayers () {
    const [dates, y0, y1] = this.state.columns || []
    const { colors } = this.state
    console.log(this.state)

    return [
      {
        id: 'y0',
        component: Chart,
        props: {
          dates: dates || [],
          values: y0 || [],
          color: colors && colors['y0']
        }
      },
      {
        id: 'y1',
        component: Chart,
        props: {
          dates: dates || [],
          values: y1 || [],
          color: colors && colors['y1']
        }
      }
    ];
  }
}

const root = document.getElementById('root');
renderCanvas(root, new RootComponent({ width: 375, height: 375 }));
