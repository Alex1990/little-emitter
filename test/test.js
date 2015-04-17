var Emitter = require('../emitter');
var should = require('should');

describe('Emitter', function(){
  describe('new Emitter()', function(){
     it('should return an Emitter instance when no parameter is passed', function(){
       var emitter = new Emitter;
       (emitter instanceof Emitter).should.equal(true);
     })
  })

  describe('Emitter(obj)', function(){
    it('should mixin an object', function(){
      var obj = { name: 'Object' };
      var calls = [];

      Emitter(obj);

      obj.on('foo', function(){
        calls.push(this.name);
      });
      obj.emit('foo');
      
      calls.should.eql(['Object']);
    })
  })
})

describe('API', function(){
  describe('on(type, fn)', function(){
    it('should add listeners', function(){
      var emitter = new Emitter;
      var calls = [];

      emitter.on('foo', function(val){
        calls.push('one', val);
      });

      emitter.on('foo', function(val){
        calls.push('two', val);
      });

      emitter.emit('foo', 1);
      emitter.emit('bar', 1);
      emitter.emit('foo', 2);

      calls.should.eql([ 'one', 1, 'two', 1, 'one', 2, 'two', 2 ]);
    })
  })

  describe('once(type, fn)', function(){
    it('should add a listener which is executed once', function(){
      var emitter = new Emitter;
      var calls = [];

      emitter.once('foo', function(val){
        calls.push('one', val);
      });

      emitter.emit('foo', 1);
      emitter.emit('foo', 2);
      emitter.emit('bar', 1);

      calls.should.eql([ 'one', 1 ]);
    })
  })

  describe('off(type, fn)', function(){
    it('should remove specified listener of the given event type', function(){
      var emitter = new Emitter;
      var calls = [];
      var fn1 = function(){
        calls.push(1);
      };
      var fn2 = function(){
        calls.push(2);
      };

      emitter.on('foo', fn1);
      emitter.on('foo', fn2);

      emitter.emit('foo');

      emitter.off('foo', fn2);
      emitter.emit('foo');

      calls.should.eql([ 1, 2, 1 ]);
    })
    it('should remove all listeners of the given event type', function(){
      var emitter = new Emitter;
      var calls = [];
      var fn1 = function(){
        calls.push(1);
      };
      var fn2 = function(){
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

      calls.should.eql([ 1, 2, 1, 1 ]);
    })
    it('should remove all listeners for all event type', function(){
      var emitter = new Emitter;
      var calls = [];
      var fn1 = function(){
        calls.push(1);
      };
      var fn2 = function(){
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

      calls.should.eql([ 1, 2, 1 ]);
    })
  })

  describe('emit(type, [arg1], [arg2], ...)', function(){
    it('should emit an event', function(){
      var emitter = new Emitter;
      var calls = [];

      emitter.on('foo', function(){
        calls.push('one');
      });
      emitter.emit('foo', 1);

      calls.should.eql(['one']);
    })
    it('should pass some parameters', function(){
      var emitter = new Emitter;
      var calls = [];

      emitter.on('foo', function(){
        calls = calls.concat(Array.prototype.slice.call(arguments));
      });
      emitter.emit('foo', 1, false, 'hello');

      calls.should.eql([ 1, false, 'hello' ]);
    })
  })

  describe('listeners(type)', function(){
    it('should return all listeners of the given event', function(){
      var emitter = new Emitter;
      var fn1 = function(){};
      var fn2 = function(){};

      emitter.on('foo', fn1);
      emitter.on('bar', fn1);
      emitter.on('foo', fn2);

      var listeners = emitter.listeners('foo');

      listeners.should.eql([ fn1, fn2 ]);
    })
    it('should return all listeners', function(){
      var emitter = new Emitter;
      var fn1 = function(){};
      var fn2 = function(){};

      emitter.on('foo', fn1);
      emitter.on('bar', fn1);
      emitter.on('foo', fn2);

      var listeners = emitter.listeners();

      listeners.should.eql([ fn1, fn1, fn2 ]);
    })
    it('should return an empty array when no listener for the event', function(){
      var emitter = new Emitter;
      var fn = function(){};

      emitter.on('bar', fn);
      var listeners = emitter.listeners('foo');

      listeners.should.eql([]);
    })
    it('should return an empty array when no event', function(){
      var emitter = new Emitter;
      
      var listeners = emitter.listeners();

      listeners.should.eql([]);
    })
  })
})
