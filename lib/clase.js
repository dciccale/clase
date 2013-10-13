(function () {
  var slice = Array.prototype.slice;
  var ObjProto = Object.prototype;
  var FuncProto = Function.prototype;
  // check if js interpreter supports testing the super method via regex
  // otherwise it will wrap the super method always, but that does any harm
  var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  var wrapSuperFn = function (name, fn, _super) {
    return function ctor() {
      var tmp = this._super;

      // Add a new ._super() method that is the same method
      // but on the super-class
      this._super = _super[name];

      // The method only need to be bound temporarily, so we
      // remove it when we're done executing
      var ret = fn.apply(this, arguments);
      this._super = tmp;
      return ret;
    };
  };

  // utils
  var _ = {};

  _.isFunction = function(obj) {
    return obj && typeof obj === 'function';
  };

  _.isObject = function(obj) {
    return obj && ObjProto.toString.call(obj) === '[object Object]';
  };

  _.isClass = function(obj) {
    return _.isFunction(obj) && (obj.prototype && obj === obj.prototype.constructor);
  };

  _.has = function(obj, key) {
    return ObjProto.hasOwnProperty.call(obj, key);
  };

  // checks if the constructor is empty
  _.hasCtor = function (ctor) {
    return !(/\{\s*\}/.test(FuncProto.toString.call(ctor)));
  };

  _.extend = function(obj) {
    var objs = slice.call(arguments, 1);
    objs.forEach(function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // extends the prototype with the _super() if needed
  _.extendProto = function (child, protoProps, parentProto) {
    var childProto = child.prototype;
    var name, superFn;

    // if the second argumend is a function
    // use its prototype to extend the child
    if (protoProps && _.isFunction(protoProps)) {
      protoProps = protoProps.prototype;
    }

    for (name in protoProps) {
      // check if the sub class is overriding a super class method but calling _super()
      // only then wrap the function
      if (_.isFunction(protoProps[name]) && _.isFunction(parentProto[name]) &&
          fnTest.test(protoProps[name])) {
        superFn = wrapSuperFn(name, protoProps[name], parentProto);
        if (name === 'constructor') {
          child = superFn;
          child.prototype = childProto;
        } else {
          childProto[name] = superFn;
        }
      } else {
        childProto[name] = protoProps[name];
      }
    }
    return child;
  };

  // makes a constructor function depending on its parent
  // or the prototype
  _.makeCtor = function (parent, protoProps) {
    var ctor = function(){};

    if (!parent && !protoProps) {
      return ctor;
    }

    protoProps = protoProps || parent;

    if (_.has(protoProps, 'constructor')) {
      ctor = protoProps.constructor;
    } else if (_.isFunction(parent)) {
      ctor = function(){return parent.apply(this, arguments);};
    }

    return ctor;
  };

  var Clase = function (parent, protoProps, staticProps) {
    var child, ctor, name, superFn, parentProto;

    // return empty class if no prototype passed
    if (!parent) {
      return _.makeCtor();
    }

    // extending two classes with each other
    if (_.isClass(parent) && _.isClass(protoProps)) {
      child = Object.create(protoProps.prototype);
      // check if the protoProps has a constructor defined
      if (_.hasCtor(protoProps.prototype.constructor)) {
        child.constructor = protoProps;
      }
      protoProps = child;
    }

    // get the prototype to extend the child
    parentProto = parent.prototype || parent;

    // create constructor
    child = _.makeCtor(parent, protoProps);

    // extend child prototype with parent
    _.extend(child.prototype, parentProto);

    // if three objects where passed, now the first one is already a class
    // use the second to extend it and the third are static members
    if (_.isObject(protoProps) && _.isObject(staticProps)) {
      // to check if the second object is trying to call _super overriding
      // the first object methods, set the parent to myself
      parentProto = child.prototype;
    }

    // extend prototype looking for _super calls
    child = _.extendProto(child, protoProps, parentProto);

    // if two plain objects passed, use the second to extend static members
    if (_.isObject(protoProps) && !staticProps) {
      staticProps = protoProps;
    }

    // extend static members
    _.extend(child, parent, staticProps);

    // save reference to the parent prototype if any
    if (parent.prototype) {
      child.__super__ = parent.prototype;
    }

    return child;
  };

  // export utils as part of main function
  _.extend(Clase, _);

  // export to global
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Clase;
    }
    exports.Clase = Clase;
  } else {
    window.Clase = Clase;
  }
}());
