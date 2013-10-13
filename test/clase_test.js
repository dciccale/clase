var Clase = require('../lib/clase').Clase;
var _ = require('underscore');
var Backbone = require('backbone');
var requirejs = require('requirejs');

requirejs.config({
  nodeRequire: require
});

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
    constructor: function (name) {
      this.name = name;
    }
  });
  var myclass = new MyClass('test');

  test.deepEqual(MyClass, MyClass.prototype.constructor);
  test.deepEqual(myclass.constructor, MyClass.prototype.constructor);
  test.deepEqual(myclass.name, 'test');
  test.done();
};

exports['Can extend a class'] = function (test) {
  var MyClass = Clase({
    constructor: function (name) {
      this.name = name;
    }
  });
  var MyClass2 = Clase(MyClass, {
    getName: function () {
      return this.name;
    }
  });
  var myclass2 = new MyClass2('test');

  test.deepEqual(myclass2.getName(), 'test');
  test.deepEqual(MyClass2.__super__, MyClass.prototype);
  test.done();
};

exports['The __super__ property should point to the parent prototype'] = function (test) {
  var MyClass = Clase({
    constructor: function (name) {
      this.name = name;
    }
  });
  var MyClass2 = Clase(MyClass, {
    getName: function () {
      return this.name;
    }
  });

  test.deepEqual(MyClass2.__super__, MyClass.prototype);
  test.done();
};

exports['There should be No __super__ property if no parent'] = function (test) {
  var MyClass = Clase({
    constructor: function (name) {
      this.name = name;
    }
  });

  test.deepEqual(MyClass.__super__, undefined);
  test.done();
};

exports['Can call _super method'] = function (test) {
  var MyClass = Clase({
    constructor: function (name) {
      this.name = name;
    },
    getName: function () {
      return this.name;
    }
  });
  var MyClass2 = Clase(MyClass, {
    getName: function () {
      return this._super();
    }
  });
  var myclass2 = new MyClass2('test');

  test.deepEqual(myclass2.getName(), 'test');
  test.deepEqual(MyClass2.__super__, MyClass.prototype);
  test.done();
};

exports['Can extend a class constructor'] = function (test) {
  var MyClass = Clase({
    constructor: function (name) {
      this.name = name;
    }
  });
  var MyClass2 = Clase(MyClass, {
    constructor: function (name, age) {
      this.name = name;
      this.age = age;
    }
  });
  var myclass2 = new MyClass2('ramon', 43);

  test.deepEqual(myclass2.name, 'ramon');
  test.deepEqual(myclass2.age, 43);
  test.deepEqual(MyClass2.__super__, MyClass.prototype);
  test.done();
};

exports['Can extend a class constructor even if is not the first property'] = function (test) {
  var MyClass = Clase({
    constructor: function (name) {
      this.name = name;
    }
  });
  var MyClass2 = Clase(MyClass, {
    alive: false,
    constructor: function (name, age) {
      this._super(name);
      this.age = age;
    }
  });
  var myclass2 = new MyClass2('ramon', 43);

  test.deepEqual(myclass2.constructor, MyClass2.prototype.constructor);
  test.deepEqual(myclass2.name, 'ramon');
  test.deepEqual(myclass2.alive, false);
  test.deepEqual(myclass2.age, 43);
  test.deepEqual(MyClass2.__super__, MyClass.prototype);
  test.done();
};

exports['Can call _super method in the constructor'] = function (test) {
  var MyClass = Clase({
    constructor: function (name) {
      this.name = name;
    }
  });
  var MyClass2 = Clase(MyClass, {
    constructor: function (name, age) {
      this._super(name);
      this.age = age;
    },
    getName: function () {
      return this.name + ' is ' + this.age;
    }
  });
  var myclass2 = new MyClass2('ramon', 43);

  test.deepEqual(myclass2.getName(), 'ramon is 43');
  test.deepEqual(MyClass2.__super__, MyClass.prototype);
  test.done();
};

exports['Can create static members with second parameter if the first is an object'] = function (test) {
  var MyClass = Clase({
    constructor: function (name) {
      this.name = name;
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
    constructor: function (name) {
      this.name = name;
    }
  });
  var MyClass2 = Clase(MyClass, {
    constructor: function (name, age) {
      this._super(name);
      this.age = age;
    },
    getName: function () {
      return this.name + ' is ' + this.age;
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
    constructor: function (name) {
      this.name = name;
    }
  }, {
    constructor: function (name, age) {
      this._super(name);
      this.age = age;
    },
    getName: function () {
      return this.name + ' is ' + this.age;
    }
  }, {
    isStatic: true
  });
  var myclass = new MyClass('ramon', 43);

  test.deepEqual(MyClass.__super__, undefined);
  test.deepEqual(myclass.getName(), 'ramon is 43');
  test.deepEqual(MyClass.isStatic, true);
  test.deepEqual(MyClass.__super__, undefined);
  test.done();
};

exports['Should not have __super__ property when passing three objects'] = function (test) {
  var MyClass = Clase(
    {name: 'obj1'},
    {name: 'obj2'},
    {name: 'static'}
  );
  var myclass = new MyClass();

  test.deepEqual(MyClass.__super__, undefined);
  test.done();
};

exports['Can extend two already created classes into a new one'] = function (test) {
  var MyClass = Clase({
    constructor: function (name) {
      this.name = name;
    }
  });
  var MyClass2 = Clase({
    getName: function () {
      return this.name;
    }
  });
  var MyClass3 = Clase(MyClass, MyClass2);
  var myclass3 = new MyClass3('ramon');

  test.deepEqual(myclass3.getName(), 'ramon');
  test.deepEqual(MyClass.__super__, undefined);
  test.deepEqual(MyClass2.__super__, undefined);
  test.deepEqual(MyClass3.__super__, MyClass.prototype);
  test.done();
};

exports['Can extend two already created classes constructor'] = function (test) {
  var MyClass = Clase({
    constructor: function (name) {
      this.name = name;
    }
  });
  var MyClass2 = Clase({
    constructor: function (name, age) {
      this._super(name);
      this.age = age;
    },
    getName: function () {
      return this.name + ' is ' + this.age;
    }
  });
  var MyClass3 = Clase(MyClass, MyClass2);
  var myclass3 = new MyClass3('ramon', 43);

  test.deepEqual(myclass3.getName(), 'ramon is 43');
  test.deepEqual(MyClass.__super__, undefined);
  test.deepEqual(MyClass2.__super__, undefined);
  test.deepEqual(MyClass3.__super__, MyClass.prototype);
  test.done();
};

exports['Can extend Backbone.Model'] = function (test) {
  var MyModel = Clase(Backbone.Model, {
    initialize: function (name) {
      this.set('name', 'ramon');
    }
  });
  var mymodel = new MyModel();

  test.deepEqual(mymodel.get('name'), 'ramon');
  mymodel.set('age', 43)
  test.deepEqual(mymodel.get('age'), 43);
  test.deepEqual(MyModel.__super__, Backbone.Model.prototype);
  test.done();
};

exports['Can call _super on Backbone.Model methods'] = function (test) {
  var MyModel = Clase(Backbone.Model, {
    initialize: function () {
      this.set('name', 'ramon');
    }
  });
  var MyModel2 = Clase(MyModel, {
    initialize: function () {
      this._super();
      this.set('age', 43);
    }
  });

  var mymodel2 = new MyModel2();

  test.deepEqual(mymodel2.get('name'), 'ramon');
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
