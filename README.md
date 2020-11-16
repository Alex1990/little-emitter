# little-emitter

[![Build Status](https://travis-ci.com/Alex1990/little-emitter.svg?branch=master)](https://travis-ci.com/Alex1990/little-emitter)
[![npm](https://img.shields.io/npm/v/little-emitter.svg)](https://www.npmjs.com/package/little-emitter)

A tiny event emitter for node and the browser.

## Install

```bash
npm install little-emitter --save
```

## Usage

The little-emitter can be as a CommonJS/AMD module or a method on global object, such as `window` in browser.

**Node:**

```js
var Emitter = require('little-emitter');
var emitter = new Emitter();

emitter.on('init', function(){ console.log('init'); });
emitter.emit('init'); // "init"
emitter.off('init');
```
**Browser:**

```js
var emitter = new Emitter();
```

It can be as a mixin:

```js
var foo = { name: 'Foo' };
Emitter(foo);
// Or
// new Emitter(foo);
// foo = new Emitter(foo);

foo.on('say', function(){ console.log(this.name); });
foo.emit('say'); // "Foo"
```

## API

The `Emitter` instance methods:

### on(type, fn)

**Alias:** `addEventListener`

Attach a listener to the emitter.

### once(type, fn)

**Alias:** `one`

Attach a listener which is executed at most once.

### off(type, fn)

**Alias:** `removeEventListener`/`removeAllListeners`

- If nothing is passed, all listeners will be removed.
- If only the `type` parameter is passed, the given type listeners will be removed.
- If the `type` and `fn` are specified, the earliest bound listener for the given type will be removed.

### emit(type, [arg1], [arg2], ...)

**Alias:** `trigger`

Emit the specified type event and pass some arguments to the listener optionally.

### getListeners(type)

**Alias:** `listeners`

Return the given type listeners or all listeners or an empty array.

## License

MIT.
