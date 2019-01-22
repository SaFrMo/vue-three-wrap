"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var THREE = _interopRequireWildcard(require("three"));

var _popmotion = require("popmotion");

var _shared = require("@/utils/shared");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var interpolate = _popmotion.transform.interpolate;
var _default = {
  data: function data() {
    return {
      raycaster: new THREE.Raycaster(),
      mouseX: 0,
      mouseY: 0,
      canvasSelector: 'canvas',
      buildPointer: true
    };
  },
  mounted: function () {
    var _mounted = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var _this = this;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _shared.asyncWaitFor)(this.canvasSelector);

            case 2:
              if (this.buildPointer) {
                (0, _popmotion.pointer)().pipe(function (v) {
                  v.x -= _this.clientRect.left;
                  v.y -= _this.clientRect.top;
                  v.x = interpolate([0, _this.clientRect.width], [-1, 1])(v.x);
                  v.y = interpolate([0, _this.clientRect.height], [1, -1])(v.y);
                  return v;
                }).start(function (v) {
                  _this.mouseX = v.x;
                  _this.mouseY = v.y;
                });
              }

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function mounted() {
      return _mounted.apply(this, arguments);
    }

    return mounted;
  }(),
  methods: {
    updateRaycaster: function updateRaycaster(camera) {
      var coordinates = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var autoInterpolate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var x = this.mouseX;
      var y = this.mouseY; // use manually passed coordinates

      if (coordinates !== null) {
        x = coordinates.hasOwnProperty('x') ? coordinates.x : x;
        y = coordinates.hasOwnProperty('y') ? coordinates.y : y; // interpolate coordinates if desired

        if (autoInterpolate) {
          x = interpolate([0, this.clientRect.width], [-1, 1])(x);
          y = interpolate([0, this.clientRect.height], [1, -1])(y);
        }
      } // update raycaster


      this.raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    }
  }
};
exports.default = _default;