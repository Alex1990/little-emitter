const Emitter = require('../..');

describe('Emitter', () => {
  describe('new Emitter()()', () => {
    test('should return an Emitter instance when no parameter is passed', () => {
      const emitter = new Emitter();
      expect(emitter instanceof Emitter).toBe(true);
    });
  });

  describe('Emitter(obj)', () => {
    test('should mixin an object', () => {
      const obj = { name: 'Object' };
      const calls = [];

      Emitter(obj);

      obj.on('foo', function() {
        calls.push(this.name);
      });
      obj.emit('foo');

      expect(calls[0]).toBe('Object');
    });
  });
});

describe('API', () => {
  describe('on(type, fn)', () => {
    test('should add listeners', () => {
      const emitter = new Emitter();
      const calls = [];

      emitter.on('foo', function(val) {
        calls.push('one', val);
      });

      emitter.on('foo', function(val) {
        calls.push('two', val);
      });

      emitter.emit('foo', 1);
      emitter.emit('bar', 1);
      emitter.emit('foo', 2);

      expect(calls).toEqual(['one', 1, 'two', 1, 'one', 2, 'two', 2]);
    });
  });

  describe('once(type, fn)', () => {
    test('should add a listener which is executed once', () => {
      const emitter = new Emitter();
      const calls = [];

      emitter.once('foo', function(val) {
        calls.push('one', val);
      });

      emitter.emit('foo', 1);
      emitter.emit('foo', 2);
      emitter.emit('bar', 1);

      expect(calls).toEqual(['one', 1]);
    });
  });

  describe('off(type, fn)', () => {
    test('should remove specified listener of the given event type', () => {
      const emitter = new Emitter();
      const calls = [];
      const fn1 = function() {
        calls.push(1);
      };
      const fn2 = function() {
        calls.push(2);
      };

      emitter.on('foo', fn1);
      emitter.on('foo', fn2);

      emitter.emit('foo');

      emitter.off('foo', fn2);
      emitter.emit('foo');

      expect(calls).toEqual([1, 2, 1]);
    });

    test('should remove all listeners of the given event type', () => {
      const emitter = new Emitter();
      const calls = [];
      const fn1 = function() {
        calls.push(1);
      };
      const fn2 = function() {
        calls.push(2);
      };

      emitter.on('foo', fn1);
      emitter.on('foo', fn2);
      emitter.on('bar', fn1);

      emitter.emit('foo');
      emitter.emit('bar');

      emitter.off('foo');

      emitter.emit('foo');
      emitter.emit('bar');

      expect(calls).toEqual([1, 2, 1, 1]);
    });

    test('should remove all listeners for all event type', () => {
      const emitter = new Emitter();
      const calls = [];
      const fn1 = function() {
        calls.push(1);
      };
      const fn2 = function() {
        calls.push(2);
      };

      emitter.on('foo', fn1);
      emitter.on('foo', fn2);
      emitter.on('bar', fn1);

      emitter.emit('foo');
      emitter.emit('bar');

      emitter.off();

      emitter.emit('foo');
      emitter.emit('bar');

      expect(calls).toEqual([1, 2, 1]);
    });
  });

  describe('emit(type, [arg1], [arg2], ...)', () => {
    test('should emit an event', () => {
      const emitter = new Emitter();
      const calls = [];

      emitter.on('foo', function() {
        calls.push('one');
      });
      emitter.emit('foo', 1);

      expect(calls).toEqual(['one']);
    });

    test('should pass some parameters', () => {
      const emitter = new Emitter();
      let calls = [];

      emitter.on('foo', function() {
        calls = calls.concat(Array.prototype.slice.call(arguments));
      });
      emitter.emit('foo', 1, false, 'hello');

      expect(calls).toEqual([1, false, 'hello']);
    });
  });

  describe('getListeners(type)', () => {
    test('should return all listeners of the given event', () => {
      const emitter = new Emitter();
      const fn1 = function() {};
      const fn2 = function() {};

      emitter.on('foo', fn1);
      emitter.on('bar', fn1);
      emitter.on('foo', fn2);

      const listeners = emitter.getListeners('foo');

      expect(listeners).toEqual([fn1, fn2]);
    });

    test('should return all listeners', () => {
      const emitter = new Emitter();
      const fn1 = function() {};
      const fn2 = function() {};

      emitter.on('foo', fn1);
      emitter.on('bar', fn1);
      emitter.on('foo', fn2);

      const listeners = emitter.getListeners();

      expect(listeners).toEqual([fn1, fn2, fn1]);
    });

    test('should return an empty array when no listener for the event', () => {
      const emitter = new Emitter();
      const fn = function() {};

      emitter.on('bar', fn);
      const listeners = emitter.getListeners('foo');

      expect(listeners).toEqual([]);
    });

    test('should return an empty array when no listener', () => {
      const emitter = new Emitter();

      const listeners = emitter.getListeners();

      expect(listeners).toEqual([]);
    });
  });

  describe('aliases', () => {
    test('addEventListener should be same to as on', () => {
      const emitter = new Emitter();
      expect(emitter.addEventListener).toBe(emitter.on);
    });

    test('removeEventListener/removeEventListeners should be same to as off', () => {
      const emitter = new Emitter();
      expect(emitter.removeEventListener).toBe(emitter.off);
      expect(emitter.removeEventListeners).toBe(emitter.off);
    });

    test('one should be same to as once', () => {
      const emitter = new Emitter();
      expect(emitter.one).toBe(emitter.once);
    });

    test('trigger should be same to as emit', () => {
      const emitter = new Emitter();
      expect(emitter.trigger).toBe(emitter.emit);
    });

    test('listeners should be same to as getListeners', () => {
      const emitter = new Emitter();
      expect(emitter.listeners).toBe(emitter.getListeners);
    });
  });
});
