/*!
 * little-emitter - A tiny event emitter for node and browser.
 * https://github.com/Alex1990/little-emitter
 * Under the MIT license | (c)2015 Alex Chao
 */

!(function(root, factory) {

  // Uses CommonJS, AMD or browser global to create a jQuery plugin.
  // See: https://github.com/umdjs/umd
  if (typeof define === 'function' && define.amd) {
    // Expose this plugin as an AMD module. Register an anonymous module.
    define(factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS module
    module.exports = factory();
  } else {
    // Browser globals
    factory(root);
  }

}(this, function(root) {

  'use strict';

  // Shortand
  var slice = Array.prototype.slice;
  var proto;

  // Constructor to initialize an `Emitter` instance.
  function Emitter(obj) {
    if (obj) {
      obj._events = {};
      return mixin(obj, proto);
    }
    this._events = {};
  }

  // Shortand
  proto = Emitter.prototype;

  // Add a listener for a given event.
  proto.on =
  proto.addEventListener = function(type, fn) {
    (this._events[type] = this._events[type] || []).push(fn);
    return this;
  };

  // Add a listener for a given event.
  // This listener can be called once, the will be removed.
  proto.one =
  proto.once = function(type, fn) {
    var wrapper = function() {
      this.off(type, wrapper);
      fn.apply(this, arguments);
    };

    wrapper.fn = fn;
    return this.on(type, wrapper);
  };

  // Remove the all events listeners
  // or remove the given event listeners
  // or remove the specified listener for the given event.
  proto.off =
  proto.removeAllListners =
  proto.removeEventListener = function(type, fn) {
    var events = this._events[type];

    if (arguments.length === 0) {
      this._events = {};
    } else if (arguments.length === 1) {
      delete this._events[type];
    } else if (events) {
      var listener;
      for (var i = 0; i < events.length; i++) {
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
  proto.trigger = function(type/*, args... */) {
    var events = this._events[type];
    if (!events) return false;

    for (var i = 0, len = events.length; i < len; i++) {
      events[i].apply(this, slice.call(arguments, 1));
    }
    return true;
  };

  // Get the event listeners or all events listeners.
  proto.listeners = function(type) {
    if (type) {
      return this._events[type] ? this._events[type] : [];
    } else {
      return flattenEvents(this._events);
    }
  };

  // Helper function
  // ---------------

  function mixin(obj1, obj2) {
    for (var p in obj2) {
      if (Object.prototype.hasOwnProperty.call(obj2, p)) {
        obj1[p] = obj2[p];
      }
    }
    return obj1;
  }

  // Extract all event listeners to an array.
  function flattenEvents(events) {
    var listeners = [];
    for (var type in events) {
      if (events.hasOwnProperty(type)) {
        listeners = listeners.concat(events[type]);
      }
    }
    return listeners;
  }

  if (root) {
    root.Emitter = Emitter;
  } else {
    return Emitter;
  }
}));
