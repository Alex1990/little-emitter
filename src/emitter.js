/*!
 * little-emitter - A tiny event emitter for node and the browser.
 * https://github.com/Alex1990/little-emitter
 * Under the MIT license | (c)2015-2018 Alex Chao
 */

// Shorthand
let proto;

// Helper functions
// ---------------

function mixin(obj1, obj2) {
  for (const p in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, p)) {
      obj1[p] = obj2[p];
    }
  }
  return obj1;
}

// Extract all event listeners to an array.
function flattenEvents(events) {
  let listeners = [];
  for (const type in events) {
    if (events.hasOwnProperty(type)) {
      listeners = listeners.concat(events[type]);
    }
  }
  return listeners;
}

// Constructor to initialize an `Emitter` instance.
export default function Emitter(obj) {
  if (obj) {
    obj._events = {};
    return mixin(obj, proto);
  }
  this._events = {};
}

// Shorthand
proto = Emitter.prototype;

// Add a listener for a given event.
proto.on =
proto.addEventListener = function(type, fn) {
  (this._events[type] = this._events[type] || []).push(fn);
  return this;
};

// Add a listener for a given event.
// This listener can be called once, then will be removed.
proto.one =
proto.once = function(type, fn) {
  const wrapper = function() {
    this.off(type, wrapper);
    fn.apply(this, arguments);
  };

  wrapper.fn = fn;
  return this.on(type, wrapper);
};

// Remove all event listeners
// or remove the given event listeners
// or remove the specified listener for the given event.
proto.off =
proto.removeAllListners =
proto.removeEventListener = function(type, fn) {
  const events = this._events[type];

  if (arguments.length === 0) {
    this._events = {};
  } else if (arguments.length === 1) {
    delete this._events[type];
  } else if (events) {
    let listener;
    for (let i = 0; i < events.length; i++) {
      listener = events[i];
      if (listener === fn || listener.fn === fn) {
        events.splice(i, 1);
        break;
      }
    }
    if (!events.length) delete this._events[type];
  }
  return this;
};

// Trigger a given event with optional arguments.
proto.emit =
proto.trigger = function(type, ...args) {
  const events = this._events[type];
  if (!events) return false;

  for (const event of events) {
    event.apply(this, args);
  }
  return true;
};

// Get the event listeners or all event listeners.
proto.listeners = function(type) {
  if (type) {
    return this._events[type] || [];
  } else {
    return flattenEvents(this._events);
  }
};
