const hasOwn = Object.prototype.hasOwnProperty;

export function mixin(obj1, obj2) {
  for (const p in obj2) {
    if (hasOwn.call(obj2, p)) {
      obj1[p] = obj2[p];
    }
  }
  return obj1;
}

// Extract all event listeners to an array.
export function flattenEvents(events) {
  let listeners = [];
  for (const type in events) {
    if (hasOwn.call(events, type)) {
      listeners = listeners.concat(events[type]);
    }
  }
  return listeners;
}
