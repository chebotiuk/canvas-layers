export class Observable {
  constructor () {
    this.observers = [];
  }

  subscribe (observer) {
    this.observers.push(observer);
  }

  unsubscribe (observer) {
    this.observers = this.observers.filter(subscriber => subscriber !== observer);
  }

  notify (data) {
    this.observers.forEach(observer => observer.notify(data));
  }
}

export class Observer {
  constructor (handler) {
    this.notify = function(data) {
      handler(data);
    };
  }
}
