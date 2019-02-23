"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var js;
(function (js) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.extractFileName = function (fileUrl) {
            return fileUrl.replace(/^.*(\\|\/)/gi, '');
        };
        Utils.extractDirectoryUrl = function (fileUrl) {
            return fileUrl.replace(/^(\\|\/).*/gi, '');
        };
        Utils.createL2String = function (number) {
            return (number > 9 ? number.toString() : '0' + number);
        };
        Utils.createL4String = function (number) {
            if (number > 9) {
                if (number > 99) {
                    if (number > 999)
                        return number.toString();
                    return '0' + number;
                }
                return '00' + number;
            }
            return '000' + number;
        };
        Utils.watchValue = function (value, minValue, maxValue) {
            if (value < minValue)
                return minValue;
            if (value > maxValue)
                return maxValue;
            return value;
        };
        Utils.executeAction = function (action, argument) {
            try {
                return action(argument);
            }
            catch (e) {
                return null;
            }
        };
        return Utils;
    }());
    js.Utils = Utils;
})(js || (js = {}));
var Core;
(function (Core) {
    var Blocker = (function () {
        function Blocker(progress) {
            if (progress === void 0) { progress = false; }
            this.progress = progress;
            this.eventor = new Core.Eventor();
        }
        Blocker.prototype.add = function (handle, action) {
            var _this = this;
            this.eventor.add(handle, 'click', function (e) {
                _this.progress = false;
            });
            this.eventor.add(document.body, 'click', function (e) {
                if (_this.progress)
                    action();
                else
                    _this.progress = true;
            });
        };
        Blocker.prototype.signal = function (progress) {
            if (progress === void 0) { progress = false; }
            this.progress = progress;
        };
        Blocker.prototype.clear = function () {
            this.progress = false;
            this.eventor.clear();
        };
        return Blocker;
    }());
    Core.Blocker = Blocker;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var ConditionalAction = (function () {
        function ConditionalAction(barrier, owner, finalizer) {
            this.barrier = barrier;
            this.owner = owner;
            this.finalizer = finalizer;
            this.limiter = 0;
            this.counter = 0;
        }
        ConditionalAction.prototype.schedule = function (owner, callback) {
            var _this = this;
            if (this.limiter < this.barrier) {
                var called_1 = false;
                var action = function () {
                    var parameters = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        parameters[_i] = arguments[_i];
                    }
                    if (called_1)
                        return;
                    called_1 = true;
                    _this.counter += 1;
                    callback.apply(owner, parameters);
                    if (_this.counter == _this.barrier)
                        _this.finalizer.apply(_this.owner);
                };
                this.limiter += 1;
                return action;
            }
            return null;
        };
        return ConditionalAction;
    }());
    Core.ConditionalAction = ConditionalAction;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Cookies = (function () {
        function Cookies() {
        }
        Cookies.setCache = function (name, value) {
            this.cookies[name] = value;
        };
        Cookies.removeCache = function (name) {
            delete this.cookies[name];
        };
        Cookies.setCookie = function (name, value, expiration, domain, path) {
            var cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
            if (expiration)
                cookie += ";expires=" + expiration.toUTCString();
            if (domain)
                cookie += ';domain=' + encodeURIComponent(domain);
            if (path)
                cookie += ";path=" + encodeURIComponent(path);
            document.cookie = cookie;
        };
        Cookies.removeCookie = function (name) {
            var expiration = this.calculateDays(-100);
            document.cookie = encodeURIComponent(name) + ";expires=" + expiration.toUTCString();
        };
        Cookies.initialize = function () {
            if (this.initialised)
                return;
            var cookie = document.cookie;
            if (cookie.length > 0) {
                var parts = cookie.split('; ');
                for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                    var el = parts_1[_i];
                    var index = el.indexOf('=');
                    var name_1 = decodeURIComponent(el.substr(0, index));
                    var value = decodeURIComponent(el.substr(index + 1));
                    this.setCache(name_1, value);
                }
            }
            this.initialised = true;
        };
        Cookies.check = function () {
            return navigator.cookieEnabled;
        };
        Cookies.remove = function (name) {
            this.removeCache(name);
            this.removeCookie(name);
        };
        Cookies.getText = function (name) {
            return this.cookies[name] || null;
        };
        Cookies.setText = function (name, value, expiration, domain, path) {
            this.setCache(name, value);
            this.setCookie(name, value, expiration, domain, path);
        };
        Cookies.getBoolean = function (name) {
            var cookie = this.getText(name);
            if (cookie == null)
                return null;
            return cookie == 'true' || cookie == '1';
        };
        Cookies.setBoolean = function (name, value, expiration) {
            var tmp = value.toString();
            this.setText(name, tmp, expiration);
        };
        Cookies.getNumber = function (name) {
            var cookie = this.getText(name);
            if (cookie == null)
                return null;
            return parseFloat(cookie);
        };
        Cookies.setNumber = function (name, value, expiration) {
            var tmp = value.toString();
            this.setText(name, tmp, expiration);
        };
        Cookies.getDate = function (name) {
            var cookie = this.getNumber(name);
            if (cookie == null)
                return null;
            return new Date(cookie);
        };
        Cookies.setDate = function (name, value, expiration) {
            var tmp = value.getTime();
            this.setNumber(name, tmp, expiration);
        };
        Cookies.calculateSeconds = function (value) {
            var now = new Date();
            return new Date(now.getTime() + 1000 * value);
        };
        Cookies.calculateMinutes = function (value) {
            var now = new Date();
            return new Date(now.getTime() + 60000 * value);
        };
        Cookies.calculateHours = function (value) {
            var now = new Date();
            return new Date(now.getTime() + 3600000 * value);
        };
        Cookies.calculateDays = function (value) {
            var now = new Date();
            return new Date(now.getTime() + 86400000 * value);
        };
        Cookies.initialised = false;
        Cookies.cookies = {};
        return Cookies;
    }());
    Core.Cookies = Cookies;
    Cookies.initialize();
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Delay = (function () {
        function Delay() {
            this.handle = null;
        }
        Delay.prototype.call = function (action, time) {
            if (this.handle)
                clearTimeout(this.handle);
            this.handle = setTimeout(action, time);
        };
        Delay.prototype["break"] = function () {
            if (this.handle) {
                clearTimeout(this.handle);
                this.handle = null;
            }
        };
        return Delay;
    }());
    Core.Delay = Delay;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Position = (function () {
        function Position(x, y) {
            this.x = x;
            this.y = y;
        }
        return Position;
    }());
    Core.Position = Position;
    var Dom = (function () {
        function Dom() {
        }
        Dom.getHandle = function (id) {
            return document.getElementById(id);
        };
        Dom.findHandle = function (query, parent) {
            return parent.querySelector(query);
        };
        Dom.findHandles = function (query, parent) {
            return parent.querySelectorAll(query);
        };
        Dom.coverNode = function (handle, parent) {
            handle.mount = function (placeholder, newParent) {
                if (newParent)
                    parent = newParent;
                if (parent == null)
                    throw new Error('Node parent is not defined.');
                parent.insertBefore(handle, placeholder);
            };
            handle.remove = function () {
                Dom.removeNode(handle);
            };
            return handle;
        };
        Dom.coverComment = function (handle, parent) {
            return this.coverNode(handle, parent);
        };
        Dom.coverText = function (handle, parent) {
            return this.coverNode(handle, parent);
        };
        Dom.coverElement = function (handle, parent) {
            return this.coverNode(handle, parent);
        };
        Dom.createComment = function (text, parent) {
            var handle = document.createComment(text);
            return this.coverComment(handle, parent);
        };
        Dom.createText = function (text, parent) {
            var handle = document.createTextNode(text);
            return this.coverText(handle, parent);
        };
        Dom.createElement = function (tag, parent) {
            var handle = document.createElement(tag);
            return this.coverElement(handle, parent);
        };
        Dom.prepareComment = function (text, parent, placeholder) {
            var handle = this.createComment(text, parent);
            handle.mount(placeholder);
            return handle;
        };
        Dom.prepareText = function (text, parent, placeholder) {
            var handle = this.createText(text, parent);
            handle.mount(placeholder);
            return handle;
        };
        Dom.prepareElement = function (tag, parent, placeholder) {
            var handle = this.createElement(tag, parent);
            handle.mount(placeholder);
            return handle;
        };
        Dom.removeNode = function (handle) {
            var parent = handle.parentNode;
            if (parent)
                parent.removeChild(handle);
        };
        Dom.emptyElement = function (handle) {
            var hChild;
            while (hChild = handle.firstChild)
                handle.removeChild(hChild);
        };
        Dom.cloneElement = function (handle, parent) {
            var tmp = handle.cloneNode(true);
            return this.coverElement(tmp, parent);
        };
        Dom.showElement = function (handle, display) {
            if (display === void 0) { display = 'block'; }
            handle.style.display = display;
        };
        Dom.hideElement = function (handle) {
            handle.style.display = 'none';
        };
        Dom.exposeElement = function (handle) {
            handle.style.visibility = 'visible';
        };
        Dom.disguiseElement = function (handle) {
            handle.style.visibility = 'hidden';
        };
        Dom.centerElement = function (handle) {
            var style = handle.style;
            var x = Math.round(handle.offsetWidth / 2);
            var y = Math.round(handle.offsetHeight / 2);
            style.marginTop = '-' + x + 'px';
            style.marginLeft = '-' + y + 'px';
            style.left = '50%';
            style.top = '50%';
        };
        Dom.computePosition = function (handle, limiter) {
            var x = 0;
            var y = 0;
            while (handle.offsetParent) {
                x += handle.offsetLeft;
                y += handle.offsetTop;
                handle = handle.offsetParent;
                if (handle == limiter)
                    break;
            }
            return new Position(x, y);
        };
        return Dom;
    }());
    Core.Dom = Dom;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Event = (function () {
        function Event() {
        }
        Event.add = function (object, event, action, capturing) {
            if (capturing === void 0) { capturing = false; }
            throw new Error('This method is not supported.');
        };
        Event.remove = function (object, event, action, capturing) {
            if (capturing === void 0) { capturing = false; }
            throw new Error('This method is not supported.');
        };
        return Event;
    }());
    Core.Event = Event;
    if ('addEventListener' in window) {
        Event.add = function (object, event, action, capturing) {
            if (capturing === void 0) { capturing = false; }
            object.addEventListener(event, action, capturing);
            var removed = false;
            var result = function () {
                if (removed)
                    return;
                object.removeEventListener(event, action, capturing);
                removed = true;
            };
            return result;
        };
        Event.remove = function (object, event, action, capturing) {
            if (capturing === void 0) { capturing = false; }
            object.removeEventListener(event, action, capturing);
        };
    }
    else {
        if ('attachEvent' in window) {
            Event.add = function (object, event, action, capturing) {
                if (capturing === void 0) { capturing = false; }
                object.attachEvent('on' + event, action);
                var removed = false;
                var result = function () {
                    if (removed)
                        return;
                    object.detachEvent('on' + event, action);
                    removed = true;
                };
                return result;
            };
            Event.remove = function (object, event, action, capturing) {
                if (capturing === void 0) { capturing = false; }
                object.detachEvent('on' + event, action);
            };
        }
        else
            throw new Error('Events are not supported.');
    }
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Eventor = (function () {
        function Eventor() {
            this.actions = [];
        }
        Eventor.prototype.add = function (object, event, action, capturing) {
            if (capturing === void 0) { capturing = false; }
            this.actions.push(Core.Event.add(object, event, action, capturing));
        };
        Eventor.prototype.clear = function () {
            if (this.actions.length > 0) {
                for (var _i = 0, _a = this.actions; _i < _a.length; _i++) {
                    var entry = _a[_i];
                    entry();
                }
                this.actions = [];
            }
        };
        return Eventor;
    }());
    Core.Eventor = Eventor;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Incrementer = (function () {
        function Incrementer(counter) {
            if (counter === void 0) { counter = 0; }
            this.counter = counter;
        }
        Incrementer.prototype.generate = function () {
            return this.counter += 1;
        };
        return Incrementer;
    }());
    Core.Incrementer = Incrementer;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Interval = (function () {
        function Interval() {
            var _this = this;
            this.interval = null;
            this.handle = null;
            this.action = function () {
                _this.handle = window.setTimeout(_this.action, _this.interval);
                if (_this.onAction)
                    _this.onAction();
            };
        }
        Interval.prototype.start = function (interval, extortion) {
            if (interval === void 0) { interval = 1000; }
            if (extortion === void 0) { extortion = false; }
            if (extortion) {
                if (this.handle)
                    window.clearTimeout(this.handle);
            }
            else {
                if (this.handle)
                    return false;
            }
            this.handle = window.setTimeout(this.action, this.interval = interval);
            return true;
        };
        Interval.prototype.stop = function () {
            if (this.handle == null)
                return false;
            window.clearTimeout(this.handle);
            this.interval = null;
            this.handle = null;
            return true;
        };
        return Interval;
    }());
    Core.Interval = Interval;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Listener = (function () {
        function Listener() {
            this.events = {};
        }
        Listener.prototype.add = function (name, action) {
            var _this = this;
            var events = this.events[name];
            if (events == null)
                events = this.events[name] = [];
            events.push(action);
            var result = function () {
                if (action) {
                    events.remove(action);
                    if (events.length == 0)
                        delete _this.events[name];
                    action = null;
                }
            };
            return result;
        };
        Listener.prototype.remove = function (name, action) {
            var events = this.events[name];
            if (events) {
                events.remove(action);
                if (events.length == 0)
                    delete this.events[name];
            }
        };
        Listener.prototype.fire = function (name) {
            var parameters = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                parameters[_i - 1] = arguments[_i];
            }
            var events = this.events[name];
            if (events) {
                for (var _a = 0, events_1 = events; _a < events_1.length; _a++) {
                    var entry = events_1[_a];
                    entry.apply(this, parameters);
                }
                return true;
            }
            return false;
        };
        Listener.prototype.clear = function () {
            this.events = {};
        };
        return Listener;
    }());
    Core.Listener = Listener;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Loader = (function () {
        function Loader() {
        }
        Loader.write = function (path) {
            var date = new Date();
            document.write('<script type="text/javascript" src="' + path + '?time=' + date.getTime() + '" charset="utf-8"></' + 'script>');
        };
        return Loader;
    }());
    Core.Loader = Loader;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var ObjectUtils = (function () {
        function ObjectUtils() {
        }
        ObjectUtils.cloneObject = function (object) {
            if (object) {
                if (object.constructor == Array)
                    return object.clone();
                if (object.constructor == Date || object.constructor == RegExp || object.constructor == Function || object.constructor == String || object.constructor == Number || object.constructor == Boolean)
                    return object;
                var result = new Object();
                for (var el in object)
                    result[el] = this.cloneObject(object[el]);
                return result;
            }
            return null;
        };
        ObjectUtils.createPath = function (names) {
            var ob = window;
            for (var i = 0; i < names.length; ++i) {
                var name_2 = names[i];
                ob = ob[name_2] || (ob[name_2] = new Object());
            }
            return ob;
        };
        ObjectUtils.findHead = function (object) {
            for (var el in object)
                return el;
            return null;
        };
        ObjectUtils.findTail = function (object) {
            var result = null;
            for (var el in object)
                result = el;
            return result;
        };
        ObjectUtils.getHead = function (object) {
            var name = this.findHead(object);
            if (name)
                return object[name];
            return null;
        };
        ObjectUtils.getTail = function (object) {
            var name = this.getTail(object);
            if (name)
                return object[name];
            return null;
        };
        return ObjectUtils;
    }());
    Core.ObjectUtils = ObjectUtils;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Parser = (function () {
        function Parser() {
        }
        Parser.parseInteger = function (text) {
            if (text == null)
                return null;
            return parseInt(text);
        };
        Parser.parseFloat = function (text) {
            if (text == null)
                return null;
            return parseFloat(text);
        };
        Parser.parseSource = function (source) {
            var object = null;
            var result = eval('object = (' + source + ')');
            return object || result;
        };
        return Parser;
    }());
    Core.Parser = Parser;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Protector = (function () {
        function Protector() {
        }
        Protector.mediate = function (action) {
            var progress = true;
            var protect = function () {
                if (progress)
                    throw new Error('Commit logic can not be called outside event sequence.');
            };
            try {
                action(protect);
            }
            finally {
                progress = false;
            }
        };
        Protector.create = function (action) {
            var called = false;
            var result = function () {
                var parameters = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    parameters[_i] = arguments[_i];
                }
                if (called)
                    return;
                try {
                    action.apply(action, parameters);
                }
                finally {
                    called = false;
                }
            };
            return result;
        };
        return Protector;
    }());
    Core.Protector = Protector;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var ScrollerMode;
    (function (ScrollerMode) {
        ScrollerMode[ScrollerMode["Horizontal"] = 1] = "Horizontal";
        ScrollerMode[ScrollerMode["Vertical"] = 2] = "Vertical";
    })(ScrollerMode = Core.ScrollerMode || (Core.ScrollerMode = {}));
    var MouseScroller = (function () {
        function MouseScroller() {
            this.eventor = new Core.Eventor();
        }
        MouseScroller.prototype.addListener = function (element, mode, padding) {
            if (mode === void 0) { mode = ScrollerMode.Vertical | ScrollerMode.Horizontal; }
            if (padding === void 0) { padding = 0.0; }
            var actions = [];
            if (mode & ScrollerMode.Horizontal) {
                var tmp_1 = 2.0 * padding + 1.0;
                actions.push(function (e) {
                    if (element.scrollWidth > element.clientWidth) {
                        var ratio = (e.layerX - padding) / (element.clientWidth - tmp_1);
                        var range = element.scrollWidth - element.clientWidth;
                        element.scrollLeft = ratio * range;
                    }
                });
            }
            if (mode & ScrollerMode.Vertical) {
                var tmp_2 = 2.0 * padding + 1.0;
                actions.push(function (e) {
                    if (element.scrollHeight > element.clientHeight) {
                        var ratio = (e.layerY - padding) / (element.clientHeight - tmp_2);
                        var range = element.scrollHeight - element.clientHeight;
                        element.scrollTop = ratio * range;
                    }
                });
            }
            this.eventor.add(element, 'mousemove', function (e) {
                if (e.movementX == 0 && e.movementY == 0)
                    return;
                for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
                    var entry = actions_1[_i];
                    entry(e);
                }
            });
        };
        MouseScroller.prototype.clearListeners = function () {
            this.eventor.clear();
        };
        return MouseScroller;
    }());
    Core.MouseScroller = MouseScroller;
    var TouchScroller = (function () {
        function TouchScroller() {
            this.eventor = new Core.Eventor();
        }
        TouchScroller.prototype.addListener = function (element, mode) {
            if (mode === void 0) { mode = ScrollerMode.Vertical | ScrollerMode.Horizontal; }
            var offsetX = 0;
            var offsetY = 0;
            var aActions = [];
            var bActions = [];
            if (mode & ScrollerMode.Horizontal) {
                aActions.push(function (touch) {
                    offsetX = touch.clientX;
                });
                bActions.push(function (touch) {
                    element.scrollLeft -= touch.clientX - offsetX;
                    offsetX = touch.clientX;
                });
            }
            if (mode & ScrollerMode.Vertical) {
                aActions.push(function (touch) {
                    offsetY = touch.clientY;
                });
                bActions.push(function (touch) {
                    element.scrollTop -= touch.clientY - offsetY;
                    offsetY = touch.clientY;
                });
            }
            this.eventor.add(element, 'touchstart', function (e) {
                var touch = e.touches[0];
                for (var _i = 0, aActions_1 = aActions; _i < aActions_1.length; _i++) {
                    var entry = aActions_1[_i];
                    entry(touch);
                }
            });
            this.eventor.add(element, 'touchmove', function (e) {
                var touch = e.touches[0];
                for (var _i = 0, bActions_1 = bActions; _i < bActions_1.length; _i++) {
                    var entry = bActions_1[_i];
                    entry(touch);
                }
            });
        };
        TouchScroller.prototype.clearListeners = function () {
            this.eventor.clear();
        };
        return TouchScroller;
    }());
    Core.TouchScroller = TouchScroller;
    var DirectedScroller = (function () {
        function DirectedScroller(interrupt) {
            if (interrupt === void 0) { interrupt = 10; }
            var _this = this;
            this.interrupt = interrupt;
            this.destroyed = false;
            this.handles = [];
            this.hAction = null;
            this.vAction = null;
            this.interval = new Core.Interval();
            this.interval.onAction = function () {
                var counter = 0;
                if (_this.hAction) {
                    if (_this.hAction())
                        counter += 1;
                    else
                        _this.hAction = null;
                }
                if (_this.vAction) {
                    if (_this.vAction())
                        counter += 1;
                    else
                        _this.vAction = null;
                }
                if (counter == 0)
                    _this.interval.stop();
                console.log('----- interval: counter=' + counter);
            };
        }
        DirectedScroller.prototype.addWorkspace = function (handle) {
            if (this.destroyed)
                throw new Error('Scroller has been destroyed.');
            this.handles.push(handle);
        };
        DirectedScroller.prototype.startScrolling = function (mode, velocity) {
            var _this = this;
            if (this.destroyed)
                throw new Error('Scroller has been destroyed.');
            var counter = 0;
            if (velocity > 0) {
                if (mode & ScrollerMode.Horizontal) {
                    this.hAction = function () {
                        var counter = 0;
                        for (var _i = 0, _a = _this.handles; _i < _a.length; _i++) {
                            var entry = _a[_i];
                            var limit = entry.scrollWidth - entry.clientWidth;
                            if (entry.scrollLeft < limit) {
                                entry.scrollLeft += velocity;
                                counter += 1;
                            }
                        }
                        return counter > 0;
                    };
                    counter += 1;
                }
                if (mode & ScrollerMode.Vertical) {
                    this.hAction = function () {
                        var counter = 0;
                        for (var _i = 0, _a = _this.handles; _i < _a.length; _i++) {
                            var entry = _a[_i];
                            var limit = entry.scrollHeight - entry.clientHeight;
                            if (entry.scrollTop < limit) {
                                entry.scrollTop += velocity;
                                counter += 1;
                            }
                        }
                        return counter > 0;
                    };
                    counter += 1;
                }
            }
            else {
                if (velocity == 0)
                    throw new Error('Incorrect velocity value.');
                if (mode & ScrollerMode.Horizontal) {
                    this.hAction = function () {
                        var counter = 0;
                        for (var _i = 0, _a = _this.handles; _i < _a.length; _i++) {
                            var entry = _a[_i];
                            if (entry.scrollLeft > 0) {
                                entry.scrollLeft += velocity;
                                counter += 1;
                            }
                        }
                        return counter > 0;
                    };
                    counter += 1;
                }
                if (mode & ScrollerMode.Vertical) {
                    this.hAction = function () {
                        var counter = 0;
                        for (var _i = 0, _a = _this.handles; _i < _a.length; _i++) {
                            var entry = _a[_i];
                            if (entry.scrollTop > 0) {
                                entry.scrollTop += velocity;
                                counter += 1;
                            }
                        }
                        return counter > 0;
                    };
                    counter += 1;
                }
            }
            if (counter > 0)
                this.interval.start(this.interrupt);
        };
        DirectedScroller.prototype.stopScrolling = function (mode) {
            if (this.destroyed)
                throw new Error('Scroller has been destroyed.');
            var counter = 0;
            if (mode) {
                if (this.hAction && (mode & ScrollerMode.Horizontal)) {
                    this.hAction = null;
                    counter += 1;
                }
                if (this.vAction && (mode & ScrollerMode.Vertical)) {
                    this.vAction = null;
                    counter += 1;
                }
            }
            else {
                if (this.hAction) {
                    this.hAction = null;
                    counter += 1;
                }
                if (this.vAction) {
                    this.vAction = null;
                    counter += 1;
                }
            }
            if (counter > 0)
                this.interval.stop();
        };
        DirectedScroller.prototype.destroy = function () {
            if (this.destroyed)
                throw new Error('Scroller has been destroyed.');
            this.interval.stop();
            this.destroyed = true;
        };
        return DirectedScroller;
    }());
    Core.DirectedScroller = DirectedScroller;
    var ExtendedDirectedScroller = (function () {
        function ExtendedDirectedScroller(interrupt) {
            if (interrupt === void 0) { interrupt = 10; }
            this.destroyed = false;
            this.eventor = new Core.Eventor();
            this.scroller = new DirectedScroller(interrupt);
        }
        ExtendedDirectedScroller.prototype.addWorkspace = function (handle) {
            this.scroller.addWorkspace(handle);
        };
        ExtendedDirectedScroller.prototype.addStarter = function (element, event, mode, velocity) {
            var _this = this;
            if (this.destroyed)
                throw new Error('Scroller has been destroyed.');
            this.eventor.add(element, event, function () {
                _this.scroller.startScrolling(mode, velocity);
            });
        };
        ExtendedDirectedScroller.prototype.addStopper = function (element, event, mode) {
            var _this = this;
            if (this.destroyed)
                throw new Error('Scroller has been destroyed.');
            this.eventor.add(element, event, function () {
                _this.scroller.stopScrolling(mode);
            });
        };
        ExtendedDirectedScroller.prototype.suspend = function () {
            this.scroller.stopScrolling();
        };
        ExtendedDirectedScroller.prototype.destroy = function () {
            if (this.destroyed)
                throw new Error('Scroller has been destroyed.');
            this.eventor.clear();
            this.scroller.destroy();
            this.destroyed = true;
        };
        return ExtendedDirectedScroller;
    }());
    Core.ExtendedDirectedScroller = ExtendedDirectedScroller;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Stopwatch = (function () {
        function Stopwatch() {
            this.handle = null;
        }
        Stopwatch.prototype.start = function (limit, interval) {
            var _this = this;
            if (interval === void 0) { interval = 1000; }
            if (this.handle == null) {
                var time_1 = 0;
                var action = function () {
                    if (time_1 < limit) {
                        time_1 += 1;
                        if (_this.onInterval)
                            _this.onInterval(time_1);
                    }
                    else {
                        window.clearInterval(_this.handle);
                        _this.handle = null;
                        if (_this.onFinished)
                            _this.onFinished(time_1);
                    }
                };
                this.handle = window.setInterval(action, interval);
                return true;
            }
            return false;
        };
        Stopwatch.prototype.stop = function () {
            if (this.handle == null)
                return false;
            window.clearInterval(this.handle);
            this.handle = null;
            return true;
        };
        return Stopwatch;
    }());
    Core.Stopwatch = Stopwatch;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Style = (function () {
        function Style() {
        }
        Style.get = function (handle, name) {
            throw new Error('This method is not supported.');
        };
        Style.getWidth = function (handle) {
            throw new Error('This method is not supported.');
        };
        Style.getHeight = function (handle) {
            throw new Error('This method is not supported.');
        };
        return Style;
    }());
    Core.Style = Style;
    if ('getComputedStyle' in window) {
        Style.get = function (handle, name) {
            var collection = window.getComputedStyle(handle, null);
            if (collection == null)
                throw new Error('Indicated element has not computed styles.');
            return collection.getPropertyValue(name);
        };
        Style.getWidth = function (handle) {
            var collection = window.getComputedStyle(handle, null);
            if (collection == null)
                throw new Error('Indicated element has not computed styles.');
            return Core.Parser.parseInteger(collection.width);
        };
        Style.getHeight = function (handle) {
            var collection = window.getComputedStyle(handle, null);
            if (collection == null)
                throw new Error('Indicated element has not computed styles.');
            return Core.Parser.parseInteger(collection.height);
        };
    }
    else {
        if ('currentStyle' in Element.prototype) {
            Style.get = function (handle, name) {
                var parts = name.match(/\w[^-]*/g);
                if (parts.length > 0) {
                    var param = parts[0];
                    for (var i = 1; i < parts.length; ++i) {
                        var part = parts[i];
                        param += part[0].toUpperCase() + part.substr(1);
                    }
                    return handle.currentStyle[param];
                }
                throw new Error('Indicated element has not computed styles.');
            };
            Style.getWidth = function (handle) {
                return Core.Parser.parseInteger(handle.currentStyle.width);
            };
            Style.getHeight = function (handle) {
                return Core.Parser.parseInteger(handle.currentStyle.height);
            };
        }
        else
            throw new Error('Computed styles are not supported.');
    }
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Styling = (function () {
        function Styling(handle) {
            this.list = handle.classList;
        }
        Styling.prototype.set = function (condition, style) {
            var action = condition ? this.list.add : this.list.remove;
            action.call(this.list, style);
        };
        Styling.prototype.add = function (style) {
            this.list.add(style);
        };
        Styling.prototype.remove = function (style) {
            this.list.remove(style);
        };
        return Styling;
    }());
    Core.Styling = Styling;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Time = (function () {
        function Time() {
        }
        Time.getMilliseconds = function () {
            var date = new Date();
            return date.getTime();
        };
        return Time;
    }());
    Core.Time = Time;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Timeout = (function () {
        function Timeout() {
            var _this = this;
            this.timeout = null;
            this.handle = null;
            this.action = function () {
                if (_this.onAction)
                    _this.onAction();
            };
        }
        Timeout.prototype.start = function (timeout, extortion) {
            if (timeout === void 0) { timeout = 1000; }
            if (extortion === void 0) { extortion = false; }
            if (extortion) {
                if (this.handle)
                    window.clearTimeout(this.handle);
            }
            else {
                if (this.handle)
                    return false;
            }
            this.handle = window.setTimeout(this.action, this.timeout = timeout);
            return true;
        };
        Timeout.prototype.stop = function () {
            if (this.handle == null)
                return false;
            window.clearTimeout(this.handle);
            this.timeout = null;
            this.handle = null;
            return true;
        };
        return Timeout;
    }());
    Core.Timeout = Timeout;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Updater = (function () {
        function Updater(time) {
            this.time = time;
        }
        Updater.prototype.checkDate = function (date) {
            if (date == null)
                return true;
            if (date.getTime() == this.time.getTime())
                return false;
            return true;
        };
        Updater.prototype.reload = function () {
            if (Core.Cookies.check()) {
                var date = Core.Cookies.getDate('last_update_time');
                if (this.checkDate(date)) {
                    var expiration = Core.Cookies.calculateDays(30);
                    Core.Cookies.setDate('last_update_time', this.time, expiration);
                    location.reload(true);
                    return true;
                }
            }
            return false;
        };
        Updater.prepare = function (date) {
            var updater = new Updater(date);
            updater.reload();
        };
        return Updater;
    }());
    Core.Updater = Updater;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var InjectionName;
        (function (InjectionName) {
            InjectionName["Organizer"] = "ORGANIZER";
            InjectionName["Parent"] = "PARENT";
            InjectionName["Loops"] = "LOOPS";
            InjectionName["Controllers"] = "CONTROLLERS";
            InjectionName["Compositions"] = "COMPOSITIONS";
        })(InjectionName = Organizer.InjectionName || (Organizer.InjectionName = {}));
        var InjectionSurrogate = (function () {
            function InjectionSurrogate(service, item, selector, variable) {
                this.service = service;
                this.item = item;
                this.selector = selector;
                this.variable = variable;
            }
            return InjectionSurrogate;
        }());
        Organizer.InjectionSurrogate = InjectionSurrogate;
        var SubscriptionSurrogate = (function () {
            function SubscriptionSurrogate(service, event, target, key) {
                this.service = service;
                this.event = event;
                this.target = target;
                this.key = key;
            }
            return SubscriptionSurrogate;
        }());
        Organizer.SubscriptionSurrogate = SubscriptionSurrogate;
        var ContainerSurrogate = (function () {
            function ContainerSurrogate(name, type, instance) {
                this.name = name;
                this.type = type;
                this.instance = instance;
            }
            return ContainerSurrogate;
        }());
        Organizer.ContainerSurrogate = ContainerSurrogate;
        function injection(service, item, selector) {
            if (service == null)
                throw new Error('@injection service name is not defined.');
            return function (target, key) {
                var injections = target.constructor.INJECTIONS;
                if (injections == null)
                    injections = target.constructor.INJECTIONS = [];
                injections.push(new InjectionSurrogate(service, item, selector, key));
            };
        }
        Organizer.injection = injection;
        function subscription(service, event) {
            if (service == null)
                throw new Error('@subscription service name is not defined.');
            if (event == null)
                throw new Error('@subscription event name is not defined.');
            return function (target, key) {
                var subscriptions = target.constructor.SUBSCRIPTIONS;
                if (subscriptions == null)
                    subscriptions = target.constructor.SUBSCRIPTIONS = [];
                subscriptions.push(new SubscriptionSurrogate(service, event, target, key));
            };
        }
        Organizer.subscription = subscription;
        var Transitor = (function () {
            function Transitor(organizer, master, debug) {
                if (debug === void 0) { debug = false; }
                this.organizer = organizer;
                this.master = master;
                this.debug = debug;
                this.services = [];
                this.factories = [];
                this.buffer = [];
                this.events = [];
            }
            Transitor.prototype.applyInjections = function (cache, container) {
                var injections = Transitor.detectInjections(container.type);
                if (injections) {
                    var instance = container.instance;
                    for (var _i = 0, injections_1 = injections; _i < injections_1.length; _i++) {
                        var entry = injections_1[_i];
                        if (entry.variable in instance)
                            throw new Error('Injection: Variable "' + entry.variable + '" already exist in service "' + container.name + ' (type: ' + container.type['name'] + ')" in organizer "' + this.organizer.getName() + '".');
                        var service_1 = cache[entry.service];
                        if (service_1 == null) {
                            service_1 = this.master.get(entry.service, true);
                            if (service_1 == null)
                                throw new Error('Injection: Service "' + entry.service + '" does not exist for service "' + container.name + ' (type: ' + container.type['name'] + ')" in organizer "' + this.organizer.getName() + '" (factories require specific adding order to be visible for other factories).');
                            cache[entry.service] = service_1;
                        }
                        if (entry.item)
                            throw new Error('Injection item can be used only with "' + InjectionName.Loops + '", "' + InjectionName.Controllers + '" or "' + InjectionName.Compositions + '" service injection in controllers.');
                        instance[entry.variable] = service_1;
                    }
                }
            };
            Transitor.prototype.applySubscriptions = function (cache, container) {
                var subscriptions = Transitor.detectSubscriptions(container.type);
                if (subscriptions) {
                    var instance = container.instance;
                    for (var _i = 0, subscriptions_1 = subscriptions; _i < subscriptions_1.length; _i++) {
                        var entry = subscriptions_1[_i];
                        var action = instance[entry.key];
                        if (action == null)
                            throw new Error('Subscription: Method "' + entry.key + '" does not exist in service "' + container.name + ' (type: ' + container.type['name'] + ')" in organizer "' + this.organizer.getName() + '".');
                        var service_2 = cache[entry.service];
                        if (service_2 == null) {
                            service_2 = this.master.get(entry.service, true);
                            if (service_2 == null)
                                throw new Error('Subscription: Service "' + entry.service + '" does not exist for service "' + container.name + ' (type: ' + container.type['name'] + ')" in organizer "' + this.organizer.getName() + '" (factories require specific adding order to be visible for other factories).');
                            cache[entry.service] = service_2;
                        }
                        var cast = service_2;
                        if (cast.addListener) {
                            var proxy = action.bind(instance);
                            this.events.push(cast.addListener(entry.event, proxy));
                        }
                        else
                            throw new Error('Subscription: Service "' + entry.service + '" has not addListener method (organizer "' + this.organizer.getName() + '").');
                    }
                }
            };
            Transitor.detectInjections = function (type) {
                while (type) {
                    var injections = type.INJECTIONS;
                    if (injections)
                        return injections;
                    type = type.prototype;
                }
                return null;
            };
            Transitor.detectSubscriptions = function (type) {
                while (type) {
                    var subscriptions = type.SUBSCRIPTIONS;
                    if (subscriptions)
                        return subscriptions;
                    type = type.prototype;
                }
                return null;
            };
            Transitor.prototype.addService = function (name, service) {
                var instance = new service(this.organizer);
                var container = new ContainerSurrogate(name, service, instance);
                this.services.push(container);
            };
            Transitor.prototype.addFactory = function (name, factory) {
                var instance = new factory(this.organizer);
                var container = new ContainerSurrogate(name, factory, instance);
                this.factories.push(container);
            };
            Transitor.prototype.construct = function () {
                var cache = {};
                if (this.services.length > 0) {
                    for (var _i = 0, _a = this.services; _i < _a.length; _i++) {
                        var entry = _a[_i];
                        if (this.master.has(entry.name))
                            throw new Error('Service "' + entry.name + '" already exists in organizer "' + this.organizer.getName() + '".');
                        this.master.add(entry.name, entry.instance);
                    }
                    for (var _b = 0, _c = this.services; _b < _c.length; _b++) {
                        var entry = _c[_b];
                        this.applyInjections(cache, entry);
                    }
                    for (var _d = 0, _e = this.services; _d < _e.length; _d++) {
                        var entry = _e[_d];
                        this.applySubscriptions(cache, entry);
                    }
                    for (var _f = 0, _g = this.services; _f < _g.length; _f++) {
                        var entry = _g[_f];
                        var instance = entry.instance;
                        if (instance.onCreate)
                            instance.onCreate();
                        this.buffer.push(instance);
                    }
                    this.services = [];
                }
                if (this.factories.length > 0) {
                    for (var _h = 0, _j = this.factories; _h < _j.length; _h++) {
                        var entry = _j[_h];
                        if (this.master.has(entry.name))
                            throw new Error('Service "' + entry.name + '" already exists in organizer "' + this.organizer.getName() + '".');
                        this.applyInjections(cache, entry);
                        this.applySubscriptions(cache, entry);
                        var instance = entry.instance;
                        if (instance.onCreate)
                            instance.onCreate();
                        this.master.add(entry.name, instance.get());
                        this.buffer.push(instance);
                    }
                    this.factories = [];
                }
            };
            Transitor.prototype.release = function () {
                if (this.events.length > 0) {
                    for (var _i = 0, _a = this.events; _i < _a.length; _i++) {
                        var entry = _a[_i];
                        entry();
                    }
                    this.events = [];
                }
                if (this.buffer.length > 0) {
                    for (var _b = 0, _c = this.buffer; _b < _c.length; _b++) {
                        var entry = _c[_b];
                        var instance = entry;
                        if (instance.onDestroy)
                            instance.onDestroy();
                    }
                    this.buffer = [];
                }
            };
            return Transitor;
        }());
        Organizer.Transitor = Transitor;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Template;
    (function (Template) {
        var Preprocessor = (function () {
            function Preprocessor() {
            }
            Preprocessor.compile = function (template, variables) {
                var action = function (text, name) {
                    var sign = '';
                    if (text[0] == '\\') {
                        if (text[1] != '\\')
                            return '{{' + name + '}}';
                        sign = '\\';
                    }
                    return sign + variables[name];
                };
                return template.replace(this.VARIABLE_PATTERN, action);
            };
            Preprocessor.VARIABLE_PATTERN = /\\?\\?{{([a-zA-Z0-9_$]+)}}/gi;
            return Preprocessor;
        }());
        Template.Preprocessor = Preprocessor;
    })(Template = Core.Template || (Core.Template = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Template;
    (function (Template_1) {
        function compile(s, n, condition_e063ad521acf34f20039ee0301472c59) {
            var scope = s;
            var node = n;
            try {
                var object_e063ad521acf34f20039ee0301472c59 = null;
                var result_e063ad521acf34f20039ee0301472c59 = eval('object_e063ad521acf34f20039ee0301472c59 = function( e ) { var event = e; return (' + condition_e063ad521acf34f20039ee0301472c59 + '); }');
                return object_e063ad521acf34f20039ee0301472c59 || result_e063ad521acf34f20039ee0301472c59;
            }
            catch (ex) {
                throw new Error('Condition \'' + condition_e063ad521acf34f20039ee0301472c59 + '\' syntax error.');
            }
        }
        var Template = (function () {
            function Template() {
            }
            Template.prepareHandle = function (element, scope, debug) {
                if (debug === void 0) { debug = false; }
                var value = element.getAttribute('var-handle');
                if (value) {
                    if (debug == false)
                        element.removeAttribute('var-handle');
                    if (value == 'handle')
                        throw new Error('Handle \'handle\' is reserved.');
                    if (value in scope)
                        throw new Error('Handle \'' + value + '\' has been duplicated.');
                    scope[value] = element;
                }
            };
            Template.prepareEvent = function (element, part, scope, debug) {
                if (debug === void 0) { debug = false; }
                var match = part.match(this.REGEX);
                if (match == null)
                    throw new Error('Incorrect var-events attribute (attribute: ' + part + ').');
                var name = match[1];
                var condition = match[2];
                var method = match[3];
                var action = scope[method];
                if (action instanceof Function) {
                    if (condition) {
                        var logic_1 = compile(scope, element, condition);
                        var proxy = function (event) {
                            if (logic_1(event))
                                action.call(scope, event);
                        };
                        Core.Event.add(element, name, proxy, false);
                    }
                    else {
                        var proxy = action.bind(scope);
                        Core.Event.add(element, name, proxy, false);
                    }
                }
                else
                    throw new Error('Indicated method \'' + method + '\' does not exist for event \'on' + name + '\' in scope.');
            };
            Template.prepareEvents = function (element, scope, debug) {
                if (debug === void 0) { debug = false; }
                var value = element.getAttribute('var-events');
                if (value) {
                    if (debug == false)
                        element.removeAttribute('var-events');
                    var parts = value.split(',');
                    for (var _i = 0, parts_2 = parts; _i < parts_2.length; _i++) {
                        var entry = parts_2[_i];
                        this.prepareEvent(element, entry, scope, debug);
                    }
                }
            };
            Template.expose = function (element, scope, handled, debug) {
                if (handled === void 0) { handled = true; }
                if (debug === void 0) { debug = false; }
                this.prepareHandle(element, scope, debug);
                this.prepareEvents(element, scope, debug);
                if (handled)
                    scope.handle = element;
                {
                    var hElements = element.querySelectorAll('[var-handle]');
                    for (var _i = 0, _a = hElements; _i < _a.length; _i++) {
                        var entry = _a[_i];
                        this.prepareHandle(entry, scope, debug);
                    }
                }
                {
                    var hElements = element.querySelectorAll('[var-events]');
                    for (var _b = 0, _c = hElements; _b < _c.length; _b++) {
                        var entry = _c[_b];
                        this.prepareEvents(entry, scope, debug);
                    }
                }
            };
            Template.compile = function (template, scope, parent, handled, debug) {
                if (handled === void 0) { handled = true; }
                if (debug === void 0) { debug = false; }
                var element = Template_1.Html.parse(template, parent);
                this.expose(element, scope, handled, debug);
                return element;
            };
            Template.mount = function (template, scope, parent, placeholder, handled, debug) {
                if (handled === void 0) { handled = true; }
                if (debug === void 0) { debug = false; }
                var handle = this.compile(template, scope, parent, handled, debug);
                handle.mount(placeholder);
                return handle;
            };
            Template.REGEX = /^\s*(\w+)\s*(?:\((.+)\))?\s*:\s*(\w+)\s*$/;
            return Template;
        }());
        Template_1.Template = Template;
    })(Template = Core.Template || (Core.Template = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var Template = Core.Template.Template;
        var Backbone = (function () {
            function Backbone(templates, organizer, services, bridges, resources, debug) {
                if (debug === void 0) { debug = false; }
                this.templates = templates;
                this.organizer = organizer;
                this.services = services;
                this.bridges = bridges;
                this.resources = resources;
                this.debug = debug;
            }
            Backbone.getHandle = function (node) {
                if (node.scope.handle)
                    return node.scope.handle;
                else {
                    var controllers = node.scope.controllers;
                    for (var el in controllers) {
                        var controller_1 = controllers[el];
                        return controller_1.scope.handle;
                    }
                }
            };
            Backbone.getController = function (patterns) {
                var name = null;
                var pattern = null;
                for (var el in patterns) {
                    if (pattern)
                        throw new Error('Root controller is duplicated (name: "' + pattern.name + '", type: "' + pattern.type + '") - allowed is only one controller.');
                    pattern = patterns[name = el];
                }
                if (pattern == null)
                    throw new Error('Root controller does not exist.');
                return new Organizer.ControllerEntity(name, pattern);
            };
            Backbone.hasPattern = function (patterns) {
                for (var el in patterns)
                    return true;
                return false;
            };
            Backbone.prototype.constructLogic = function (pattern, resource, parent, index, data) {
                var type = resource.controller;
                var handle = Core.Dom.cloneElement(pattern.handle);
                var instance = new type(this.organizer);
                Template.expose(handle, instance, true, this.debug);
                if (this.debug)
                    Core.Event.add(handle, '[CONTROLLER]', instance.constructor, false);
                var controllers = this.prepareControllers(pattern.controllers, instance, handle);
                var loops = this.prepareLoops(pattern.loops, instance, handle);
                var compositions = this.prepareCompositions(pattern.compositions, instance, handle);
                var cleaners = [];
                var injections = Organizer.Transitor.detectInjections(type);
                var subscriptions = Organizer.Transitor.detectSubscriptions(type);
                var cache = {};
                if (injections) {
                    for (var _i = 0, injections_2 = injections; _i < injections_2.length; _i++) {
                        var entry_1 = injections_2[_i];
                        if (entry_1.variable in instance)
                            throw new Error('Injection: Variable "' + entry_1.variable + '" already exist in controller "' + type['name'] + '" in organizer "' + this.organizer.getName() + '".');
                        if (entry_1.service == Organizer.InjectionName.Loops) {
                            if (entry_1.selector)
                                throw new Error('Injection: Selector can be used only with "' + Organizer.InjectionName.Compositions + '" service injection (organizer "' + this.organizer.getName() + '" -> controller "' + type['name'] + '").');
                            var collection = new Organizer.LoopCollection(loops, this.organizer);
                            if (entry_1.item)
                                instance[entry_1.variable] = collection.getLoop(entry_1.item);
                            else
                                instance[entry_1.variable] = collection;
                            continue;
                        }
                        if (entry_1.service == Organizer.InjectionName.Controllers) {
                            if (entry_1.selector)
                                throw new Error('Injection: Selector can be used only with "' + Organizer.InjectionName.Compositions + '" service injection (organizer "' + this.organizer.getName() + '" -> controller "' + type['name'] + '").');
                            var collection = new Organizer.ControllerCollection(controllers, this.organizer);
                            if (entry_1.item)
                                instance[entry_1.variable] = collection.getController(entry_1.item);
                            else
                                instance[entry_1.variable] = collection;
                            continue;
                        }
                        if (entry_1.service == Organizer.InjectionName.Compositions) {
                            var collection = new Organizer.CompositionCollection(compositions, this.organizer, this.bridges);
                            if (entry_1.item) {
                                var selector = entry_1.selector;
                                if (selector) {
                                    if (selector instanceof Function) {
                                        var item = selector(collection.getComposition(entry_1.item));
                                        if (item == null)
                                            throw new Error('Injection: Selector result is null (organizer "' + this.organizer.getName() + '" -> controller "' + type['name'] + '" -> service "' + entry_1.service + '" -> item "' + entry_1.item + '").');
                                        instance[entry_1.variable] = item;
                                    }
                                    else
                                        throw new Error('Injection: Selector is not function (organizer "' + this.organizer.getName() + '" -> controller "' + type['name'] + '" -> service "' + entry_1.service + '" -> item "' + entry_1.item + '").');
                                }
                                else
                                    instance[entry_1.variable] = collection.getComposition(entry_1.item);
                            }
                            else
                                instance[entry_1.variable] = collection;
                            continue;
                        }
                        if (entry_1.item)
                            throw new Error('Injection: Item can be used only with "' + Organizer.InjectionName.Loops + '", "' + Organizer.InjectionName.Controllers + '" or "' + Organizer.InjectionName.Compositions + '" service injection (organizer "' + this.organizer.getName() + '" -> controller "' + type['name'] + '" -> service "' + entry_1.service + '").');
                        if (entry_1.selector)
                            throw new Error('Injection: Selector can be used only with "' + Organizer.InjectionName.Compositions + '" service injection (organizer "' + this.organizer.getName() + '" -> controller "' + type['name'] + '" -> service "' + entry_1.service + '").');
                        if (entry_1.service == Organizer.InjectionName.Organizer) {
                            instance[entry_1.variable] = this.organizer;
                            continue;
                        }
                        if (entry_1.service == Organizer.InjectionName.Parent) {
                            if (parent == null)
                                throw new Error('Injection: Parent controller (injection "' + Organizer.InjectionName.Parent + '") does not exist for controller "' + type['name'] + '" in organizer "' + this.organizer.getName() + '".');
                            instance[entry_1.variable] = parent;
                            continue;
                        }
                        var service_3 = cache[entry_1.service];
                        if (service_3 == null) {
                            service_3 = this.services.get(entry_1.service, true);
                            if (service_3 == null)
                                throw new Error('Injection: Service "' + entry_1.service + '" does not exist for controller "' + type['name'] + '" in organizer "' + this.organizer.getName() + '".');
                            cache[entry_1.service] = service_3;
                        }
                        instance[entry_1.variable] = service_3;
                    }
                }
                if (subscriptions) {
                    for (var _a = 0, subscriptions_2 = subscriptions; _a < subscriptions_2.length; _a++) {
                        var entry_2 = subscriptions_2[_a];
                        var action = instance[entry_2.key];
                        if (action == null)
                            throw new Error('Subscription: Method "' + entry_2.key + '" does not exist in controller "' + type['name'] + ' " in organizer "' + this.organizer.getName() + '".');
                        var service_4 = cache[entry_2.service];
                        if (service_4 == null) {
                            service_4 = this.services.get(entry_2.service, true);
                            if (service_4 == null)
                                throw new Error('Subscription: Service "' + entry_2.service + '" does not exist for controller "' + type['name'] + '" in organizer "' + this.organizer.getName() + '".');
                            cache[entry_2.service] = service_4;
                        }
                        var cast = service_4;
                        if (cast.addListener) {
                            var proxy = action.bind(instance);
                            cleaners.push(cast.addListener(entry_2.event, proxy));
                        }
                        else
                            throw new Error('Subscription: Service "' + entry_2.service + '" has not addListener method (organizer "' + this.organizer.getName() + '").');
                    }
                }
                if (instance.onCreate)
                    instance.onCreate(index, data);
                var scope = new Organizer.ControllerScope(handle, instance, cleaners, controllers, loops, compositions);
                var entry = new Organizer.ControllerEntry(handle, instance, scope);
                return new Organizer.ControllerNode(entry, scope);
            };
            Backbone.prototype.constructBridge = function (bridge, parent) {
                var composition = bridge.compose(parent);
                return composition.composition;
            };
            Backbone.prototype.constructController = function (pattern, resource, parent, index, data) {
                if (resource == null) {
                    resource = this.resources.get(pattern.type, true);
                    if (resource == null)
                        throw new Error('Controller "' + pattern.type + '" does not exist in organizer "' + this.organizer.getName() + '".');
                }
                return this.constructLogic(pattern, resource, parent, index, data);
            };
            Backbone.prototype.mountController = function (pattern, parent, placeholder) {
                var instance = this.constructController(pattern, null, parent);
                placeholder.mount(instance.scope.handle, pattern);
                return instance;
            };
            Backbone.prototype.mountControllers = function (patterns, parent, placeholder) {
                var instances = {};
                for (var el in patterns)
                    instances[el] = this.mountController(patterns[el], parent, placeholder);
                return instances;
            };
            Backbone.prototype.prepareControllers = function (patterns, parent, hMaster) {
                var placeholder = new Organizer.SinglePlaceholder(hMaster);
                return this.mountControllers(patterns, parent, placeholder);
            };
            Backbone.prototype.constructLoop = function (pattern, parent, hMaster) {
                var functions = pattern.functions;
                var array = null;
                var map = null;
                var items = [];
                if (functions.length > 0) {
                    for (var _i = 0, functions_1 = functions; _i < functions_1.length; _i++) {
                        var entry_3 = functions_1[_i];
                        switch (entry_3.name) {
                            case 'array':
                                items.push(array = new Organizer.IndexedCollection());
                                break;
                            case 'object':
                                {
                                    var parameters = entry_3.parameters;
                                    if (parameters.length == 1) {
                                        var parameter = parameters[0];
                                        items.push(map = new Organizer.MappedCollection(parameter.split('.')));
                                    }
                                    else
                                        items.push(map = new Organizer.MappedCollection());
                                }
                                break;
                            default:
                                throw new Error('Loop "' + pattern.name + '" supports only "array" and "object(path.to.id)" parameter (organizer: "' + this.organizer.getName() + '").');
                        }
                    }
                }
                else
                    items.push(array = new Organizer.IndexedCollection());
                var backbone = this;
                var collection = new Organizer.ComposedCollection(items);
                var placeholder = new Organizer.MultiPlaceholder(hMaster, pattern);
                var resource = this.resources.get(pattern.logic, true);
                var scope = new Organizer.LoopScope(collection);
                var entry = new Organizer.LoopEntry(pattern, resource, parent, this.organizer, backbone, this.services, array, map, collection, placeholder, scope);
                return new Organizer.LoopNode(entry, scope);
            };
            Backbone.prototype.constructLoops = function (patterns, parent, hMaster) {
                var instances = {};
                for (var el in patterns)
                    instances[el] = this.constructLoop(patterns[el], parent, hMaster);
                return instances;
            };
            Backbone.prototype.prepareLoops = function (patterns, parent, hMaster) {
                return this.constructLoops(patterns, parent, hMaster);
            };
            Backbone.prototype.constructComposition = function (pattern, parent) {
                if (pattern.handle) {
                    var handle = Core.Dom.cloneElement(pattern.handle);
                    var controllers = this.prepareControllers(pattern.controllers, parent, handle);
                    var loops = this.prepareLoops(pattern.loops, parent, handle);
                    var compositions = this.prepareCompositions(pattern.compositions, parent, handle);
                    var scope = new Organizer.CompositionScope(handle, controllers, loops, compositions);
                    var entry = new Organizer.CompositionEntry(handle, scope);
                    return new Organizer.CompositionNode(entry, scope);
                }
                else {
                    var self_1 = Backbone;
                    if (self_1.hasPattern(pattern.loops))
                        throw new Error('Loop cannot be root element (organizer "' + this.organizer.getName() + '").');
                    if (self_1.hasPattern(pattern.compositions))
                        throw new Error('Composition cannot be root element (organizer "' + this.organizer.getName() + '").');
                    var entity = self_1.getController(pattern.controllers);
                    var controller_2 = this.constructController(entity.pattern, null, parent);
                    var controllers = {};
                    var loops = {};
                    var compositions = {};
                    controllers[entity.name] = controller_2;
                    var scope = new Organizer.CompositionScope(null, controllers, loops, compositions);
                    var entry = new Organizer.CompositionEntry(null, scope);
                    return new Organizer.CompositionNode(entry, scope);
                }
            };
            Backbone.prototype.mountComposition = function (pattern, parent, placeholder) {
                var composition;
                {
                    var template = this.templates[pattern.template];
                    if (template == null) {
                        var bridge = this.bridges.get(pattern.template, true);
                        if (bridge == null)
                            throw new Error('Template "' + pattern.template + '" does not exist in organizer "' + this.organizer.getName() + '".');
                        composition = this.constructBridge(bridge, parent);
                    }
                    else
                        composition = this.constructComposition(template, parent);
                }
                var handle = Backbone.getHandle(composition);
                placeholder.mount(handle, pattern);
                return composition;
            };
            Backbone.prototype.mountCompositions = function (patterns, parent, placeholder) {
                var instances = {};
                for (var el in patterns)
                    instances[el] = this.mountComposition(patterns[el], parent, placeholder);
                return instances;
            };
            Backbone.prototype.prepareCompositions = function (patterns, parent, hMaster) {
                var placeholder = new Organizer.SinglePlaceholder(hMaster);
                return this.mountCompositions(patterns, parent, placeholder);
            };
            return Backbone;
        }());
        Organizer.Backbone = Backbone;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var InstanceMode;
        (function (InstanceMode) {
            InstanceMode[InstanceMode["Singleton"] = 0] = "Singleton";
            InstanceMode[InstanceMode["Transient"] = 1] = "Transient";
        })(InstanceMode = Organizer.InstanceMode || (Organizer.InstanceMode = {}));
        var OrganizerSurrogate = (function () {
            function OrganizerSurrogate(name, template, master, type) {
                this.name = name;
                this.template = template;
                this.master = master;
                this.type = type;
            }
            return OrganizerSurrogate;
        }());
        var ServiceSurrogate = (function () {
            function ServiceSurrogate(name, type) {
                this.name = name;
                this.type = type;
            }
            return ServiceSurrogate;
        }());
        var ControllerSurrogate = (function () {
            function ControllerSurrogate(name, type) {
                this.name = name;
                this.type = type;
            }
            return ControllerSurrogate;
        }());
        var ScopeSurrogate = (function () {
            function ScopeSurrogate(path, organizer, services, controllers, scopes) {
                this.path = path;
                this.organizer = organizer;
                this.services = services;
                this.controllers = controllers;
                this.scopes = scopes;
            }
            return ScopeSurrogate;
        }());
        function organizer(name, template, master) {
            if (master === void 0) { master = false; }
            if (name == null)
                throw new Error('@organizer name is not defined.');
            return function (target) {
                var organizer = target.ORGANISER;
                if (organizer)
                    throw new Error('Organiser decorator is duplicated (organiser "' + name + '").');
                target.ORGANISER = new OrganizerSurrogate(name, template, master, target);
            };
        }
        Organizer.organizer = organizer;
        function service(name) {
            if (name == null)
                throw new Error('@service name is not defined.');
            return function (target) {
                var services = target.SERVICES;
                if (services == null)
                    services = target.SERVICES = [];
                services.push(new ServiceSurrogate(name, target));
            };
        }
        Organizer.service = service;
        function controller(name) {
            if (name == null)
                throw new Error('@controller name is not defined.');
            return function (target) {
                var controllers = target.CONTROLLERS;
                if (controllers == null)
                    controllers = target.CONTROLLERS = [];
                controllers.push(new ControllerSurrogate(name, target));
            };
        }
        Organizer.controller = controller;
        var Entity = (function () {
            function Entity(path, organizer, bridge, master) {
                this.path = path;
                this.organizer = organizer;
                this.bridge = bridge;
                this.master = master;
            }
            Entity.prototype.getPath = function () {
                return this.path;
            };
            Entity.prototype.getOrganizer = function () {
                return this.organizer;
            };
            Entity.prototype.getBridge = function () {
                return this.bridge;
            };
            Entity.prototype.getMaster = function () {
                return this.master;
            };
            return Entity;
        }());
        Organizer.Entity = Entity;
        var Bootstrap = (function () {
            function Bootstrap() {
            }
            Bootstrap.analyze = function (namespace, path) {
                var completed = false;
                var services = [];
                var controllers = [];
                var scopes = [];
                var scope = new ScopeSurrogate(path, null, services, controllers, scopes);
                if (path)
                    path = path + '.';
                for (var el in namespace) {
                    var entry = namespace[el];
                    if (entry.__Ignore__)
                        continue;
                    if (entry.constructor == Function) {
                        var o = entry.ORGANISER;
                        if (o) {
                            if (scope.organizer)
                                throw new Error('Surrogate organiser class "' + o.name + '" is duplicated in namespace (is allowed only one organiser per namespace).');
                            scope.organizer = o;
                            completed = true;
                            continue;
                        }
                        var s = entry.SERVICES;
                        if (s) {
                            for (var _i = 0, s_1 = s; _i < s_1.length; _i++) {
                                var entry_4 = s_1[_i];
                                services.push(entry_4);
                            }
                            completed = true;
                            continue;
                        }
                        var c = entry.CONTROLLERS;
                        if (c) {
                            for (var _a = 0, c_1 = c; _a < c_1.length; _a++) {
                                var entry_5 = c_1[_a];
                                controllers.push(entry_5);
                            }
                            completed = true;
                            continue;
                        }
                        continue;
                    }
                    if (entry.constructor == Object) {
                        var s = this.analyze(entry, path + el);
                        if (s) {
                            scopes.push(s);
                            completed = true;
                        }
                        continue;
                    }
                }
                return completed ? scope : null;
            };
            Bootstrap.construct = function (scope, master) {
                var surrogate = scope.organizer;
                if (surrogate) {
                    var organizer_1 = new Organizer.Organizer(surrogate.name, master);
                    for (var _i = 0, _a = scope.services; _i < _a.length; _i++) {
                        var entry = _a[_i];
                        organizer_1.addService(entry.name, entry.type);
                    }
                    for (var _b = 0, _c = scope.controllers; _b < _c.length; _b++) {
                        var entry = _c[_b];
                        organizer_1.addController(entry.name, entry.type);
                    }
                    var instance = new surrogate.type();
                    if (instance.complement)
                        instance.complement(organizer_1);
                    var result = null;
                    for (var _d = 0, _e = scope.scopes; _d < _e.length; _d++) {
                        var entry = _e[_d];
                        var entity = this.construct(entry, organizer_1);
                        if (entity) {
                            var bridge = entity.getBridge();
                            if (bridge) {
                                var surrogate_1 = entry.organizer;
                                if (entity.getMaster()) {
                                    if (result)
                                        throw new Error('In scope "' + scope.path + '" appears many times master sub-scopes (master=true flag in @organizer "' + result.getPath() + '" and "' + entity.getPath() + '").');
                                    var path = entity.getPath();
                                    result = new Entity(path, organizer_1, bridge, surrogate_1.master);
                                }
                                else
                                    organizer_1.addBridge(surrogate_1.name, bridge);
                            }
                        }
                    }
                    if (surrogate.template) {
                        if (result)
                            throw new Error('In ' + (scope.path ? 'scope "' + scope.path + '"' : 'master-scope') + ' and in sub-scope "' + result.getPath() + '" are defined master templates (master=true flag in sub-scope @organizer).');
                        var bridge = organizer_1.compileTemplate(surrogate.template);
                        return new Entity(scope.path, organizer_1, bridge, surrogate.master);
                    }
                    else {
                        if (result)
                            return result;
                        if (surrogate.master)
                            throw new Error('Scope "' + scope.path + '" can not be set as master templates if has not sub-scope template (master=true flag in some sub-scope @organizer).');
                        return new Entity(scope.path, organizer_1, null, false);
                    }
                }
                else {
                    for (var _f = 0, _g = scope.services; _f < _g.length; _f++) {
                        var entry = _g[_f];
                        master.addService(entry.name, entry.type);
                    }
                    for (var _h = 0, _j = scope.controllers; _h < _j.length; _h++) {
                        var entry = _j[_h];
                        master.addController(entry.name, entry.type);
                    }
                    var result = null;
                    for (var _k = 0, _l = scope.scopes; _k < _l.length; _k++) {
                        var entry = _l[_k];
                        var entity = this.construct(entry, master);
                        if (entity) {
                            var bridge = entity.getBridge();
                            if (bridge) {
                                if (entity.getMaster()) {
                                    if (result)
                                        throw new Error('In scope "' + scope.path + '" appears many times master sub-scopes (master=true flag in @organizer "' + result.getPath() + '" and "' + entity.getPath() + '").');
                                    var path = entity.getPath();
                                    result = new Entity(path, master, bridge, true);
                                }
                                else
                                    master.addBridge(entry.organizer.name, bridge);
                            }
                        }
                    }
                    return result;
                }
            };
            Bootstrap.run = function (namespace, master) {
                if (namespace == null)
                    throw new Error('Indicated namespace does not exist.');
                var scope = this.analyze(namespace, '');
                if (scope.organizer == null)
                    throw new Error('Surrogate organiser class is not defined inside ' + (scope.path ? 'namespace "' + scope.path + '"' : 'root namespace') + '.');
                return this.construct(scope, master);
            };
            return Bootstrap;
        }());
        Organizer.Bootstrap = Bootstrap;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var Bridge = (function () {
            function Bridge(root, compositor, callback) {
                this.root = root;
                this.compositor = compositor;
                this.callback = callback;
            }
            Bridge.prototype.compose = function (parent) {
                this.callback();
                return this.compositor.compose(this.root, parent);
            };
            return Bridge;
        }());
        Organizer.Bridge = Bridge;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var Changer = (function () {
            function Changer(parent, container, compositions) {
                this.parent = parent;
                this.container = container;
                this.compositions = compositions;
                this.destroyed = false;
                this.instances = {};
                this.name = null;
                this.cache = null;
                this.started = false;
            }
            Changer.prototype.composeTemplate = function (name) {
                if (this.destroyed)
                    throw new Error('Manager has been destroyed.');
                if (name in this.instances)
                    throw new Error('Composition "' + name + '" has been composed.');
                this.instances[name] = this.compositions.composeTemplate(name, this.parent);
            };
            Changer.prototype.switchComposition = function (name, data) {
                if (this.destroyed)
                    throw new Error('Manager has been destroyed.');
                if (this.name == name)
                    return;
                if (this.cache) {
                    this.name = null;
                    this.cache.stop();
                    this.cache.remove();
                }
                this.cache = this.instances[name];
                if (this.cache == null)
                    this.cache = this.instances[name] = this.compositions.composeTemplate(name, this.parent);
                this.name = name;
                if (data) {
                    var controller_3 = this.cache.getController();
                    if (controller_3.onBind)
                        controller_3.onBind(data);
                }
                this.cache.mount(this.container);
                if (this.started)
                    this.cache.start();
            };
            Changer.prototype.startComposition = function () {
                if (this.destroyed)
                    throw new Error('Manager has been destroyed.');
                if (this.cache)
                    this.cache.start();
                this.started = true;
            };
            Changer.prototype.stopComposition = function () {
                if (this.destroyed)
                    throw new Error('Manager has been destroyed.');
                if (this.cache)
                    this.cache.stop();
                this.started = false;
            };
            Changer.prototype.destroy = function () {
                if (this.destroyed)
                    return;
                for (var el in this.instances) {
                    var entry = this.instances[el];
                    entry.destroy();
                }
                this.destroyed = true;
            };
            return Changer;
        }());
        Organizer.Changer = Changer;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var IndexedCollection = (function () {
            function IndexedCollection() {
                this.array = [];
            }
            IndexedCollection.prototype.getSize = function () {
                return this.array.length;
            };
            IndexedCollection.prototype.getItem = function (index) {
                return this.array[index];
            };
            IndexedCollection.prototype.addItem = function (item) {
                this.array.push(item);
            };
            IndexedCollection.prototype.insertItem = function (index, item) {
                this.array.splice(index, 0, item);
            };
            IndexedCollection.prototype.removeItem = function (index) {
                var result = this.array.splice(index, 1);
                if (result.length > 0)
                    return result[0];
                return null;
            };
            IndexedCollection.prototype.dropItem = function (item) {
                var index = this.array.indexOf(item);
                if (index == -1)
                    return;
                this.array.splice(index, 1);
            };
            IndexedCollection.prototype.clearItems = function () {
                if (this.array.length > 0) {
                    this.array = [];
                    return true;
                }
                return false;
            };
            IndexedCollection.prototype.iterateItems = function (action) {
                for (var i = 0; i < this.array.length; ++i) {
                    if (!action(i, this.array[i]))
                        break;
                }
            };
            return IndexedCollection;
        }());
        Organizer.IndexedCollection = IndexedCollection;
        var MappedCollection = (function () {
            function MappedCollection(path) {
                if (path === void 0) { path = []; }
                this.path = path;
                this.map = {};
                this.size = 0;
            }
            MappedCollection.prototype.extractKey = function (object) {
                var result = object;
                for (var _i = 0, _a = this.path; _i < _a.length; _i++) {
                    var entry = _a[_i];
                    if ((entry in result) == false)
                        throw new Error('Indicated object path (' + this.path.join('.') + ') does not exist.');
                    result = result[entry];
                }
                return result;
            };
            MappedCollection.prototype.getSize = function () {
                return this.size;
            };
            MappedCollection.prototype.getItem = function (key) {
                return this.map[key];
            };
            MappedCollection.prototype.addItem = function (item) {
                var key = this.extractKey(item.entry.getData());
                if (key in this.map)
                    throw new Error('Map key "' + key + '" is duplicated.');
                this.map[key] = item;
                this.size += 1;
            };
            MappedCollection.prototype.removeItem = function (key) {
                var result = this.map[key];
                if (delete this.map[key])
                    this.size -= 1;
                return result;
            };
            MappedCollection.prototype.dropItem = function (item) {
                var key = this.extractKey(item.entry.getData());
                if (key) {
                    if (delete this.map[key])
                        this.size -= 1;
                }
            };
            MappedCollection.prototype.clearItems = function () {
                if (this.size > 0) {
                    this.map = {};
                    this.size = 0;
                    return true;
                }
                return false;
            };
            MappedCollection.prototype.iterateItems = function (action) {
                var i = -1;
                for (var name_3 in this.map) {
                    if (!action(++i, this.map[name_3]))
                        break;
                }
            };
            return MappedCollection;
        }());
        Organizer.MappedCollection = MappedCollection;
        var ComposedCollection = (function () {
            function ComposedCollection(collections) {
                this.collections = collections;
                this.master = null;
                if (collections.length > 0)
                    this.master = collections[0];
            }
            ComposedCollection.prototype.getSize = function () {
                if (this.master)
                    return this.master.getSize();
                return 0;
            };
            ComposedCollection.prototype.addItem = function (item) {
                for (var _i = 0, _a = this.collections; _i < _a.length; _i++) {
                    var entry = _a[_i];
                    entry.addItem(item);
                }
            };
            ComposedCollection.prototype.clearItems = function () {
                if (this.master) {
                    var size = this.master.getSize();
                    for (var _i = 0, _a = this.collections; _i < _a.length; _i++) {
                        var entry = _a[_i];
                        entry.clearItems();
                    }
                    return size > 0;
                }
                return false;
            };
            ComposedCollection.prototype.iterateItems = function (action) {
                if (this.master)
                    this.master.iterateItems(action);
            };
            return ComposedCollection;
        }());
        Organizer.ComposedCollection = ComposedCollection;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var LoopEntry = (function () {
            function LoopEntry(pattern, resource, parent, organizer, backbone, services, array, map, collection, placeholder, scope) {
                this.pattern = pattern;
                this.resource = resource;
                this.parent = parent;
                this.organizer = organizer;
                this.backbone = backbone;
                this.services = services;
                this.array = array;
                this.map = map;
                this.collection = collection;
                this.placeholder = placeholder;
                this.scope = scope;
            }
            LoopEntry.prototype.getPlaceholder = function (index) {
                var placeholder = this.array.getItem(index);
                return placeholder.scope.handle;
            };
            LoopEntry.prototype.createItem = function (index, data, type, tag) {
                var resource;
                if (this.resource) {
                    if (type)
                        throw new Error('Controller logic has been duplicated in loop "' + this.pattern.name + '" (organizer "' + this.organizer.getName() + '").');
                    resource = this.resource;
                }
                else {
                    if (type == null)
                        throw new Error('Controller logic is not defined in loop "' + this.pattern.name + '" (organizer "' + this.organizer.getName() + '").');
                    resource = new Organizer.Resource(type, this.services);
                }
                var logic = this.backbone.constructLogic(this.pattern, resource, this.parent, index, data);
                var tmp = logic.scope;
                var scope = new Organizer.ItemScope(tmp.handle, tmp.instance, tmp.subscriptions, tmp.controllers, tmp.loops, tmp.compositions);
                var entry = new Organizer.ItemEntry(tmp.handle, data, tmp.instance, tag, scope);
                return new Organizer.ItemNode(entry, scope);
            };
            LoopEntry.prototype.getSize = function () {
                if (this.scope.destroyed)
                    throw new Error('Loop has been destroyed.');
                return this.collection.getSize();
            };
            LoopEntry.prototype.getIndex = function (index) {
                if (this.scope.destroyed)
                    throw new Error('Loop has been destroyed.');
                if (this.array == null)
                    throw new Error('Indexed items are not supported in loop "' + this.pattern.name + '" (organizer "' + this.organizer.getName() + '").');
                var item = this.array.getItem(index);
                if (item)
                    return item.entry;
                return null;
            };
            LoopEntry.prototype.getKey = function (key) {
                if (this.scope.destroyed)
                    throw new Error('Loop has been destroyed.');
                if (this.map == null)
                    throw new Error('Mapped items are not supported in loop "' + this.pattern.name + '" (organizer "' + this.organizer.getName() + '").');
                var item = this.map.getItem(key);
                if (item)
                    return item.entry;
                return null;
            };
            LoopEntry.prototype.iterateItems = function (iteration) {
                if (this.scope.destroyed)
                    throw new Error('Loop has been destroyed.');
                this.collection.iterateItems(function (index, item) {
                    var entry = item.entry;
                    return iteration(index, entry.getData(), entry.getController(), entry.getTag());
                });
            };
            LoopEntry.prototype.addItem = function (data, type, tag) {
                if (this.scope.destroyed)
                    throw new Error('Loop has been destroyed.');
                var size = this.collection.getSize();
                var item = this.createItem(size, data, type, tag);
                var scope = item.scope;
                this.collection.addItem(item);
                this.placeholder.mount(scope.handle);
                if (this.scope.working)
                    item.start();
                return new Organizer.ItemInstanceEntry(scope.handle, scope.instance, scope);
            };
            LoopEntry.prototype.addItems = function (data, type) {
                if (this.scope.destroyed)
                    throw new Error('Loop has been destroyed.');
                for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                    var entry = data_1[_i];
                    this.addItem(entry, type);
                }
            };
            LoopEntry.prototype.insertItem = function (index, data, type, tag) {
                if (this.scope.destroyed)
                    throw new Error('Loop has been destroyed.');
                if (this.array == null)
                    throw new Error('Indexed items are not supported in loop "' + this.pattern.name + '" (organizer "' + this.organizer.getName() + '").');
                var size = this.collection.getSize();
                if (index > size || size == 0)
                    return this.addItem(data, type, tag);
                else {
                    var item = this.createItem(index, data, type, tag);
                    var placeholder = this.getPlaceholder(index);
                    this.array.insertItem(index, item);
                    if (this.map)
                        this.map.addItem(item);
                    var scope = item.scope;
                    this.placeholder.mount(scope.handle, placeholder);
                    if (this.scope.working)
                        item.start();
                    return new Organizer.ItemInstanceEntry(scope.handle, scope.instance, scope);
                }
            };
            LoopEntry.prototype.insertItems = function (index, data, type) {
                if (this.scope.destroyed)
                    throw new Error('Loop has been destroyed.');
                for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                    var entry = data_2[_i];
                    this.insertItem(index++, entry, type);
                }
            };
            LoopEntry.prototype.bindItems = function (data, type) {
                this.cleanItems();
                this.addItems(data, type);
            };
            LoopEntry.prototype.cleanItems = function () {
                if (this.scope.destroyed)
                    throw new Error('Loop has been destroyed.');
                this.collection.iterateItems(function (index, item) {
                    item.stop();
                    item.destroy();
                    return true;
                });
                return this.collection.clearItems();
            };
            LoopEntry.prototype.removeKey = function (id) {
                if (this.scope.destroyed)
                    throw new Error('Loop has been destroyed.');
                if (this.map == null)
                    throw new Error('Mapped items are not supported in loop "' + this.pattern.name + '" (organizer "' + this.organizer.getName() + '").');
                var item = this.map.removeItem(id);
                if (item) {
                    if (this.array)
                        this.array.dropItem(item);
                    item.stop();
                    item.destroy();
                    var entry = item.entry;
                    return new Organizer.ItemInformationEntry(entry.data, entry.tag, entry.scope);
                }
                return null;
            };
            LoopEntry.prototype.removeIndex = function (index) {
                if (this.scope.destroyed)
                    throw new Error('Loop has been destroyed.');
                if (this.array == null)
                    throw new Error('Indexed items are not supported in loop "' + this.pattern.name + '" (organizer "' + this.organizer.getName() + '").');
                var item = this.array.removeItem(index);
                if (item) {
                    if (this.map)
                        this.map.dropItem(item);
                    item.stop();
                    item.destroy();
                    var entry = item.entry;
                    return new Organizer.ItemInformationEntry(entry.data, entry.tag, entry.scope);
                }
                return null;
            };
            return LoopEntry;
        }());
        Organizer.LoopEntry = LoopEntry;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var Composition = (function () {
            function Composition(composition) {
                this.composition = composition;
                this.handle = Organizer.Backbone.getHandle(composition);
                this.entry = composition.entry;
                this.scope = composition.scope;
            }
            Composition.prototype.getHandle = function () {
                if (this.scope.destroyed)
                    throw new Error('Composition has been destroyed.');
                return this.handle;
            };
            Composition.prototype.getController = function (name) {
                return this.entry.getController(name);
            };
            Composition.prototype.getLoop = function (name) {
                return this.entry.getLoop(name);
            };
            Composition.prototype.mount = function (hParent, hBefore) {
                if (this.scope.destroyed)
                    throw new Error('Composition has been destroyed.');
                hParent.insertBefore(this.handle, hBefore);
            };
            Composition.prototype.replace = function (hElement) {
                if (this.scope.destroyed)
                    throw new Error('Composition has been destroyed.');
                var hParent = hElement.parentNode;
                if (hParent == null)
                    throw new Error('Indicated element has not parent.');
                hParent.insertBefore(this.handle, hElement);
                hParent.removeChild(hElement);
            };
            Composition.prototype.remove = function () {
                if (this.scope.destroyed)
                    throw new Error('Composition has been destroyed.');
                Core.Dom.removeNode(this.handle);
            };
            Composition.prototype.start = function () {
                if (this.scope.destroyed)
                    throw new Error('Composition has been destroyed.');
                this.scope.start();
            };
            Composition.prototype.stop = function () {
                if (this.scope.destroyed)
                    throw new Error('Composition has been destroyed.');
                this.scope.stop();
            };
            Composition.prototype.destroy = function () {
                this.composition.destroy();
            };
            return Composition;
        }());
        Organizer.Composition = Composition;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var CompositionCollection = (function () {
            function CompositionCollection(compositions, organizer, bridges) {
                this.compositions = compositions;
                this.organizer = organizer;
                this.bridges = bridges;
            }
            CompositionCollection.prototype.getComposition = function (name) {
                var composition = this.compositions[name];
                if (composition == null)
                    throw new Error('Composition "' + name + '" does not exist in organizer "' + this.organizer.getName() + '".');
                return composition.entry;
            };
            CompositionCollection.prototype.composeTemplate = function (name, parent) {
                var bridge = this.bridges.get(name, true);
                if (bridge == null)
                    throw new Error('Template "' + name + '" does not exist in organizer "' + this.organizer.getName() + '".');
                return bridge.compose(parent);
            };
            return CompositionCollection;
        }());
        Organizer.CompositionCollection = CompositionCollection;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var CompositionEntry = (function () {
            function CompositionEntry(handle, scope) {
                this.handle = handle;
                this.scope = scope;
            }
            CompositionEntry.prototype.getController = function (name) {
                if (this.scope.destroyed)
                    throw new Error('Composition has been destroyed.');
                var controllers = this.scope.controllers;
                if (name) {
                    var controller_4 = controllers[name];
                    if (controller_4 == null)
                        throw new Error('Controller "' + name + '" does not exist.');
                    return controller_4.scope.instance;
                }
                else {
                    for (var el in controllers) {
                        var controller_5 = controllers[el];
                        return controller_5.scope.instance;
                    }
                    throw new Error('Default controller does not exist.');
                }
            };
            CompositionEntry.prototype.getLoop = function (name) {
                if (this.scope.destroyed)
                    throw new Error('Composition has been destroyed.');
                var loops = this.scope.loops;
                if (name) {
                    var loop = loops[name];
                    if (loop == null)
                        throw new Error('Loop "' + name + '" does not exist.');
                    return loop.entry;
                }
                else {
                    for (var el in loops) {
                        var loop = loops[el];
                        return loop.entry;
                    }
                    throw new Error('Default loop does not exist.');
                }
            };
            return CompositionEntry;
        }());
        Organizer.CompositionEntry = CompositionEntry;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var CompositionNode = (function () {
            function CompositionNode(entry, scope) {
                this.entry = entry;
                this.scope = scope;
            }
            CompositionNode.prototype.start = function () {
                this.scope.start();
            };
            CompositionNode.prototype.stop = function () {
                this.scope.stop();
            };
            CompositionNode.prototype.destroy = function () {
                this.scope.destroy();
            };
            return CompositionNode;
        }());
        Organizer.CompositionNode = CompositionNode;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var CompositionScope = (function () {
            function CompositionScope(handle, controllers, loops, compositions) {
                this.handle = handle;
                this.controllers = controllers;
                this.loops = loops;
                this.compositions = compositions;
                this.destroyed = false;
                this.working = false;
            }
            CompositionScope.prototype.startControllers = function () {
                for (var el in this.controllers)
                    this.controllers[el].start();
            };
            CompositionScope.prototype.startLoops = function () {
                for (var el in this.loops)
                    this.loops[el].start();
            };
            CompositionScope.prototype.startCompositions = function () {
                for (var el in this.compositions)
                    this.compositions[el].start();
            };
            CompositionScope.prototype.stopControllers = function () {
                for (var el in this.controllers)
                    this.controllers[el].stop();
            };
            CompositionScope.prototype.stopLoops = function () {
                for (var el in this.loops)
                    this.loops[el].stop();
            };
            CompositionScope.prototype.stopCompositions = function () {
                for (var el in this.compositions)
                    this.compositions[el].stop();
            };
            CompositionScope.prototype.destroyControllers = function () {
                for (var el in this.controllers)
                    this.controllers[el].destroy();
            };
            CompositionScope.prototype.destroyLoops = function () {
                for (var el in this.loops)
                    this.loops[el].destroy();
            };
            CompositionScope.prototype.destroyCompositions = function () {
                for (var el in this.compositions)
                    this.compositions[el].destroy();
            };
            CompositionScope.prototype.start = function () {
                if (this.destroyed)
                    return;
                if (this.working == false) {
                    this.startControllers();
                    this.startLoops();
                    this.startCompositions();
                    this.working = true;
                }
            };
            CompositionScope.prototype.stop = function () {
                if (this.destroyed)
                    return;
                if (this.working == true) {
                    this.stopControllers();
                    this.stopLoops();
                    this.stopCompositions();
                    this.working = false;
                }
            };
            CompositionScope.prototype.destroy = function () {
                if (this.destroyed)
                    return;
                if (this.handle)
                    Core.Dom.removeNode(this.handle);
                this.destroyControllers();
                this.destroyLoops();
                this.destroyCompositions();
                this.destroyed = true;
            };
            return CompositionScope;
        }());
        Organizer.CompositionScope = CompositionScope;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var ControllerEntity = (function () {
            function ControllerEntity(name, pattern) {
                this.name = name;
                this.pattern = pattern;
            }
            return ControllerEntity;
        }());
        Organizer.ControllerEntity = ControllerEntity;
        var Compositor = (function () {
            function Compositor(organizer, services, bridges, resources, debug) {
                if (debug === void 0) { debug = false; }
                this.organizer = organizer;
                this.services = services;
                this.bridges = bridges;
                this.resources = resources;
                this.debug = debug;
            }
            Compositor.prototype.compose = function (root, parent) {
                var backbone = new Organizer.Backbone(root.templates, this.organizer, this.services, this.bridges, this.resources, this.debug);
                var composition = backbone.constructComposition(root, parent);
                return new Organizer.Composition(composition);
            };
            return Compositor;
        }());
        Organizer.Compositor = Compositor;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var ControllerCollection = (function () {
            function ControllerCollection(controllers, organizer) {
                this.controllers = controllers;
                this.organizer = organizer;
            }
            ControllerCollection.prototype.getController = function (name) {
                var controller = this.controllers[name];
                if (controller == null)
                    throw new Error('Controller "' + name + '" does not exist in organizer "' + this.organizer.getName() + '".');
                return controller.scope.instance;
            };
            return ControllerCollection;
        }());
        Organizer.ControllerCollection = ControllerCollection;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var ControllerEntry = (function () {
            function ControllerEntry(handle, instance, scope) {
                this.handle = handle;
                this.instance = instance;
                this.scope = scope;
            }
            return ControllerEntry;
        }());
        Organizer.ControllerEntry = ControllerEntry;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var ControllerNode = (function () {
            function ControllerNode(entry, scope) {
                this.entry = entry;
                this.scope = scope;
            }
            ControllerNode.prototype.start = function () {
                this.scope.start();
            };
            ControllerNode.prototype.stop = function () {
                this.scope.stop();
            };
            ControllerNode.prototype.destroy = function () {
                this.scope.destroy();
            };
            return ControllerNode;
        }());
        Organizer.ControllerNode = ControllerNode;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var ControllerScope = (function () {
            function ControllerScope(handle, instance, subscriptions, controllers, loops, compositions) {
                this.handle = handle;
                this.instance = instance;
                this.subscriptions = subscriptions;
                this.controllers = controllers;
                this.loops = loops;
                this.compositions = compositions;
                this.destroyed = false;
                this.working = false;
            }
            ControllerScope.prototype.startControllers = function () {
                for (var el in this.controllers)
                    this.controllers[el].start();
            };
            ControllerScope.prototype.startLoops = function () {
                for (var el in this.loops)
                    this.loops[el].start();
            };
            ControllerScope.prototype.startCompositions = function () {
                for (var el in this.compositions)
                    this.compositions[el].start();
            };
            ControllerScope.prototype.startInstance = function () {
                if (this.instance.onStart)
                    this.instance.onStart();
            };
            ControllerScope.prototype.stopControllers = function () {
                for (var el in this.controllers)
                    this.controllers[el].stop();
            };
            ControllerScope.prototype.stopLoops = function () {
                for (var el in this.loops)
                    this.loops[el].stop();
            };
            ControllerScope.prototype.stopCompositions = function () {
                for (var el in this.compositions)
                    this.compositions[el].stop();
            };
            ControllerScope.prototype.stopInstance = function () {
                if (this.instance.onStop)
                    this.instance.onStop();
            };
            ControllerScope.prototype.destroySubscriptions = function () {
                for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
                    var entry = _a[_i];
                    entry();
                }
            };
            ControllerScope.prototype.destroyControllers = function () {
                for (var el in this.controllers)
                    this.controllers[el].destroy();
            };
            ControllerScope.prototype.destroyLoops = function () {
                for (var el in this.loops)
                    this.loops[el].destroy();
            };
            ControllerScope.prototype.destroyCompositions = function () {
                for (var el in this.compositions)
                    this.compositions[el].destroy();
            };
            ControllerScope.prototype.destroyInstance = function () {
                if (this.instance.onDestroy)
                    this.instance.onDestroy();
            };
            ControllerScope.prototype.start = function () {
                if (this.destroyed)
                    return;
                if (this.working == false) {
                    this.startControllers();
                    this.startLoops();
                    this.startCompositions();
                    this.startInstance();
                    this.working = true;
                }
            };
            ControllerScope.prototype.stop = function () {
                if (this.destroyed)
                    return;
                if (this.working == true) {
                    this.stopControllers();
                    this.stopLoops();
                    this.stopCompositions();
                    this.stopInstance();
                    this.working = false;
                }
            };
            ControllerScope.prototype.destroy = function () {
                if (this.destroyed)
                    return;
                Core.Dom.removeNode(this.handle);
                this.destroySubscriptions();
                this.destroyControllers();
                this.destroyLoops();
                this.destroyCompositions();
                this.destroyInstance();
                this.destroyed = true;
            };
            return ControllerScope;
        }());
        Organizer.ControllerScope = ControllerScope;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Template;
    (function (Template) {
        var Html = (function () {
            function Html() {
            }
            Html.detect = function (template) {
                var matches = template.match(Html.REGEX);
                if (matches == null || matches.length < 2)
                    throw new Error('Incorrect template format.');
                switch (matches[1]) {
                    case 'tr': return 'tbody';
                    case 'td': return 'tr';
                }
                return 'div';
            };
            Html.inject = function (tag, template, parent) {
                var handle = Core.Dom.createElement(tag, parent);
                handle.innerHTML = template;
                return handle;
            };
            Html.cover = function (template, parent) {
                var tag = this.detect(template);
                return this.inject(tag, template, parent);
            };
            Html.extract = function (template, parent) {
                var children = template.children;
                if (children.length != 1)
                    throw new Error('Expected one internal root element.');
                var root = template.removeChild(children[0]);
                return Core.Dom.coverElement(root, parent);
            };
            Html.parse = function (template, parent) {
                var root = this.cover(template, parent);
                return this.extract(root, parent);
            };
            Html.REGEX = /^\s*<([a-zA-Z]+)/;
            return Html;
        }());
        Template.Html = Html;
    })(Template = Core.Template || (Core.Template = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var Html = Core.Template.Html;
        var Preprocessor = Core.Template.Preprocessor;
        var Decompositor = (function () {
            function Decompositor(debug) {
                if (debug === void 0) { debug = false; }
                this.debug = debug;
            }
            Decompositor.prototype.findMaster = function (hRoot, hScopes) {
                if (hRoot == hScopes[0])
                    return null;
                return hRoot;
            };
            Decompositor.prototype.findParent = function (hElement, root) {
                while (true) {
                    var hParent = hElement.parentNode;
                    if (hParent == null)
                        return root;
                    if (hParent.$scope)
                        return hParent.$scope;
                    hElement = hParent;
                }
            };
            Decompositor.prototype.createPlaceholder = function (hScope) {
                var hParent = hScope.parentNode;
                if (hParent) {
                    var id = 'handle:' + ((Decompositor.counter++) + Math.random());
                    var hScript = Core.Dom.createElement('script', hParent);
                    hScript.setAttribute('type', 'text/placeholder');
                    hScript.setAttribute('id', id);
                    hScript.mount(hScope);
                    return id;
                }
                return null;
            };
            Decompositor.prototype.collectScope = function (hScope, root) {
                var template = hScope.getAttribute('var-template');
                if (template) {
                    if (hScope.hasAttribute('var-repeat'))
                        throw new Error('Template "' + template + '" root element cannot be a loop ("var-repeat" attribute).');
                    if (hScope.hasAttribute('var-controller'))
                        throw new Error('Template "' + template + '" root element cannot be a controller ("var-controller" attribute).');
                    if (hScope.hasAttribute('var-mount'))
                        throw new Error('Template "' + template + '" root element cannot be a composition ("var-mount" attribute).');
                    var name_4 = Organizer.Interpolator.extractName(template);
                    if (this.debug == false)
                        hScope.removeAttribute('var-template');
                    if (name_4 in root.templates)
                        throw new Error('Template name "' + name_4 + '" is duplicated.');
                    root.templates[name_4] = hScope.$scope = new Organizer.TemplatePattern(hScope);
                    return;
                }
                var loop = hScope.getAttribute('var-repeat');
                var controller = hScope.getAttribute('var-controller');
                if (loop) {
                    var parameter = Organizer.Interpolator.parseParameter(loop);
                    if (this.debug == false)
                        hScope.removeAttribute('var-repeat');
                    if (hScope.hasAttribute('var-mount'))
                        throw new Error('Loop "' + parameter.name + '" cannot be a composition ("var-mount" attribute).');
                    if (controller) {
                        var parent_1 = this.findParent(hScope, root);
                        var identifier = this.createPlaceholder(hScope);
                        if (parameter.name in parent_1.loops)
                            throw new Error('Loop name "' + parameter.name + '" is duplicated inside scope.');
                        var logic = Organizer.Interpolator.extractName(controller);
                        if (this.debug == false)
                            hScope.removeAttribute('var-controller');
                        parent_1.loops[parameter.name] = hScope.$scope = new Organizer.LoopPattern(parent_1, hScope, identifier, parameter.name, parameter.methods, logic);
                    }
                    else
                        throw new Error('Loop "' + parameter.name + '" has no controller.');
                    return;
                }
                if (controller) {
                    var variable = Organizer.Interpolator.parseVariable(controller);
                    if (this.debug == false)
                        hScope.removeAttribute('var-controller');
                    if (hScope.hasAttribute('var-mount'))
                        throw new Error('Controller "' + variable.type + '" cannot be a composition ("var-mount" attribute).');
                    var parent_2 = this.findParent(hScope, root);
                    var identifier = this.createPlaceholder(hScope);
                    if (variable.name in parent_2.controllers)
                        throw new Error('Controller name "' + variable.name + '" is duplicated inside scope.');
                    parent_2.controllers[variable.name] = hScope.$scope = new Organizer.ControllerPattern(parent_2, hScope, identifier, variable.name, variable.type);
                    return;
                }
                var composition = hScope.getAttribute('var-mount');
                if (composition) {
                    var variable = Organizer.Interpolator.parseVariable(composition);
                    if (this.debug == false)
                        hScope.removeAttribute('var-mount');
                    var parent_3 = this.findParent(hScope, root);
                    var identifier = this.createPlaceholder(hScope);
                    if (variable.name in parent_3.compositions)
                        throw new Error('Composition name "' + variable.name + '" is duplicated inside scope.');
                    parent_3.compositions[variable.name] = hScope.$scope = new Organizer.CompositionPattern(parent_3, identifier, variable.name, variable.type);
                    return;
                }
            };
            Decompositor.prototype.releaseScope = function (hScope) {
                var hParent = hScope.parentNode;
                if (hParent)
                    hParent.removeChild(hScope);
                delete hScope.$scope;
            };
            Decompositor.prototype.decompose = function (template, variables) {
                if (variables)
                    template = Preprocessor.compile(template, variables);
                var hCover = Html.cover(template);
                var hChildren = hCover.children;
                if (hChildren.length == 1) {
                    var hScopes = hCover.querySelectorAll('[var-template],[var-repeat],[var-controller],[var-mount]');
                    var hRoot = hCover.removeChild(hChildren[0]);
                    if (hRoot.hasAttribute('var-template'))
                        throw new Error('Root element cannot be template ("var-template" attribute).');
                    if (hRoot.hasAttribute('var-repeat'))
                        throw new Error('Root element cannot be loop ("var-repeat" attribute).');
                    if (hRoot.hasAttribute('var-mount'))
                        throw new Error('Root element cannot be composition ("var-mount" attribute).');
                    var hMaster = this.findMaster(hRoot, hScopes);
                    var root = new Organizer.RootPattern(hMaster);
                    for (var _i = 0, _a = hScopes; _i < _a.length; _i++) {
                        var entry = _a[_i];
                        this.collectScope(entry, root);
                    }
                    for (var _b = 0, _c = hScopes; _b < _c.length; _b++) {
                        var entry = _c[_b];
                        this.releaseScope(entry);
                    }
                    return root;
                }
                else
                    throw new Error('Expected one root element inside template.');
            };
            Decompositor.counter = 0;
            return Decompositor;
        }());
        Organizer.Decompositor = Decompositor;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var Variable = (function () {
            function Variable(name, type) {
                this.name = name;
                this.type = type;
            }
            return Variable;
        }());
        Organizer.Variable = Variable;
        var Method = (function () {
            function Method(name, parameters) {
                this.name = name;
                this.parameters = parameters;
            }
            return Method;
        }());
        Organizer.Method = Method;
        var Parameter = (function () {
            function Parameter(name, methods) {
                this.name = name;
                this.methods = methods;
            }
            return Parameter;
        }());
        Organizer.Parameter = Parameter;
        var Interpolator = (function () {
            function Interpolator() {
            }
            Interpolator.extractName = function (text) {
                var matches = text.match(this.NAME_REGEX);
                if (matches == null)
                    throw new Error('Incorrect name format.');
                return matches[1];
            };
            Interpolator.extractPath = function (text) {
                var matches = text.match(this.PATH_REGEX);
                if (matches == null)
                    throw new Error('Incorrect object path format.');
                return matches[1];
            };
            Interpolator.extractParameters = function (text) {
                var parts = text.split(',');
                var result = [];
                for (var _i = 0, parts_3 = parts; _i < parts_3.length; _i++) {
                    var entry = parts_3[_i];
                    result.push(this.extractPath(entry));
                }
                return result;
            };
            Interpolator.extractMethods = function (text) {
                var parts = text.split('|');
                var result = [];
                for (var _i = 0, parts_4 = parts; _i < parts_4.length; _i++) {
                    var entry = parts_4[_i];
                    var matches = entry.match(this.DECLARATION_REGEX);
                    if (matches == null)
                        throw new Error('Incorrect function format.');
                    var content = matches[2];
                    var parameters = content ? this.extractParameters(content) : new Array();
                    result.push(new Method(matches[1], parameters));
                }
                return result;
            };
            Interpolator.parseVariable = function (text) {
                var matches = text.match(this.VARIABLE_REGEX);
                if (matches == null)
                    throw new Error('Incorrect controller attribute format ("' + text + '").');
                return new Variable(matches[2], matches[1]);
            };
            Interpolator.parseParameter = function (text) {
                var matches = text.match(this.PARAMETER_REGEX);
                if (matches == null)
                    throw new Error('Incorrect repeat attribute format ("' + text + '").');
                var content = matches[2];
                var methods = content ? this.extractMethods(content) : new Array();
                return new Parameter(matches[1], methods);
            };
            Interpolator.NAME_REGEX = /^\s*(\w+)\s*$/;
            Interpolator.PATH_REGEX = /^\s*(\w+(?:\.\w+)*)\s*$/;
            Interpolator.VARIABLE_REGEX = /^\s*(\w+)\s+as\s+(\w+)\s*$/;
            Interpolator.PARAMETER_REGEX = /^\s*(\w+)\s*:?\s*([^:]*)\s*$/;
            Interpolator.DECLARATION_REGEX = /^\s*(\w+)(?:\(([^()]*)\))?\s*/;
            return Interpolator;
        }());
        Organizer.Interpolator = Interpolator;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var ItemEntry = (function () {
            function ItemEntry(handle, data, controller, tag, scope) {
                this.handle = handle;
                this.data = data;
                this.controller = controller;
                this.tag = tag;
                this.scope = scope;
            }
            ItemEntry.prototype.getHandle = function () {
                if (this.scope.destroyed)
                    throw new Error('Item scope has been destroyed.');
                return this.handle;
            };
            ItemEntry.prototype.getData = function () {
                if (this.scope.destroyed)
                    throw new Error('Item scope has been destroyed.');
                return this.data;
            };
            ItemEntry.prototype.getController = function () {
                if (this.scope.destroyed)
                    throw new Error('Item scope has been destroyed.');
                return this.controller;
            };
            ItemEntry.prototype.getTag = function () {
                if (this.scope.destroyed)
                    throw new Error('Item scope has been destroyed.');
                return this.tag;
            };
            return ItemEntry;
        }());
        Organizer.ItemEntry = ItemEntry;
        var ItemInformationEntry = (function () {
            function ItemInformationEntry(data, tag, scope) {
                this.data = data;
                this.tag = tag;
                this.scope = scope;
            }
            ItemInformationEntry.prototype.getData = function () {
                return this.data;
            };
            ItemInformationEntry.prototype.getTag = function () {
                return this.tag;
            };
            return ItemInformationEntry;
        }());
        Organizer.ItemInformationEntry = ItemInformationEntry;
        var ItemInstanceEntry = (function () {
            function ItemInstanceEntry(handle, controller, scope) {
                this.handle = handle;
                this.controller = controller;
                this.scope = scope;
            }
            ItemInstanceEntry.prototype.getHandle = function () {
                if (this.scope.destroyed)
                    throw new Error('Item scope has been destroyed.');
                return this.handle;
            };
            ItemInstanceEntry.prototype.getController = function () {
                if (this.scope.destroyed)
                    throw new Error('Item scope has been destroyed.');
                return this.controller;
            };
            return ItemInstanceEntry;
        }());
        Organizer.ItemInstanceEntry = ItemInstanceEntry;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var ItemNode = (function () {
            function ItemNode(entry, scope) {
                this.entry = entry;
                this.scope = scope;
            }
            ItemNode.prototype.start = function () {
                this.scope.start();
            };
            ItemNode.prototype.stop = function () {
                this.scope.stop();
            };
            ItemNode.prototype.destroy = function () {
                this.scope.destroy();
            };
            return ItemNode;
        }());
        Organizer.ItemNode = ItemNode;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var ItemScope = (function () {
            function ItemScope(handle, instance, subscriptions, controllers, loops, compositions) {
                this.handle = handle;
                this.instance = instance;
                this.subscriptions = subscriptions;
                this.controllers = controllers;
                this.loops = loops;
                this.compositions = compositions;
                this.destroyed = false;
                this.working = false;
            }
            ItemScope.prototype.startControllers = function () {
                for (var el in this.controllers)
                    this.controllers[el].start();
            };
            ItemScope.prototype.startLoops = function () {
                for (var el in this.loops)
                    this.loops[el].start();
            };
            ItemScope.prototype.startCompositions = function () {
                for (var el in this.compositions)
                    this.compositions[el].start();
            };
            ItemScope.prototype.startInstance = function () {
                if (this.instance.onStart)
                    this.instance.onStart();
            };
            ItemScope.prototype.stopControllers = function () {
                for (var el in this.controllers)
                    this.controllers[el].stop();
            };
            ItemScope.prototype.stopLoops = function () {
                for (var el in this.loops)
                    this.loops[el].stop();
            };
            ItemScope.prototype.stopCompositions = function () {
                for (var el in this.compositions)
                    this.compositions[el].stop();
            };
            ItemScope.prototype.stopInstance = function () {
                if (this.instance.onStop)
                    this.instance.onStop();
            };
            ItemScope.prototype.destroySubscriptions = function () {
                for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
                    var entry = _a[_i];
                    entry();
                }
            };
            ItemScope.prototype.destroyControllers = function () {
                for (var el in this.controllers)
                    this.controllers[el].destroy();
            };
            ItemScope.prototype.destroyLoops = function () {
                for (var el in this.loops)
                    this.loops[el].destroy();
            };
            ItemScope.prototype.destroyCompositions = function () {
                for (var el in this.compositions)
                    this.compositions[el].destroy();
            };
            ItemScope.prototype.destroyInstance = function () {
                if (this.instance.onDestroy)
                    this.instance.onDestroy();
            };
            ItemScope.prototype.start = function () {
                if (this.destroyed)
                    return;
                if (this.working == false) {
                    this.startControllers();
                    this.startLoops();
                    this.startCompositions();
                    this.startInstance();
                    this.working = true;
                }
            };
            ItemScope.prototype.stop = function () {
                if (this.destroyed)
                    return;
                if (this.working == true) {
                    this.stopControllers();
                    this.stopLoops();
                    this.stopCompositions();
                    this.stopInstance();
                    this.working = false;
                }
            };
            ItemScope.prototype.destroy = function () {
                if (this.destroyed)
                    return;
                Core.Dom.removeNode(this.handle);
                this.destroySubscriptions();
                this.destroyControllers();
                this.destroyLoops();
                this.destroyCompositions();
                this.destroyInstance();
                this.destroyed = true;
            };
            return ItemScope;
        }());
        Organizer.ItemScope = ItemScope;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var LoopCollection = (function () {
            function LoopCollection(loops, organizer) {
                this.loops = loops;
                this.organizer = organizer;
            }
            LoopCollection.prototype.getLoop = function (name) {
                var loop = this.loops[name];
                if (loop == null)
                    throw new Error('Loop "' + name + '" does not exist in organizer "' + this.organizer.getName() + '".');
                return loop.entry;
            };
            return LoopCollection;
        }());
        Organizer.LoopCollection = LoopCollection;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var LoopNode = (function () {
            function LoopNode(entry, scope) {
                this.entry = entry;
                this.scope = scope;
            }
            LoopNode.prototype.start = function () {
                this.scope.start();
            };
            LoopNode.prototype.stop = function () {
                this.scope.stop();
            };
            LoopNode.prototype.destroy = function () {
                this.scope.destroy();
            };
            return LoopNode;
        }());
        Organizer.LoopNode = LoopNode;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var LoopScope = (function () {
            function LoopScope(collection) {
                this.collection = collection;
                this.destroyed = false;
                this.working = false;
            }
            LoopScope.prototype.start = function () {
                if (this.destroyed)
                    return;
                if (this.working == false) {
                    this.collection.iterateItems(function (index, node) {
                        node.start();
                        return true;
                    });
                    this.working = true;
                }
            };
            LoopScope.prototype.stop = function () {
                if (this.destroyed)
                    return;
                if (this.working == true) {
                    this.collection.iterateItems(function (index, node) {
                        node.start();
                        return true;
                    });
                    this.working = false;
                }
            };
            LoopScope.prototype.destroy = function () {
                if (this.destroyed)
                    return;
                this.collection.iterateItems(function (index, node) {
                    node.destroy();
                    return true;
                });
                this.destroyed = true;
            };
            return LoopScope;
        }());
        Organizer.LoopScope = LoopScope;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer_1) {
        var Instance = (function () {
            function Instance() {
                this.id_1545024291 = Instance.counter_1545024291++;
            }
            Instance.prototype.onCreate = function () {
            };
            Instance.prototype.onDestroy = function () {
            };
            Instance.prototype.onStart = function () {
            };
            Instance.prototype.onStop = function () {
            };
            Instance.prototype.addListener = function (name, action) {
                throw new Error('Add listener method is not implemented.');
            };
            Instance.prototype.removeListener = function (name, action) {
                throw new Error('Remove listener method is not implemented.');
            };
            Instance.prototype.toString = function () {
                return '{ Instance (service or factory) : id=' + this.id_1545024291 + ' }';
            };
            Instance.counter_1545024291 = 0;
            return Instance;
        }());
        Organizer_1.Instance = Instance;
        var Service = (function (_super) {
            __extends(Service, _super);
            function Service() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Service;
        }(Instance));
        Organizer_1.Service = Service;
        var Factory = (function (_super) {
            __extends(Factory, _super);
            function Factory() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Factory;
        }(Instance));
        Organizer_1.Factory = Factory;
        var Controller = (function () {
            function Controller() {
                this.id_1545024291 = Controller.counter_1545024291++;
            }
            Controller.prototype.onCreate = function (index, data) {
            };
            Controller.prototype.onDestroy = function () {
            };
            Controller.prototype.onStart = function () {
            };
            Controller.prototype.onStop = function () {
            };
            Controller.prototype.toString = function () {
                return '{ Controller : id=' + this.id_1545024291 + ' }';
            };
            Controller.counter_1545024291 = 0;
            return Controller;
        }());
        Organizer_1.Controller = Controller;
        var Organizer = (function () {
            function Organizer(name, master, debug) {
                if (master === void 0) { master = null; }
                if (debug === void 0) { debug = null; }
                this.destroyed = false;
                this.debug = null;
                this.master = null;
                this.slaves = {};
                this.id = Organizer.counter++;
                if (master) {
                    this.name = master.name + ' -> ' + name;
                    this.debug = debug == null ? master.debug : debug;
                    this.master = master;
                    this.bridges = new Organizer_1.MultiTube(master.bridges);
                    this.services = new Organizer_1.MultiTube(master.services);
                    this.resources = new Organizer_1.MultiTube(master.resources);
                    master.slaves[this.id] = this;
                }
                else {
                    this.name = name;
                    this.debug = debug == null ? false : debug;
                    this.bridges = new Organizer_1.SingleTube();
                    this.services = new Organizer_1.SingleTube();
                    this.resources = new Organizer_1.SingleTube();
                }
                this.transitor = new Organizer_1.Transitor(this, this.services, this.debug);
                this.decompositor = new Organizer_1.Decompositor(this.debug);
                this.compositor = new Organizer_1.Compositor(this, this.services, this.bridges, this.resources, this.debug);
            }
            Organizer.prototype.construct = function () {
                if (this.master)
                    this.master.construct();
                this.transitor.construct();
            };
            Organizer.prototype.getName = function () {
                if (this.destroyed)
                    throw new Error('Organizer "' + this.name + '" has been destroyed.');
                return this.name;
            };
            Organizer.prototype.addService = function (name, service) {
                if (this.destroyed)
                    throw new Error('Organizer "' + this.name + '" has been destroyed.');
                if (name == null)
                    throw new Error('Added service name "' + name + '" is not defined (organizer "' + this.name + '").');
                if (service == null)
                    throw new Error('Added service type is not defined (organizer "' + this.name + '", service "' + name + '").');
                if (name in Organizer_1.InjectionName)
                    throw new Error('Added service name "' + name + '" is reserved in organizer "' + this.name + '".');
                if (this.services.has(name))
                    throw new Error('Added service "' + name + '" already exists in organizer "' + this.name + '".');
                this.transitor.addService(name, service);
            };
            Organizer.prototype.addFactory = function (name, factory) {
                if (this.destroyed)
                    throw new Error('Organizer "' + this.name + '" has been destroyed.');
                if (name == null)
                    throw new Error('Added service (factory) name "' + name + '" is not defined (organizer "' + this.name + '").');
                if (factory == null)
                    throw new Error('Added service (factory) type is not defined (organizer "' + this.name + '", factory "' + name + '").');
                if (name in Organizer_1.InjectionName)
                    throw new Error('Added service (factory) name "' + name + '" is reserved in organizer "' + this.name + '".');
                if (this.services.has(name))
                    throw new Error('Service (factory) "' + name + '" already exists in organizer "' + this.name + '".');
                this.transitor.addFactory(name, factory);
            };
            Organizer.prototype.addObject = function (name, object) {
                if (this.destroyed)
                    throw new Error('Organizer "' + this.name + '" has been destroyed.');
                if (name == null)
                    throw new Error('Added service (object) name "' + name + '" is not defined (organizer "' + this.name + '").');
                if (object == null)
                    throw new Error('Added service (object) instance is not defined (organizer "' + this.name + '", object "' + name + '").');
                if (name in Organizer_1.InjectionName)
                    throw new Error('Added service (object) name "' + name + '" is reserved in organizer "' + this.name + '".');
                if (this.services.has(name))
                    throw new Error('Added service (object) "' + name + '" already exists in organizer "' + this.name + '".');
                this.services.add(name, object);
            };
            Organizer.prototype.addController = function (name, controller) {
                if (this.destroyed)
                    throw new Error('Organizer "' + this.name + '" has been destroyed.');
                if (name == null)
                    throw new Error('Added controller name "' + name + '" is not defined (organizer "' + this.name + '").');
                if (controller == null)
                    throw new Error('Added controller type is not defined (organizer "' + this.name + '", controller "' + name + '").');
                if (this.resources.has(name))
                    throw new Error('Added controller "' + name + '" already exists in organizer "' + this.name + '".');
                this.resources.add(name, new Organizer_1.Resource(controller, this.services));
            };
            Organizer.prototype.addTemplate = function (name, template, variables) {
                if (this.destroyed)
                    throw new Error('Organizer "' + this.name + '" has been destroyed.');
                if (name == null)
                    throw new Error('Added template name "' + name + '" is not defined (organizer "' + this.name + '").');
                var bridge = this.compileTemplate(template, variables);
                this.addBridge(name, bridge);
            };
            Organizer.prototype.addBridge = function (name, bridge) {
                if (this.destroyed)
                    throw new Error('Organizer "' + this.name + '" has been destroyed.');
                if (name == null)
                    throw new Error('Added bridge name "' + name + '" is not defined (organizer "' + this.name + '").');
                if (bridge == null)
                    throw new Error('Added bridge instance is not defined (organizer "' + this.name + '", bridge "' + name + '" ).');
                if (this.bridges.has(name))
                    throw new Error('Added bridge (or template) "' + name + '" already exists in organizer "' + this.name + '".');
                this.bridges.add(name, bridge);
            };
            Organizer.prototype.compileTemplate = function (template, variables) {
                var _this = this;
                if (this.destroyed)
                    throw new Error('Organizer "' + this.name + '" has been destroyed.');
                if (template == null)
                    throw new Error('Template content is not defined (organizer "' + this.name + '", template "' + name + '").');
                var root = this.decompositor.decompose(template, variables);
                var proxy = function () { return _this.construct(); };
                return new Organizer_1.Bridge(root, this.compositor, proxy);
            };
            Organizer.prototype.composeTemplate = function (template, parent, variables) {
                var bridge = this.compileTemplate(template, variables);
                return bridge.compose(parent);
            };
            Organizer.prototype.destroy = function () {
                if (this.destroyed)
                    return;
                if (this.master)
                    delete this.master.slaves[this.id];
                for (var el in this.slaves)
                    this.slaves[el].destroy();
                this.transitor.release();
                this.destroyed = true;
            };
            Organizer.prototype.toString = function () {
                return '{ Organizer : id=' + this.id + ' }';
            };
            Organizer.counter = 0;
            return Organizer;
        }());
        Organizer_1.Organizer = Organizer;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var ParentPattern = (function () {
            function ParentPattern(parent, identifier) {
                this.parent = parent;
                this.identifier = identifier;
            }
            return ParentPattern;
        }());
        Organizer.ParentPattern = ParentPattern;
        var ScopePattern = (function (_super) {
            __extends(ScopePattern, _super);
            function ScopePattern(parent, identifier, handle) {
                var _this = _super.call(this, parent, identifier) || this;
                _this.handle = handle;
                _this.loops = {};
                _this.controllers = {};
                _this.compositions = {};
                return _this;
            }
            return ScopePattern;
        }(ParentPattern));
        Organizer.ScopePattern = ScopePattern;
        var RootPattern = (function (_super) {
            __extends(RootPattern, _super);
            function RootPattern(handle) {
                var _this = _super.call(this, null, null, handle) || this;
                _this.templates = {};
                return _this;
            }
            return RootPattern;
        }(ScopePattern));
        Organizer.RootPattern = RootPattern;
        var TemplatePattern = (function (_super) {
            __extends(TemplatePattern, _super);
            function TemplatePattern(handle) {
                return _super.call(this, null, null, handle) || this;
            }
            return TemplatePattern;
        }(ScopePattern));
        Organizer.TemplatePattern = TemplatePattern;
        var LoopPattern = (function (_super) {
            __extends(LoopPattern, _super);
            function LoopPattern(parent, handle, identifier, name, functions, logic) {
                var _this = _super.call(this, parent, identifier, handle) || this;
                _this.name = name;
                _this.functions = functions;
                _this.logic = logic;
                return _this;
            }
            return LoopPattern;
        }(ScopePattern));
        Organizer.LoopPattern = LoopPattern;
        var ControllerPattern = (function (_super) {
            __extends(ControllerPattern, _super);
            function ControllerPattern(parent, handle, identifier, name, type) {
                var _this = _super.call(this, parent, identifier, handle) || this;
                _this.name = name;
                _this.type = type;
                return _this;
            }
            return ControllerPattern;
        }(ScopePattern));
        Organizer.ControllerPattern = ControllerPattern;
        var CompositionPattern = (function (_super) {
            __extends(CompositionPattern, _super);
            function CompositionPattern(parent, identifier, name, template) {
                var _this = _super.call(this, parent, identifier, null) || this;
                _this.name = name;
                _this.template = template;
                return _this;
            }
            return CompositionPattern;
        }(ScopePattern));
        Organizer.CompositionPattern = CompositionPattern;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var SinglePlaceholder = (function () {
            function SinglePlaceholder(hMaster) {
                this.hMaster = hMaster;
            }
            SinglePlaceholder.prototype.mount = function (hScope, scope) {
                var hPlaceholder = this.hMaster.querySelector('script[id="' + scope.identifier + '"]');
                if (hPlaceholder == null)
                    throw new Error('Placeholder with id "' + scope.identifier + '" does not exist.');
                var hParent = hPlaceholder.parentNode;
                hParent.insertBefore(hScope, hPlaceholder);
                hParent.removeChild(hPlaceholder);
            };
            return SinglePlaceholder;
        }());
        Organizer.SinglePlaceholder = SinglePlaceholder;
        var MultiPlaceholder = (function () {
            function MultiPlaceholder(hMaster, scope) {
                this.hPlaceholder = hMaster.querySelector('script[id="' + scope.identifier + '"]');
                if (this.hPlaceholder == null)
                    throw new Error('Placeholder with id "' + scope.identifier + '" does not exist.');
                this.identifier = scope.identifier;
                this.hParent = this.hPlaceholder.parentNode;
            }
            MultiPlaceholder.prototype.mount = function (hScope, hPlaceholder) {
                if (hPlaceholder) {
                    if (hPlaceholder.parentNode != this.hParent)
                        throw new Error('Placeholder handle is not child of "' + this.identifier + '".');
                }
                else
                    hPlaceholder = this.hPlaceholder;
                this.hParent.insertBefore(hScope, hPlaceholder);
            };
            return MultiPlaceholder;
        }());
        Organizer.MultiPlaceholder = MultiPlaceholder;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var Presenter = (function () {
            function Presenter() {
            }
            Presenter.prototype.buildText = function (prefix, text) {
                var lines = text.split('\n');
                var size = 0;
                var result = '';
                for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                    var entry = lines_1[_i];
                    if (entry.length > size)
                        size = entry.length;
                }
                size += 5;
                for (var _a = 0, lines_2 = lines; _a < lines_2.length; _a++) {
                    var entry = lines_2[_a];
                    result += prefix + '\t"' + entry;
                    for (var i = size - entry.length; i > 0; --i)
                        result += ' ';
                    result += '"\n';
                }
                return result;
            };
            Presenter.prototype.buildTemplate = function (prefix, name, template) {
                var text = prefix + '+ (Name: "' + name + '"):\n';
                if (template.handle)
                    text += this.buildText(prefix, template.handle.outerHTML);
                else
                    text += prefix + '\t<null>\n';
                text += this.buildLoops(prefix + '\t', template.loops);
                text += this.buildControllers(prefix + '\t', template.controllers);
                text += this.buildCompositions(prefix + '\t', template.compositions);
                return text;
            };
            Presenter.prototype.buildTemplates = function (prefix, templates) {
                var text = '';
                for (var el in templates) {
                    text += '\n' + prefix + 'Templates:\n';
                    break;
                }
                for (var el in templates) {
                    var template = templates[el];
                    text += this.buildTemplate(prefix + '\t', el, template);
                }
                return text;
            };
            Presenter.prototype.buildLoop = function (prefix, name, loop) {
                var text = prefix + '+ (Name: "' + name + '", Controller: "' + loop.logic + '", Identifier: "' + loop.identifier + '"):\n';
                if (loop.handle)
                    text += this.buildText(prefix, loop.handle.outerHTML);
                else
                    text += prefix + '\t<null>\n';
                text += this.buildLoops(prefix + '\t', loop.loops);
                text += this.buildControllers(prefix + '\t', loop.controllers);
                text += this.buildCompositions(prefix + '\t', loop.compositions);
                return text;
            };
            Presenter.prototype.buildLoops = function (prefix, loops) {
                var text = '';
                for (var el in loops) {
                    text += '\n' + prefix + 'Loops:\n';
                    break;
                }
                for (var el in loops) {
                    var loop = loops[el];
                    text += this.buildLoop(prefix + '\t', el, loop);
                }
                return text;
            };
            Presenter.prototype.buildController = function (prefix, name, controller) {
                var text = prefix + '+ (Name: "' + name + '", Type: "' + controller.type + '", Identifier: "' + controller.identifier + '"):\n';
                if (controller.handle)
                    text += this.buildText(prefix, controller.handle.outerHTML);
                else
                    text += prefix + '\t<null>\n';
                text += this.buildLoops(prefix + '\t', controller.loops);
                text += this.buildControllers(prefix + '\t', controller.controllers);
                text += this.buildCompositions(prefix + '\t', controller.compositions);
                return text;
            };
            Presenter.prototype.buildControllers = function (prefix, controllers) {
                var text = '';
                for (var el in controllers) {
                    text += '\n' + prefix + 'Controllers:\n';
                    break;
                }
                for (var el in controllers) {
                    var controller_6 = controllers[el];
                    text += this.buildController(prefix + '\t', el, controller_6);
                }
                return text;
            };
            Presenter.prototype.buildComposition = function (prefix, name, composition) {
                return prefix + '+ (Name: "' + name + '", Template: "' + composition.template + '", Identifier: "' + composition.identifier + '")\n';
            };
            Presenter.prototype.buildCompositions = function (prefix, compositions) {
                var text = '';
                for (var el in compositions) {
                    text += '\n' + prefix + 'Compositions:\n';
                    break;
                }
                for (var el in compositions) {
                    var composition = compositions[el];
                    text += this.buildComposition(prefix + '\t', el, composition);
                }
                return text;
            };
            Presenter.prototype.constructHtml = function (root) {
                var text = 'Root:\n';
                if (root.handle)
                    text += this.buildText('', root.handle.outerHTML);
                else
                    text += '\t<null>\n';
                text += this.buildTemplates('\t', root.templates);
                text += this.buildLoops('\t', root.loops);
                text += this.buildControllers('\t', root.controllers);
                text += this.buildCompositions('\t', root.compositions);
                return text;
            };
            Presenter.prototype.constructStructure = function (organizer) {
                return '';
            };
            return Presenter;
        }());
        Organizer.Presenter = Presenter;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var Resource = (function () {
            function Resource(controller, services) {
                this.controller = controller;
                this.services = services;
            }
            return Resource;
        }());
        Organizer.Resource = Resource;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Organizer;
    (function (Organizer) {
        var SingleTube = (function () {
            function SingleTube() {
                this.objects = {};
            }
            SingleTube.prototype.has = function (name, deep) {
                return name in this.objects;
            };
            SingleTube.prototype.get = function (name, deep) {
                return this.objects[name];
            };
            SingleTube.prototype.add = function (name, object) {
                if (name in this.objects)
                    return;
                this.objects[name] = object;
            };
            SingleTube.prototype.iterate = function (iteration, deep) {
                var index = 0;
                for (var name_5 in this.objects) {
                    var object = this.objects[name_5];
                    if (!iteration(index++, object))
                        return;
                }
            };
            return SingleTube;
        }());
        Organizer.SingleTube = SingleTube;
        var MultiTube = (function () {
            function MultiTube(master, objects) {
                if (objects === void 0) { objects = {}; }
                this.master = master;
                this.objects = objects;
            }
            MultiTube.prototype.has = function (name, deep) {
                if (name in this.objects)
                    return true;
                return deep && this.master.has(name, deep);
            };
            MultiTube.prototype.get = function (name, deep) {
                var object = this.objects[name];
                if (object == null) {
                    if (deep)
                        return this.master.get(name, true);
                    return null;
                }
                return object;
            };
            MultiTube.prototype.add = function (name, object) {
                if (name in this.objects)
                    return;
                this.objects[name] = object;
            };
            MultiTube.prototype.iterate = function (iteration, deep) {
                var index = 0;
                if (deep) {
                    var tmp = function (i, data) {
                        return iteration(index++, data);
                    };
                    if (!this.master.iterate(tmp, deep))
                        return;
                }
                for (var name_6 in this.objects) {
                    var object = this.objects[name_6];
                    if (!iteration(index++, object))
                        return;
                }
            };
            return MultiTube;
        }());
        Organizer.MultiTube = MultiTube;
    })(Organizer = Core.Organizer || (Core.Organizer = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Validation;
    (function (Validation) {
        var CheckboxSelectionCondition = (function () {
            function CheckboxSelectionCondition(hInput, expected) {
                if (expected === void 0) { expected = true; }
                this.hInput = hInput;
                this.expected = expected;
            }
            CheckboxSelectionCondition.prototype.check = function () {
                if (this.hInput.checked == this.expected)
                    return true;
                return false;
            };
            return CheckboxSelectionCondition;
        }());
        Validation.CheckboxSelectionCondition = CheckboxSelectionCondition;
    })(Validation = Core.Validation || (Core.Validation = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Validation;
    (function (Validation) {
        var CompleteValidator = (function () {
            function CompleteValidator() {
                this.array = [];
            }
            CompleteValidator.prototype.add = function (validator) {
                this.array.push(validator);
            };
            CompleteValidator.prototype.validate = function () {
                var result = true;
                for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
                    var entry = _a[_i];
                    var tmp = entry.validate();
                    if (tmp == false)
                        result = false;
                }
                return result;
            };
            CompleteValidator.prototype.reset = function () {
                for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
                    var entry = _a[_i];
                    entry.reset();
                }
            };
            return CompleteValidator;
        }());
        Validation.CompleteValidator = CompleteValidator;
    })(Validation = Core.Validation || (Core.Validation = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Validation;
    (function (Validation) {
        var ConditionalValidator = (function () {
            function ConditionalValidator() {
                this.conditions = [];
                this.validators = [];
            }
            ConditionalValidator.prototype.addCondition = function (condition) {
                this.conditions.push(condition);
            };
            ConditionalValidator.prototype.addValidator = function (validator) {
                this.validators.push(validator);
            };
            ConditionalValidator.prototype.validate = function () {
                for (var _i = 0, _a = this.conditions; _i < _a.length; _i++) {
                    var entry = _a[_i];
                    if (entry.check())
                        continue;
                    for (var _b = 0, _c = this.validators; _b < _c.length; _b++) {
                        var entry_6 = _c[_b];
                        entry_6.reset();
                    }
                    return true;
                }
                var result = true;
                for (var _d = 0, _e = this.validators; _d < _e.length; _d++) {
                    var entry = _e[_d];
                    if (!entry.validate())
                        result = false;
                }
                return result;
            };
            ConditionalValidator.prototype.reset = function () {
                for (var _i = 0, _a = this.validators; _i < _a.length; _i++) {
                    var entry = _a[_i];
                    entry.reset();
                }
            };
            return ConditionalValidator;
        }());
        Validation.ConditionalValidator = ConditionalValidator;
    })(Validation = Core.Validation || (Core.Validation = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Validation;
    (function (Validation) {
        var TypeTextValidator = (function () {
            function TypeTextValidator(hInput, hMessage, error) {
                this.hInput = hInput;
                this.hMessage = hMessage;
                this.error = error;
            }
            TypeTextValidator.prototype.validate = function () {
                var value = this.hInput.value;
                if (value == null || value.length == 0) {
                    if (this.error)
                        this.hMessage.textContent = this.error;
                    Core.Dom.showElement(this.hMessage);
                    return false;
                }
                else {
                    Core.Dom.hideElement(this.hMessage);
                    return true;
                }
            };
            TypeTextValidator.prototype.reset = function () {
                Core.Dom.hideElement(this.hMessage);
            };
            return TypeTextValidator;
        }());
        Validation.TypeTextValidator = TypeTextValidator;
    })(Validation = Core.Validation || (Core.Validation = {}));
})(Core || (Core = {}));
Array.prototype.find = function (element, offset, count) {
    if (offset === void 0) { offset = 0; }
    if (count === void 0) { count = null; }
    if (count > 0) {
        if (offset < 0)
            offset = 0;
        var limit = Math.min(offset + count, this.length);
        for (var i = offset; i < limit; i++) {
            if (this[i] == element)
                return i;
        }
    }
    return -1;
};
Array.prototype.remove = function (element) {
    var index = this.find(element);
    if (index > -1) {
        var tmp = this.splice(index, 1);
        return tmp[0];
    }
    return null;
};
Array.prototype.clear = function () {
    this.splice(0, this.length);
};
Array.prototype.clone = function () {
    return this.slice();
};
//# sourceMappingURL=out.js.map