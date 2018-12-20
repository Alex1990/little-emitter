const Emitter = require('..');
require('should');

describe('Emitter', () => {
  describe('new Emitter()()', () => {
    it('should return an Emitter instance when no parameter is passed', () => {
      const emitter = new Emitter();
      (emitter instanceof Emitter).should.equal(true);
    });
  });

  describe('Emitter(obj)', () => {
    it('should mixin an object', () => {
      const obj = { name: 'Object' };
      const calls = [];

      Emitter(obj);

      obj.on('foo', function() {
        calls.push(this.name);
      });
      obj.emit('foo');

      calls.should.eql(['Object']);
    });
  });
});

describe('API', () => {
  describe('on(type, fn)', () => {
    it('should add listeners', () => {
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

      calls.should.eql(['one', 1, 'two', 1, 'one', 2, 'two', 2]);
    });
  });

  describe('once(type, fn)', () => {
    it('should add a listener which is executed once', () => {
      const emitter = new Emitter();
      const calls = [];

      emitter.once('foo', function(val) {
        calls.push('one', val);
      });

      emitter.emit('foo', 1);
      emitter.emit('foo', 2);
      emitter.emit('bar', 1);

      calls.should.eql(['one', 1]);
    });
  });

  describe('off(type, fn)', () => {
    it('should remove specified listener of the given event type', () => {
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

      calls.should.eql([1, 2, 1]);
    });

    it('should remove all listeners of the given event type', () => {
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

      calls.should.eql([1, 2, 1, 1]);
    });

    it('should remove all listeners for all event type', () => {
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

      calls.should.eql([1, 2, 1]);
    });
  });

  describe('emit(type, [arg1], [arg2], ...)', () => {
    it('should emit an event', () => {
      const emitter = new Emitter();
      const calls = [];

      emitter.on('foo', function() {
        calls.push('one');
      });
      emitter.emit('foo', 1);

      calls.should.eql(['one']);
    });

    it('should pass some parameters', () => {
      const emitter = new Emitter();
      let calls = [];

      emitter.on('foo', function() {
        calls = calls.concat(Array.prototype.slice.call(arguments));
      });
      emitter.emit('foo', 1, false, 'hello');

      calls.should.eql([1, false, 'hello']);
    });
  });

  describe('getListeners(type)', () => {
    it('should return all listeners of the given event', () => {
      const emitter = new Emitter();
      const fn1 = function() {};
      const fn2 = function() {};

      emitter.on('foo', fn1);
      emitter.on('bar', fn1);
      emitter.on('foo', fn2);

      const listeners = emitter.getListeners('foo');

      listeners.should.eql([fn1, fn2]);
    });

    it('should return all listeners', () => {
      const emitter = new Emitter();
      const fn1 = function() {};
      const fn2 = function() {};

      emitter.on('foo', fn1);
      emitter.on('bar', fn1);
      emitter.on('foo', fn2);

      const listeners = emitter.getListeners();

      listeners.should.eql([fn1, fn1, fn2]);
    });

    it('should return an empty array when no listener for the event', () => {
      const emitter = new Emitter();
      const fn = function() {};

      emitter.on('bar', fn);
      const listeners = emitter.getListeners('foo');

      listeners.should.eql([]);
    });

    it('should return an empty array when no event', () => {
      const emitter = new Emitter();

      const listeners = emitter.listeners();

      listeners.should.eql([]);
    });
  });
});
