import { mixin, flattenEvents } from './util';

const EVENTS_KEY = '@events';
const slice = [].slice;
let proto;

// Constructor to initialize an `Emitter` instance.
function Emitter(obj) {
  if (obj) {
    obj[EVENTS_KEY] = {};
    return mixin(obj, proto);
  }
  this[EVENTS_KEY] = {};
}

proto = Emitter.prototype;

// Add a listener for a given event.
proto.on = function on(type, fn) {
  (this[EVENTS_KEY][type] = this[EVENTS_KEY][type] || []).push(fn);
  return this;
};

// Add a listener for a given event.
// This listener can be called once, then will be removed.
proto.once = function once(type, fn) {
  const wrapper = function wrapper() {
    this.off(type, wrapper);
    fn.apply(this, arguments);
  };

  wrapper.fn = fn;
  return this.on(type, wrapper);
};

// Remove all event listeners
// or remove the given event listeners
// or remove the specified listener for the given event.
proto.off = function off(type, fn) {
  const events = this[EVENTS_KEY][type];

  if (arguments.length === 0) {
    this[EVENTS_KEY] = {};
  } else if (arguments.length === 1) {
    delete this[EVENTS_KEY][type];
  } else if (events) {
    let listener;
    for (let i = 0; i < events.length; i++) {
      listener = events[i];
      if (listener === fn || listener.fn === fn) {
        events.splice(i, 1);
        break;
      }
    }
    if (!events.length) delete this[EVENTS_KEY][type];
  }
  return this;
};

// Trigger a given event with optional arguments.
proto.emit = function emit(type) {
  const events = this[EVENTS_KEY][type];
  if (!events) return false;

  for (let i = 0; i < events.length; i++) {
    events[i].apply(this, slice.call(arguments, 1));
  }
  return true;
};

// Get the event listeners or all event listeners.
proto.getListeners = function getListeners(type) {
  if (type) {
    return this[EVENTS_KEY][type] || [];
  }
  return flattenEvents(this[EVENTS_KEY]);
};

// Aliases
proto.addEventListener = proto.on;
proto.removeEventListener = proto.off;
proto.removeEventListeners = proto.off;
proto.one = proto.once;
proto.trigger = proto.emit;
proto.listeners = proto.getListeners;

export default Emitter;
