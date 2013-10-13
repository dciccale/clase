'use strict';

// running tests in node
if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  var Clase = require('../lib/clase').Clase;
  var Backbone = require('backbone');
  var requirejs = require('requirejs');
  requirejs.config({
    nodeRequire: require
  });

// running tests in the browser
} else {
  var exports = {};
}

exports['Clase is defined'] = function (test) {
  var isDefined = !!Clase;
  test.deepEqual(isDefined, true);
  test.done();
};

exports['Can create an empty class'] = function (test) {
  var MyClass = Clase();
  var isClass = typeof MyClass === 'function' &&
    (MyClass.prototype && MyClass === MyClass.prototype.constructor);

  test.deepEqual(isClass, true);
  test.done();
};

exports['Can create a class with a constructor'] = function (test) {
  var MyClass = Clase({
    constructor: function (color) {
      this.color = color;
    }
  });
  var myclass = new MyClass('test');

  test.deepEqual(MyClass, MyClass.prototype.constructor);
  test.deepEqual(myclass.constructor, MyClass.prototype.constructor);
  test.deepEqual(myclass.color, 'test');
  test.done();
};

exports['Can extend a class'] = function (test) {
  var MyClass = Clase({
    constructor: function (color) {
      this.color = color;
    }
  });
  var MyClass2 = Clase(MyClass, {
    getColor: function () {
      return this.color;
    }
  });
  var myclass2 = new MyClass2('test');

  test.deepEqual(myclass2.getColor(), 'test');
  test.deepEqual(MyClass2.__super__, MyClass.prototype);
  test.done();
};

exports['The __super__ property should point to the parent prototype'] = function (test) {
  var MyClass = Clase({
    constructor: function (color) {
      this.color = color;
    }
  });
  var MyClass2 = Clase(MyClass, {
    getColor: function () {
      return this.color;
    }
  });

  test.deepEqual(MyClass2.__super__, MyClass.prototype);
  test.done();
};

exports['There should be No __super__ property if no parent'] = function (test) {
  var MyClass = Clase({
    constructor: function (color) {
      this.color = color;
    }
  });

  test.deepEqual(MyClass.__super__, undefined);
  test.done();
};

exports['Can call _super method'] = function (test) {
  var MyClass = Clase({
    constructor: function (color) {
      this.color = color;
    },
    getColor: function () {
      return this.color;
    }
  });
  var MyClass2 = Clase(MyClass, {
    getColor: function () {
      return this._super();
    }
  });
  var myclass2 = new MyClass2('test');

  test.deepEqual(myclass2.getColor(), 'test');
  test.deepEqual(MyClass2.__super__, MyClass.prototype);
  test.done();
};

exports['Can extend a class constructor'] = function (test) {
  var MyClass = Clase({
    constructor: function (color) {
      this.color = color;
    }
  });
  var MyClass2 = Clase(MyClass, {
    constructor: function (color, age) {
      this.color = color;
      this.age = age;
    }
  });
  var myclass2 = new MyClass2('red', 43);

  test.deepEqual(myclass2.color, 'red');
  test.deepEqual(myclass2.age, 43);
  test.deepEqual(MyClass2.__super__, MyClass.prototype);
  test.done();
};

exports['Can extend a class constructor even if is not the first property'] = function (test) {
  var MyClass = Clase({
    constructor: function (color) {
      this.color = color;
    }
  });
  var MyClass2 = Clase(MyClass, {
    alive: false,
    constructor: function (color, age) {
      this._super(color);
      this.age = age;
    }
  });
  var myclass2 = new MyClass2('red', 43);

  test.deepEqual(myclass2.constructor, MyClass2.prototype.constructor);
  test.deepEqual(myclass2.color, 'red');
  test.deepEqual(myclass2.alive, false);
  test.deepEqual(myclass2.age, 43);
  test.deepEqual(MyClass2.__super__, MyClass.prototype);
  test.done();
};

exports['Can call _super method in the constructor'] = function (test) {
  var MyClass = Clase({
    constructor: function (color) {
      this.color = color;
    }
  });
  var MyClass2 = Clase(MyClass, {
    constructor: function (color, age) {
      this._super(color);
      this.age = age;
    },
    getColor: function () {
      return this.color + ' is ' + this.age;
    }
  });
  var myclass2 = new MyClass2('red', 43);

  test.deepEqual(myclass2.getColor(), 'red is 43');
  test.deepEqual(MyClass2.__super__, MyClass.prototype);
  test.done();
};

exports['Can create static members with second parameter if the first is an object'] = function (test) {
  var MyClass = Clase({
    constructor: function (color) {
      this.color = color;
    }
  }, {
    isStatic: true
  });

  test.deepEqual(MyClass.isStatic, true);
  test.deepEqual(MyClass.__super__, undefined);
  test.done();
};

exports['Can create static members when extending a class'] = function (test) {
  var MyClass = Clase({
    constructor: function (color) {
      this.color = color;
    }
  });
  var MyClass2 = Clase(MyClass, {
    constructor: function (color, age) {
      this._super(color);
      this.age = age;
    },
    getColor: function () {
      return this.color + ' is ' + this.age;
    }
  }, {
    isStatic: true
  });

  test.deepEqual(MyClass2.isStatic, true);
  test.deepEqual(MyClass2.__super__, MyClass.prototype);
  test.done();
};

exports['Can create a class passing three plain objects'] = function (test) {
  // first object is used as the base class
  // second object is used to extend the first one as prototype
  // third object is used for static members
  var MyClass = Clase({
    constructor: function (color) {
      this.color = color;
    }
  }, {
    constructor: function (color, age) {
      this._super(color);
      this.age = age;
    },
    getColor: function () {
      return this.color + ' is ' + this.age;
    }
  }, {
    isStatic: true
  });
  var myclass = new MyClass('red', 43);

  test.deepEqual(MyClass.__super__, undefined);
  test.deepEqual(myclass.getColor(), 'red is 43');
  test.deepEqual(MyClass.isStatic, true);
  test.deepEqual(MyClass.__super__, undefined);
  test.done();
};

exports['Should not have __super__ property when passing three objects'] = function (test) {
  var MyClass = Clase(
    {color: 'red'},
    {color: 'blue'},
    {color: 'static'}
  );

  test.deepEqual(MyClass.__super__, undefined);
  test.done();
};

exports['Can extend two already created classes into a new one'] = function (test) {
  var MyClass = Clase({
    constructor: function (color) {
      this.color = color;
    }
  });
  var MyClass2 = Clase({
    getColor: function () {
      return this.color;
    }
  });
  var MyClass3 = Clase(MyClass, MyClass2);
  var myclass3 = new MyClass3('red');

  test.deepEqual(myclass3.getColor(), 'red');
  test.deepEqual(MyClass.__super__, undefined);
  test.deepEqual(MyClass2.__super__, undefined);
  test.deepEqual(MyClass3.__super__, MyClass.prototype);
  test.done();
};

exports['Can extend two already created classes constructor'] = function (test) {
  var MyClass = Clase({
    constructor: function (color) {
      this.color = color;
    }
  });
  var MyClass2 = Clase({
    constructor: function (color, age) {
      this._super(color);
      this.age = age;
    },
    getColor: function () {
      return this.color + ' is ' + this.age;
    }
  });
  var MyClass3 = Clase(MyClass, MyClass2);
  var myclass3 = new MyClass3('red', 43);

  test.deepEqual(myclass3.getColor(), 'red is 43');
  test.deepEqual(MyClass.__super__, undefined);
  test.deepEqual(MyClass2.__super__, undefined);
  test.deepEqual(MyClass3.__super__, MyClass.prototype);
  test.done();
};

exports['Can extend Backbone.Model'] = function (test) {
  var MyModel = Clase(Backbone.Model, {
    initialize: function () {
      this.set('color', 'red');
    }
  });
  var mymodel = new MyModel();

  test.deepEqual(mymodel.get('color'), 'red');
  mymodel.set('age', 43);
  test.deepEqual(mymodel.get('age'), 43);
  test.deepEqual(MyModel.__super__, Backbone.Model.prototype);
  test.done();
};

exports['Can call _super on Backbone.Model methods'] = function (test) {
  var MyModel = Clase(Backbone.Model, {
    initialize: function () {
      this.set('color', 'red');
    }
  });
  var MyModel2 = Clase(MyModel, {
    initialize: function () {
      this._super();
      this.set('age', 43);
    }
  });

  var mymodel2 = new MyModel2();

  test.deepEqual(mymodel2.get('color'), 'red');
  test.deepEqual(mymodel2.get('age'), 43);
  test.deepEqual(MyModel.__super__, Backbone.Model.prototype);
  test.deepEqual(MyModel2.__super__, MyModel.prototype);
  test.done();
};

exports['Supports AMD loading'] = function (test) {
  requirejs(['../lib/clase'], function (_Clase) {
    test.deepEqual(_Clase, Clase);
    test.done();
  });
};
