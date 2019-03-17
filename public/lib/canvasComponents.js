import { objectShallowEquals } from './lib.js'
import { Observable, Observer } from './observable.js'

export class CanvasComponent {
  constructor (props = {}) {
    this.state = {};
    this.previousProps = null;
    this.props = props;
    this.canvas = null
    this.ctx = null
    this.isMounted = false;
    this._mount();
  }

  _setMountStatus (value) {
    this.isMounted = value;
  }

  _prepareCanvasLayer () {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.props.width;
    this.canvas.height = this.props.height;
    this.canvas.style.cssText = 'position: absolute; background-color: transparent;';
  }

  _mount () {
    const { node } = this.props;

    this._prepareCanvasLayer();
    this.render();
    node.appendChild(this.canvas);
    this._setMountStatus(true);
  }

  _forceUpdate () {
    const { width, height } = this.props;

    this.ctx.clearRect(0, 0, width, height);
    this.render();
  }

  setState (newState) {
    this.previousState = this.state;
    this.state = Object.assign(this.state, newState);
    this._forceUpdate();
  }

  setProps (props) {
    this.previousProps = this.props;
    this.props = props;
    if (!objectShallowEquals(this.props, this.previousProps)) this._forceUpdate();
  }
}

export class Canvas {
  constructor (props = {}) {
    this.stateObservable = new Observable();
    this.state = {};
    this.props = props;
    this.fragmentNode = document.createDocumentFragment();
    this.rootNodeWidth = null;
    this.rootNodeHeight = null;
  }

  setState (newState) {
    this.state = Object.assign(this.state, newState);
    this.stateObservable.notify(this._prepareProps());
  }

  _prepareProps () {
    console.log(this.renderLayers())

    const propsMap = {};
    this.renderLayers().forEach((layer, i) => {
      propsMap[layer.id || i] = layer.props;
    });

    return propsMap;
  }

  _renderLayers () {
    this.renderLayers().forEach((layer, i) => {
      const LayerComponent = layer.component;
      const component = new LayerComponent(
        Object.assign({
          width: this._layerSize.width,
          height: this._layerSize.height,
          node: this.fragmentNode
        }, layer.props)
      );

      this.stateObservable.subscribe(new Observer((data) => {
        component.setProps(data[layer.id || i]);
      }));
    });
  }

  get _layerSize () {
    return ({
      width: this.props.width || this.rootNodeWidth,
      height: this.props.height || this.rootNodeHeight
    });
  }

  mount (rootNode) {
    this.rootNodeWidth = rootNode.clientWidth;
    this.rootNodeHeight = rootNode.clientHeight;
    this._renderLayers();
    rootNode.appendChild(this.fragmentNode);
    if (this.componentDidMount) this.componentDidMount()
  }
};

export const renderCanvas = (node, component) => {
  component.mount(node);
};
