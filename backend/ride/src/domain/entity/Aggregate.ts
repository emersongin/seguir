import DomainEvent from '../events/DomainEvent';

export default class Aggregate {
  listeners: Listener[];

  constructor() {
    this.listeners = [];
  }

  register(eventName: string, callback: Function) {
    this.listeners.push({ eventName, callback });
  }

  notify(event: DomainEvent) {
    this.listeners
      .filter(listener => listener.eventName === event.eventName)
      .forEach(listener => listener.callback(event));
  }
}

type Listener = { 
  eventName: string, 
  callback: Function 
};