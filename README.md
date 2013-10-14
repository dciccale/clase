# clase [![Build Status](https://travis-ci.org/dciccale/clase.png?branch=master)](https://travis-ci.org/dciccale/clase) [![NPM version](https://badge.fury.io/js/clase.png)](http://badge.fury.io/js/clase)

JavaScript inheritance implementation.

Thanks to my inspirations: JSFace by Tan Nhu, my.Class by Jie Meng-Gerard, simple inheritance by
John Resig, and Underscore.js by Jeremy Ashkenas.

## Installation

```bash
$ npm install clase
```

## Examples
See `test/clase_test.js`.

Create a Class with a constructor
```javascript
var MyClass = Clase({
  constructor: function (color) {
    this.color = color;
  }
});
var myclass = new MyClass('blue');
myclass.name; // 'blue'
```

Extend another class
```javascript
var MyClass2 = Clase(MyClass, {
  getColor: function () {
    return this.color;
  }
});
var myclass2 = new MyClass2('red');
myclass2.getColor(); // 'red'
// __super__ stores the parent prototype
MyClass2.__super__;
```

Extend the constructor or any method calling `_super()`
```javascript
var MyClass2 = Clase(MyClass, {
  constructor: function (color, number) {
    this._super(color);
    this.number = number;
  }
});
var myclass2 = new MyClass2('red', 3);
myclass2.color; // 'red'
// __super__ stores the parent prototype
myclass2.number; // 3;
```

Create static members with a second objecto when creating the class for the first time
```javascript
var MyClass = Clase({
  constructor: function (color) {
    this.color = color;
  }
}, {
  isStatic: true
});
MyClass.isStatic; // true
```

Or create static members when extending from another class with the third argument
```javascript
var MyClass2 = Clase(MyClass, {
  constructor: function (color, number) {
    this._super(color);
    this.number = number;
  },
  getColor: function () {
    return 'color ' + this.color + ' is #' + this.number;
  }
}, {
  isStatic: true
});
MyClass2.isStatic; // true
```

Or create create a class passing three objects:
- The first one will be the parent
- The second will extend the parent
- The third extends static members

```javascript
var MyClass = Clase({
  constructor: function (color) {
    this.color = color;
  }
}, {
  constructor: function (color, number) {
    this._super(color);
    this.number = number;
  },
  getColor: function () {
    return 'color ' + this.color + ' is #' + this.number;
  }
}, {
  isStatic: true
});
var myclass = new MyClass('red', 3);
myclass.getColor(); // 'color red is #3'
```

Extend two already created classes into a new one
```javascript
var MyClass = Clase({
  constructor: function (color) {
    this.color = color;
  }
});
var MyClass2 = Clase({
  constructor: function (color, number) {
    this._super(color);
    this.number = number;
  },
  getColor: function () {
    return 'color ' + this.color + ' is #' + this.number;
  }
});
var MyClass3 = Clase(MyClass, MyClass2);
var myclass3 = new MyClass3('red', 3);
myclass3.getColor(); // 'color red is #3'
```

It also supports extending Backbone objects, for example a Backbone.Model with the nice `_super()` method
```javascript
var MyModel = Clase(Backbone.Model, {
  initialize: function () {
    this.set('color', 'red');
  }
});
var MyModel2 = Clase(MyModel, {
  initialize: function () {
    this._super();
    this.set('number', 3);
  }
});

var mymodel2 = new MyModel2();

mymodel2.get('color'); // 'red'
mymodel2.get('number'); // 3
```

## Running the Unit Tests

```bash
$ npm install
```

#### From the command-line
```bash
$ npm test
```

#### In the browser
Open the [test/clase_test.html](http://denis.io/clase/test/clase_test.html)


## License
See [LICENSE.txt](https://raw.github.com/dciccale/clase/master/LICENSE.txt)
