(function (angular, $) {

    var module = angular.module('kendo.directives', []);
    var parse, timeout, compile, log;

    // The following disables AngularJS built-in directives for <input> fields
    // when a Kendo widget is defined.  The reason we have to do this is:
    //
    // 1. user updates field.
    //
    // 2. widget triggers "change" event on the Widget object => angular-kendo
    //    gets notified, updates the model with the correct value!
    //
    // 3. widget triggers "change" event on the <input> field => AngularJS's
    //    built-in directive validates the *content* of the input field and
    //    updates the model again WITH THE WRONG VALUE.
    //
    // https://github.com/kendo-labs/angular-kendo/issues/135
    // https://github.com/kendo-labs/angular-kendo/issues/152
    module.config(["$provide", function ($provide) {
        $provide.decorator("inputDirective", ["$delegate", function ($delegate) {
            var orig_compile = $delegate[0].compile;
            $delegate[0].compile = function (element, attrs) {
                for (var i in attrs) {
                    if (attrs.hasOwnProperty(i)) {
                        if (/^kendo/.test(i) && typeof $.fn[i] == "function") {
                            return;           // HA!
                        }
                    }
                }
                return orig_compile.apply(this, arguments);
            };
            return $delegate;
        }]);
    }]);

    var factories = {

        dataSource: (function () {

            var types = {
                TreeView: 'HierarchicalDataSource',
                Scheduler: 'SchedulerDataSource'
            };

            var toDataSource = function (dataSource, type) {
                return kendo.data[type].create(dataSource);
            };

            var init = function (scope, element, attrs, role) {
                var type = types[role] || 'DataSource';
                var ds = toDataSource(scope.$eval(attrs.kDataSource), type);

                // Set $kendoDataSource in the element's data. 3rd parties can define their own dataSource creation
                // directive and provide this data on the element.
                element.data('$kendoDataSource', ds);

                // not recursive -- this triggers when the whole data source changed
                scope.$watch(attrs.kDataSource, function (mew, old) {
                    if (mew !== old) {
                        var ds = toDataSource(mew, type);
                        element.data('$kendoDataSource', ds);
                        var widget = kendoWidgetInstance(element);
                        if (widget && typeof widget.setDataSource == "function") {
                            widget.setDataSource(ds);
                        }
                    }
                });

                return ds;
            };

            return { create: init };

        }()),

        widget: (function () {
            var ignoredAttributes = {
                kDataSource: true,
                kOptions: true,
                kRebind: true
            };

            var init = function (scope, element, attrs, widget) {

                function gatherOptions() {
                    var options = angular.extend({}, scope.$eval(attrs.kOptions));
                    $.each(attrs, function (name, value) {
                        processAttr(options, { name: name, value: value });
                    });
                    options.dataSource = element.inheritedData('$kendoDataSource') || options.dataSource;
                    return options;
                }

                function processAttr(options, attr) {
                    var match, optionName, fn;

                    if (ignoredAttributes[attr.name]) {
                        return;
                    }
                    if (/^kendo(Grid|ListView)$/.test(widget) && attr.name == "kOnChange") {
                        return;             // XXX: handled in afterCreate :-\
                    }
                    match = attr.name.match(/k(On)?([A-Z].*)/);
                    if (match) {
                        optionName = match[2].charAt(0).toLowerCase() + match[2].slice(1);
                        if (match[1]) {
                            fn = parse(attr.value);
                            options[optionName] = function (e) {
                                if (scope.$root.$$phase === '$apply' || scope.$root.$$phase === '$digest') {
                                    fn({ kendoEvent: e });
                                } else {
                                    scope.$apply(function () {
                                        fn(scope, { kendoEvent: e });
                                    });
                                }
                            };
                        } else {
                            options[optionName] = angular.copy(scope.$eval(attr.value));
                            if (options[optionName] === undefined && attr.value.match(/^\w*$/)) {
                                log.warn(widget + '\'s ' + attr.name + ' attribute resolved to undefined. Maybe you meant to use a string literal like: \'' + attr.value + '\'?');
                            }
                        }
                    }
                }

                var options = gatherOptions();
                var role = widget.replace('kendo', '');

                // parse the datasource attribute
                if (attrs.kDataSource) {
                    options.dataSource = factories.dataSource.create(scope, element, attrs, role);
                }

                beforeCreate(role, scope, element, options, attrs);
                widget = $(element)[widget](options).data(widget);
                afterCreate.call(widget, role, scope, element, options, attrs);

                return widget;
            };

            return { create: init };

        }())
    };

    module.factory('directiveFactory', ['$timeout', '$parse', '$compile', '$log',
      function ($timeout, $parse, $compile, $log) {

          timeout = $timeout;
          parse = $parse;
          compile = $compile;
          log = $log;

          function exposeWidget(widget, scope, attrs, kendoWidget) {
              if (attrs[kendoWidget]) {
                  // expose the widget object
                  var set = $parse(attrs[kendoWidget]).assign;
                  if (set) {
                      // set the value of the expression to the kendo widget object to expose its api
                      set(scope, widget);
                  } else {
                      throw new Error(kendoWidget + ' attribute used but expression in it is not assignable: ' + attrs[kendoWidget]);
                  }
              }
          }

          function makeValue(val) {
              if (val == null) return null;
              if (typeof val == "string") {
                  if (/^[+-]?([0-9]+(\.[0-9]*)?|\.[0-9]+)$/.test(val)) {
                      return parseFloat(val);
                  }
              }
              return val;
          }

          var create = function (role) {

              return {
                  // Parse the directive for attributes and classes
                  restrict: 'ACE',
                  require: '?ngModel',
                  scope: false,

                  // // XXX: Is this transclusion needed?  We seem to do better without it.
                  // //      https://github.com/kendo-labs/angular-kendo/issues/90
                  //
                  // transclude: true,
                  // controller: [ '$scope', '$attrs', '$element', '$transclude', function($scope, $attrs, $element, $transclude) {
                  //   // Make the element's contents available to the kendo widget to allow creating some widgets from existing elements.
                  //   $transclude(function(clone){
                  //     $element.append(clone);
                  //   });
                  // }],

                  link: function (scope, element, attrs, ngModel) {

                      // we must remove data-kendo-widget-name attribute because
                      // it breaks kendo.widgetInstance; can generate all kinds
                      // of funny issues like
                      // https://github.com/kendo-labs/angular-kendo/issues/167

                      // $(element).removeData(role);
                      // console.log($(element).data(role)); // --> not undefined.  now I'm pissed.
                      $(element)[0].removeAttribute("data-" + role.replace(/([A-Z])/g, "-$1"));

                      var originalElement = $(element)[0].cloneNode(true);

                      timeout(function () {
                          var widget = factories.widget.create(scope, element, attrs, role);

                          // if k-rebind attribute is provided, rebind the kendo widget when
                          // the watched value changes
                          if (attrs.kRebind) {
                              // watch for changes on the expression passed in the k-rebind attribute
                              scope.$watch(attrs.kRebind, function (newValue, oldValue) {
                                  if (newValue !== oldValue) {
                                      // create the kendo widget and bind it to the element.
                                      try {
                                          /****************************************************************
                                           // XXX: this is a gross hack that might not even work with all
                                           // widgets.  we need to destroy the current widget and get its
                                           // wrapper element out of the DOM, then make the original element
                                           // visible so we can initialize a new widget on it.
                                           //
                                           // kRebind is probably impossible to get right at the moment.
                                           ****************************************************************/
                                          var _wrapper = $(widget.wrapper)[0];
                                          var _element = $(widget.element)[0];
                                          widget.destroy();
                                          if (_wrapper && _element) {
                                              _wrapper.parentNode.replaceChild(_element, _wrapper);
                                              var clone = originalElement.cloneNode(true);
                                              $(element).replaceWith(clone);
                                              element = $(clone);
                                          }
                                          widget = factories.widget.create(scope, element, attrs, role);
                                          setupBindings();
                                      } catch (ex) {
                                          console.error(ex);
                                          console.error(ex.stack);
                                      }
                                  }
                              }, true); // watch for object equality. Use native or simple values.
                          }

                          setupBindings();

                          var prev_destroy = null;
                          function setupBindings() {
                              exposeWidget(widget, scope, attrs, role);

                              // Cleanup after ourselves
                              if (prev_destroy) {
                                  prev_destroy();
                              }
                              prev_destroy = scope.$on("$destroy", function () {
                                  widget.destroy();
                              });

                              // 2 way binding: ngModel <-> widget.value()
                              if (ngModel) {
                                  if (!widget.value) {
                                      throw new Error('ng-model used but ' + role + ' does not define a value accessor');
                                  }

                                  // Angular will invoke $render when the view needs to be updated with the view value.
                                  ngModel.$render = function () {
                                      // Update the widget with the view value.
                                      widget.value(makeValue(ngModel.$viewValue));
                                  };

                                  // In order to be able to update the angular scope objects, we need to know when the change event is fired for a Kendo UI Widget.
                                  function onChange(e) {
                                      if (scope.$root.$$phase === '$apply' || scope.$root.$$phase === '$digest') {
                                          ngModel.$setViewValue(widget.value());
                                      } else {
                                          scope.$apply(function () {
                                              ngModel.$setViewValue(widget.value());
                                          });
                                      }
                                  }
                                  bindBefore(widget, "change", onChange);
                                  bindBefore(widget, "dataBound", onChange);

                                  // if the model value is undefined, then we set the widget value to match ( == null/undefined )
                                  if (ngModel.$viewValue !== undefined) {
                                      widget.value(makeValue(ngModel.$viewValue));
                                  }
                                  if (widget.value() !== undefined) {
                                      ngModel.$setViewValue(widget.value());
                                  }
                              }
                          }

                          // mutation observers — propagate the original
                          // element's class to the widget wrapper.
                          (function () {

                              if (!(window.MutationObserver
                                    && widget.wrapper
                                    && $(widget.wrapper)[0] !== $(element)[0])) {
                                  return;
                              }

                              var prevClassList = [].slice.call($(element)[0].classList);

                              var mo = new MutationObserver(function (changes, mo) {
                                  suspend();    // make sure we don't trigger a loop

                                  changes.forEach(function (chg) {
                                      var w = $(widget.wrapper)[0];
                                      switch (chg.attributeName) {

                                          case "class":
                                              // sync classes to the wrapper element
                                              var currClassList = [].slice.call(chg.target.classList);
                                              currClassList.forEach(function (cls) {
                                                  if (prevClassList.indexOf(cls) < 0) {
                                                      w.classList.add(cls);
                                                  }
                                              });
                                              prevClassList.forEach(function (cls) {
                                                  if (currClassList.indexOf(cls) < 0) {
                                                      w.classList.remove(cls);
                                                  }
                                              });
                                              prevClassList = currClassList;
                                              break;

                                          case "disabled":
                                              if (typeof widget.enable == "function") {
                                                  widget.enable(!$(chg.target).attr("disabled"));
                                              }
                                              break;

                                          case "readonly":
                                              if (typeof widget.readonly == "function") {
                                                  widget.readonly(!!$(chg.target).attr("readonly"));
                                              }
                                              break;
                                      }
                                  });

                                  resume();
                              });

                              function suspend() {
                                  mo.disconnect();
                              }
                              function resume() {
                                  mo.observe($(element)[0], { attributes: true });
                              }
                              resume();
                              bindBefore(widget, "destroy", suspend);
                          })();

                      });
                  }
              };
          };

          return {
              create: create
          };
      }
    ]);

    // create directives for every widget.
    angular.forEach([kendo.ui, kendo.dataviz && kendo.dataviz.ui], function (namespace) {
        angular.forEach(namespace, function (value, key) {
            if (key.match(/^[A-Z]/) && key !== 'Widget') {
                var widget = "kendo" + key;
                module.directive(widget, [
                  "directiveFactory",
                  function (directiveFactory) {
                      return directiveFactory.create(widget);
                  }
                ]);
            }
        });
    });

    function kendoWidgetInstance(el) {
        el = $(el);
        return kendo.widgetInstance(el, kendo.ui) ||
          kendo.widgetInstance(el, kendo.mobile.ui) ||
          kendo.widgetInstance(el, kendo.dataviz.ui);
    }

    // XXX: using internal API (Widget::_events).  Seems to be no way in Kendo to
    // insert a handler to be executed before any existing ones, hence this hack.
    // Use for a single event/handler combination.
    function bindBefore(widget, name, handler, one) {
        widget.bind.call(widget, name, handler, one);
        var a = widget._events[name];
        a.unshift(a.pop());
    }

    /* -----[ Special widget setup ]----- */

    // runs before the widget is created.
    function beforeCreate(role, scope, element, options, attrs) {
        switch (role) {
            case "Grid":
                handle_dataBound();
                fix_columns();
                break;

            case "ListView":
                handle_dataBound();
                break;
        }

        // Only for the grid.  For columns where there is no template and
        // we have a 'field', we supply it as Angular template.
        function fix_columns() {
            options.columns.forEach(function (col) {
                if (col.field && !col.template) {
                    col.template = "{{dataItem." + col.field + "}}";
                }
            });
        }

        // This uses API that is common to Grid and ListView, so it works
        // for both.  It compiles each item in a new Angular scope
        // containing the `dataItem` property to point to the item data.
        function handle_dataBound() {
            var prev_dataBound = options.dataBound;
            options.dataBound = function (ev) {
                var widget = ev.sender;
                var dataSource = widget.dataSource;
                widget.items().each(function () {
                    var itemUid = $(this).attr(kendo.attr("uid"));
                    var item = dataSource.getByUid(itemUid);
                    var itemScope = scope.$new();
                    itemScope.dataItem = item;
                    compile(this)(itemScope);
                });
                if (scope.$root.$$phase !== "$digest") {
                    scope.$digest();
                }
                if (prev_dataBound) {
                    return prev_dataBound.apply(this, arguments);
                }
            };
        }
    }

    // Runs after the widget has been created.  `this` is the widget
    // object.
    function afterCreate(role, scope, element, options, attrs) {
        switch (role) {
            case "Grid":
            case "ListView":
                this.bind(this, "dataBinding", function (ev) {
                    ev.sender.items().each(function () {
                        var rowScope = angular.element(this).scope();
                        rowScope.$destroy();
                    });
                });

                bindBefore(this, "change", function (ev) {
                    var widget = ev.sender;
                    var dataSource = widget.dataSource;
                    var cell, multiple, locals = { kendoEvent: ev }, elems, items, columns, colIdx;

                    if (angular.isString(options.selectable)) {
                        cell = options.selectable.indexOf('cell') !== -1;
                        multiple = options.selectable.indexOf('multiple') !== -1;
                    }

                    elems = locals.selected = this.select();
                    items = locals.data = [];
                    columns = locals.columns = [];
                    for (var i = 0; i < elems.length; i++) {
                        var item = cell ? elems[i].parentNode : elems[i];
                        var itemUid = $(item).attr(kendo.attr("uid"));
                        var dataItem = dataSource.getByUid(itemUid);
                        if (cell) {
                            if (angular.element.inArray(dataItem, items) < 0) {
                                items.push(dataItem);
                            }
                            colIdx = angular.element(elems[i]).index();
                            if (angular.element.inArray(colIdx, columns) < 0) {
                                columns.push(colIdx);
                            }
                        } else {
                            items.push(dataItem);
                        }
                    }

                    if (!multiple) {
                        locals.data = items[0];
                        locals.selected = elems[0];
                    }

                    // Make sure this gets invoked in the angularjs lifecycle.
                    scope.$apply(function () {
                        // Invoke the parsed expression with a kendoEvent local that the expression can use.
                        var changeExpFn = parse(attrs.kOnChange);
                        changeExpFn(scope, locals);
                    });
                });
                break;
        }

        // Widgets that have contentLoad events may insert
        // arbitrary content in the DOM.  Compile it as Angular
        // templates.
        bindBefore(this, "contentLoad", function (ev) {
            //                   tabstrip/panelbar    splitter
            var contentElement = ev.contentElement || ev.pane;
            compile(ev.contentElement)(scope);
            if (scope.$root.$$phase !== "$digest") {
                scope.$digest();
            }
        });
    }

}(angular, jQuery));

// Local Variables:
// js-indent-level: 2
// js2-basic-offset: 2
// End: