import { Observable, Observer } from './observable.js'

export class CanvasComponent {
  constructor (props = {}) {
    this.state = {}
    this.previousProps = null
    this.props = props
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = this.props.width
    this.canvas.height = this.props.height
    this.isMounted = false
    this._mount()
  }

  _setMountStatus (value) {
    this.isMounted = value
  }

  setState (newState) {
    this.previousState = this.state
    this.state = Object.assign(this.state, newState)
    this._forceUpdate()
  }

  setProps (props) {
    this.previousProps = this.props
    this.props = props
    this._forceUpdate()
  }

  _mount () {
    const { width, height, node } = this.props
    if (this.isMounted) this.canvasNode.clearRect(0, 0, width, height)
    this.render()
    if (!this.isMounted) node.appendChild(this.canvas)
    if (!this.isMounted) this._setMountStatus(true)
  }

  _forceUpdate () {
    this._mount()
  }
}

export class Canvas {
  constructor (props = {}) {
    this.stateObservable = new Observable()
    this.state = {}
    this.props = props
    this.fragmentNode = document.createDocumentFragment()
    this.rootNodeWidth = null
    this.rootNodeHeight = null
  }

  setState (newState) {
    this.state = Object.assign(this.state, newState)
    this.stateObservable.notify(this._prepareProps())
  }

  _prepareProps () {
    const propsMap = {}
    this.renderLayers().forEach((layer, i) => {
      propsMap[layer || i] = layer.props
    })
    return propsMap
  }

  _renderLayers () {
    this.renderLayers().forEach((layer, i) => {
      const LayerComponent = layer.component
      const component = new LayerComponent(
        Object.assign({
          width: this.layerSize.width,
          height: this.layerSize.height,
          node: this.fragmentNode
        }, layer.props)
      )

      this.stateObservable.subscribe(new Observer((data) => {
        component.setProps(data[layer.id || i])
      }))
    })
  }

  get layerSize () {
    return ({
      width: this.props.width || this.rootNodeWidth,
      height: this.props.height || this.rootNodeHeight
    })
  }

  mount (rootNode) {
    this.rootNodeWidth = rootNode.innerWidth
    this.rootNodeHeight = rootNode.innerHeight
    this._renderLayers()
    rootNode.appendChild(this.fragmentNode)
  }
}

export const renderCanvas = (node, component) => {
  component.mount(node)
}
