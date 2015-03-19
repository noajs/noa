
( function( root, factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD. Register as an anonymous module.
        define( [], factory );
    } else if ( typeof exports === "object" ) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals ( root is window )
        root.returnExports = factory();
  }
}( this, function() {
    var J = makeClass();
    J._i = 0;

    J.types = {
        "URL": "URL",
        "HTML": "HTML",
        "SAD": ":-(",
        "HAPPY": ":-)",
        "OK": "OK",
        "NO_GOOD": "NO GOOD",
        "JSON" : "JSON",
        "TEXT" : "TEXT" 
    };

    J._App = null;

    J.registerApp = function( App ) {
        J._App = App;
    };

    J.getApp = function() {
        if ( J._App ) {
            return J._App;
        } else {
            throw J._makeError( "register", "Register your App with " +
                "J.registerApp( YourApp )", null );
        }
    };

    J._makeError = function( id, msg, err ) {
        var e = new Error( msg + "\nhttps://github.com/jsz1/just/blob/master/README.md#" + id );
        e.justType = id;
        if ( err ) {
            e.originalError = err;
        }
        return e;
    };

    J.l = function() {
        
    };

    J.url = function( url,dataType ) {
        return {
            type: J.types.URL,
            get: function( callback ) {
                var request = new XMLHttpRequest(),
                    response;
                request.open( "GET", url, true );
                request.onload = function() {
                    if(typeof dataType === "undefined") {
                        dataType = J.types.TEXT;
                    }
                    if ( request.status >= 200 && request.status < 400 ) {
                        // Success!
                        if( dataType === J.types.JSON ) {
                            response = JSON.parse(request.responseText);
                        } else if ( dataType === J.types.TEXT ) {
                            response = request.responseText;
                        }
                        callback( {
                            status: J.types.OK,
                            statuz: J.types.HAPPY,
                            statusCode: request.status,
                            data: response
                        } );
                    } else {
                        if( dataType === J.types.JSON ) {
                            response = JSON.parse({ error: request.responseText });
                        } else if ( dataType === J.types.TEXT ) {
                            response = request.responseText;
                        }
                        callback( {
                            status: J.types.NO_GOOD,
                            statuz: J.types.SAD,
                            statusCode: request.status,
                            data: response
                        } );
                    }
                };
                request.onerror = function() {
                    callback( {
                        status: J.types.NO_GOOD,
                        statuz: J.types.SAD,
                        statusCode: request.status,
                        data: request.responseText
                    } );
                };
                request.send();
            }
        };
    };

    J.isFunction = function( functionToCheck ) {
        var getType = {};
        return functionToCheck && getType.toString.call( functionToCheck ) === "[object Function]";
    };

    J.html = function( html ) {
        return {
            type: "HTML",
            get: function( callback ) {
                if ( typeof callback === "undefined" ) {
                    return html;
                } else if ( J.isFunction( callback ) ) {
                    return callback( html );
                } else {
                    return html;
                }
            }
        };
    };

    J.randString = function( n ) {
        var text = "J",
            possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            i = 1;
        for ( i = 1; i < n; i++ ) {
            text += possible.charAt( Math.floor( Math.random() * possible.length ) );
        }
        return text;
    };

    J.parse = function( html, obj ) {
        var specials = {
            intro: "{{#",
            introEnd: "}}",
            outro: "{{/"
        };

        function findMatchingEndTag(start, helper) {
            
            // html.indexOf();
            var firstTagLocation = start + specials.helperTag.length,
                firstTagSection = html.substring(start + specials.helperTag.length),
                endOfFirstTag =  firstTagSection.substring(firstTagSection.indexOf(specials.introEnd) + specials.introEnd.length),
                closingTagsNeeded = 0,
                closingTagLocation = discoverIndedentation();

            function discoverIndedentation(){
                console.log("discoverIndedentation");
                var openTagNext = endOfFirstTag.indexOf(specials.helperTag),
                    closeTagNext = endOfFirstTag.indexOf(specials.endHelperTag);
                    console.log(closingTagsNeeded);
                if(openTagNext === -1) {
                    console.log("open-1");
                    if(closeTagNext === -1) {
                        console.log("close-1");
                        throw J._makeError( "closing_" + helper.tag + "_missing", "Template is missing a matching closing \"" + helper.tag + "\" tag", null );
                    } else {
                        console.log("closed-else");
                        if(closingTagsNeeded > 0){
                            console.log("closed-else>0");
                            endOfFirstTag = endOfFirstTag.replace(specials.endHelperTag,"");
                            console.log(endOfFirstTag);
                            closingTagsNeeded--;
                            return discoverIndedentation();
                        } else {
                            console.log("closed-else=0");
                            return closeTagNext;    
                        }
                        
                    }
                } else {
                    console.log("ELSE ++");
                    endOfFirstTag = endOfFirstTag.replace(specials.helperTag,"");
                    closingTagsNeeded++;
                    return discoverIndedentation();
                }

            }

            return closingTagLocation;
        }

        function setupHelper(helper) {
            specials.helperTag = specials.intro + helper.tag;
            specials.endHelperTag = specials.outro + helper.tag;
            var indexOfStartHelperTag = html.indexOf( specials.helperTag ),
                indexOfEndHelperTag = html.indexOf( specials.endHelperTag ),
                toReplace,
                tempPart,
                toBeParsedA,
                toBeParsed,
                context;
            if(indexOfStartHelperTag === -1) {
                return null;
            }
            indexOfEndHelperTag = findMatchingEndTag(indexOfStartHelperTag, helper);
            console.log(indexOfEndHelperTag);
            context = html.substring(indexOfStartHelperTag,html.indexOf(specials.introEnd)).replace(specials.helperTag,"").trim();
            // this is the part to be replaced out of said template. 
            toReplace = html.substring(indexOfStartHelperTag,indexOfEndHelperTag + specials.endHelperTag.length + specials.introEnd.length);
            tempPart = html.substring(html.indexOf(specials.introEnd) + specials.introEnd.length).trim();
            //whitespace removal
            toBeParsedA = tempPart.substring(0,tempPart.indexOf(specials.endHelperTag)).split("\n");
            for (var i = 0; i < toBeParsedA.length; i++) {
                toBeParsedA[i] = toBeParsedA[i].trim();
            }

            toBeParsed = toBeParsedA.join("");
            // end whitespace removeal
            return { context: context, unparsed: toBeParsed };
        }

        function parseData(tag, data, obj) {
            return data.replace( new RegExp( "{{" + tag + "}}", "g" ), obj );
        }

        function loopData(toParse, objs) {
            var thing,
                freshParse,
                toReturnHTML = [],
                s = "";
            for (var i = 0; i < objs.length; i++) {
                thing = objs[i];
                freshParse = toParse;
                for( s in thing ) {
                    freshParse = parseData(s, freshParse, thing[s]);
                }
                toReturnHTML.push(freshParse);
            }
            return toReturnHTML.join("");
        }
        // parseEachFromHTML(obj);
        // 
        var eachHelper = {
            tag: "each",
            action: function(html, obj, context, unparsed) {
                var newHTML = html;
                newHTML = loopData(unparsed, obj[context]);
                return newHTML;
            }
        };
        var helpers = [
            eachHelper
        ];
        for (var i = 0; i < helpers.length; i++) {
            var helper = helpers[i];
            var helperData = setupHelper(helper);
            if(helperData){
                html = helper.action(html, obj, helperData.context, helperData.unparsed);
                console.log(html)
                //reparse if is inline;
                // i--;    
            }
        }

        return html;
    };


        // var endString = html,
        // s = "";
        // for ( s in obj ) {
        //     endString = endString.replace( new RegExp( "{{" + s + "}}", "g" ), obj[s] );
        // }
        //     return endString;
        // };

    J.extends = function( SuperClass, definitionObj ) {
        var SubClass = makeClass(),
            prop;
        SubClass.prototype = Object.create( SuperClass.prototype );
        prop = "";
        if ( typeof definitionObj !== "undefined" ) {
            for ( prop in definitionObj ) {
                // first letter is uppercase
                if ( prop[0] === prop[0].toUpperCase() ) {
                    // static method
                    SubClass[prop] = definitionObj[prop];
                } else {
                    SubClass.prototype[prop] = definitionObj[prop];
                }
            }
        }
        // Copy properties
        prop = "";
        for ( prop in SuperClass ) {
            SubClass[prop] = SuperClass[prop];
        }

        return SubClass;
    };

    J.isObjectLiteral = function( _obj ) {
        var _test  = _obj;
        return ( typeof _obj !== "object" || _obj === null ?
        false :
        (
            ( function() {
                while ( !false ) {
                    if ( Object.getPrototypeOf(
                        _test = Object.getPrototypeOf( _test )
                        ) === null ) {
                        break;
                    }
                }
                    return Object.getPrototypeOf( _obj ) === _test;
                } )()
            )
        );
    };

    J.isString = function( obj ) {
        return typeof obj === "string";
    };

    J.isEmpty = function( obj ) {

        // null and undefined are "empty"
        if ( obj === null ) {
            return true;
        }

        if ( typeof obj === "undefined" ) {
            return true;
        }

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if ( obj.length > 0 ) {
            return false;
        }
        if ( obj.length === 0 ) {
            return true;
        }

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for ( var key in obj ) {
            if ( hasOwnProperty.call( obj, key ) ) {
                return false;
            }
        }

        return true;
    };

    J.Blueprint = makeClass();

    J.Blueprint.prototype.watcher = null;

    J.Blueprint.prototype.init = function( properties ) {
        this.id = ++J._i;
        this._properties = {};
        for ( var s in properties ) {
            if ( s[0] === "_" ) {
                Object.defineProperty( this._properties, s.substring( 1 ), {
                    value: properties[s],
                    writable: false,
                    enumerable: true,
                    configurable: true
                } );
            } else {
                this._properties[s] = properties[s];
            }
        }
        // this._properties = properties;
    };

    J.Blueprint.prototype.get = function( arg ) {
        return this._properties[arg];
    };

    J.Blueprint.prototype.set = function( key, val ) {
        var oldVal = this._properties[key];
        if ( this._properties[key] !== val ) {
            if ( J.isString( key ) && key[0] === "_" ) {
                Object.defineProperty( this._properties, key.substring( 1 ), {
                    value: val,
                    writable: false,
                    enumerable: true,
                    configurable: true
                } );
            } else {
                this._properties[key] = val;
            }

            if ( this.watcher ) {
                this.watcher.call( this, {
                    key:key,
                    val:val,
                    oldVal:oldVal
                } );
            }
        }
    };

    J.App = makeClass();
    J.App.prototype.init = function() {
        this.events = J.Events();
        this.views = {};
    };

    J.App.prototype.addView = function( name, view ) {
        this.views[name] = view;
        return view;
    };

    J.App.prototype.getView = function( name ) {
        return this.views[name];
    };

    J.App.prototype.getAllViews = function() {
        return this.views;
    };

    J.App.prototype.removeView = function( name ) {
        delete this.views[name];
        return name;
    };

    J.Events = makeClass();
    J.Events.prototype.init = function() {

    };

    // http://stackoverflow.com/questions/5342917
    J.Events.prototype.trigger = function( el, eventName ) {
        var event;
        if ( document.createEvent ) {
            event = document.createEvent( "HTMLEvents" );
            event.initEvent( eventName, true, true );
        }else if ( document.createEventObject ) {// IE < 9
            event = document.createEventObject();
            event.eventType = eventName;
        }
        event.eventName = eventName;
        if ( el.dispatchEvent ) {
            el.dispatchEvent( event );
        }else if ( el.fireEvent ) {// IE < 9
            el.fireEvent( "on" + event.eventType, event );
        }else if ( el[eventName] ) {
            el[eventName]();
        }else if ( el["on" + eventName] ) {
            el["on" + eventName]();
        }
        return el;
    };

    J.Events.prototype.add = function( el, type, handler ) {
        if ( el.addEventListener ) {
            el.addEventListener( type, handler, false );
        }else if ( el.attachEvent ) {// IE < 9
            el.attachEvent( "on" + type, handler );
        }else {
            el["on" + type] = handler;
        }
        return el;
    };

    J.Events.prototype.remove = function( el, type, handler ) {
        if ( el.removeEventListener ) {
            el.removeEventListener( type, handler, false );
        }else if ( el.detachEvent ) {// IE < 9
            el.detachEvent( "on" + type, handler );
        }else {
            el["on" + type] = null;
        }

        return el;
    };

    // Model
    J.Model = makeClass();
    J.Model.prototype = Object.create( J.Blueprint.prototype );

    J.Model.prototype.init = function( properties ) {
        J.Blueprint.prototype.init.call( this, properties );
    };

    J.Model.prototype.toJSON = function() {
        return JSON.stringify( this._properties );
    };

    J.Model.prototype.toObject = function() {
        return this._properties;
    };

    J.View = makeClass();
    J.View.prototype = Object.create( J.Blueprint.prototype );
    J.View.prototype.init = function( el, properties ) {

        if ( typeof properties !== "undefined" ) {
            for ( var s in properties ) {
                if ( s === "template" ) {
                    this.template = properties[s];
                } else if ( s === "bind" ) {
                    this.bindables = properties[s];
                }
            }
        }
        this.el = el;
    };

    J.View.prototype.initBindables = function() {
        var newSelector,
            newId,
            bindablesAttributes,
            i = 0;
        this._bindableMappings = [];
        bindablesAttributes = this.el.querySelectorAll( "[data-j-bindable]" );
        for ( i = 0; i < bindablesAttributes.length; i++ ) {
            newId = J.randString( 5 );
            bindablesAttributes[i].setAttribute( "data-j-bound-id", newId );
            newSelector = bindablesAttributes[i].tagName + "[data-j-bound-id='" + newId + "']";
            this._bindableMappings.push( {
                prop: bindablesAttributes[i].getAttribute( "data-j-bindable" ),
                element: newSelector
            } );
            bindablesAttributes[i].removeAttribute( "data-j-bindable" );
        }
    };

    J.View.prototype.initBindableListeners = function() {
        var actionTarget,
            action,
            target,
            i = 0;
        for ( i = 0; i < this._bindableMappings.length; i++ ) {
            if ( this.bindables.hasOwnProperty( this._bindableMappings[i].prop ) ) {
                actionTarget = this.bindables[this._bindableMappings[i].prop];
                action = actionTarget.substring( 0, actionTarget.indexOf( " " ) );
                target = actionTarget.substring( actionTarget.indexOf( " " ) + 1 );
                addEventToTarget( this, i );
            }
        }
        function addEventToTarget( that, i ) {
            that.el.querySelector( target ).addEventListener( action, function() {
                that.el.querySelector( that._bindableMappings[i].element )
                    .innerText = this.value;
            } );
        }
    };

    J.View.prototype.template = function( templateObj ) {
        if ( typeof templateObj !== "undefined" ) {
            this.template = templateObj;
        } else {
            return this.template;
        }
    };

    J.View.prototype.render = function( data, callback, $to ) {
        var renderArguments,
            finished = function() {
            if ( this.bindables ) {
                this.initBindables.call( this );
                this.initBindableListeners.call( this );
            }
            callback.call( this );
        };
        if ( this.template ) {
            if ( this.template.type === J.types.URL ) {
                renderArguments = arguments;
                this.template.get( function( html ) {
                    if ( html.status === "OK" ) {
                        if ( renderArguments.length === 3 && typeof $to === "string" ) {
                            this.el.querySelector( $to ).innerHTML = J.parse( html.data, data );
                        } else {
                            this.el.innerHTML = J.parse( html.data, data );
                        }

                        J.getApp.Events.trigger( this.el, "renderComplete" );
                        finished.call( this );
                    }
                }.bind( this ) );
            } else if ( this.template.type === J.types.HTML ) {
                this.el.innerHTML = J.parse( this.template.get(), data );
                finished();
            }

        } else {
            throw J._makeError( "template_missing", "View is missing a template", null );
        }
    };

    J.Mediator = makeClass();
    J.Mediator.prototype = Object.create( J.Blueprint.prototype );
    J.Mediator.prototype.init = function( properties ) {
        this._listeners = {};
        this._events = {};
        if ( typeof properties !== "undefined" ) {
            for ( var s in properties ) {
                if ( s === "view" ) {
                    this.view = properties[s];
                    this.view.mediator = this;
                } else if ( s === "events" ) {
                    this._events = properties[s];
                } else if ( s === "listeners" ) {
                    this._listeners = properties[s];
                }
            }
            if ( !J.isEmpty( this._events ) && !J.isEmpty( this._listeners ) ) {
                this.events.call( this );
            }
        }
    };

    J.Mediator.prototype.events = function() {
        var actionTarget,
            action,
            target,
            query,
            missingEvents = [],
            s = "";
        if ( typeof this._events !== "undefined" ) {
            missingEvents = [];
            for ( s in this._events ) {
                if ( this._listeners.hasOwnProperty( this._events[s] ) ) {
                    actionTarget = s;
                    action = actionTarget.substring( 0, actionTarget.indexOf( " " ) );
                    target = actionTarget.substring( actionTarget.indexOf( " " ) + 1 );
                    query = this.view.el.querySelector( target );
                    if ( query ) {
                        query.addEventListener( action, this._listeners[this._events[s]] );
                    } else {
                        missingEvents.push( { action: query } );
                    }
                    // 
                }
            }
        }
    };

    J.Mapper = makeClass();
    J.Mapper.prototype = Object.create( J.Blueprint );
    J.Mapper.prototype.viewMap = {};
    J.Mapper.prototype.singleModelMap = {};
    J.Mapper.prototype.modelMap = {};
    J.Mapper.prototype.mapView = function( name, view, mediator ) {
        this.viewMap[name] = {
            "view": view,
            "mediator": mediator
        };
        // this.viewMap.push( singleMap );
        return this.viewMap[name];
    };

    J.Mapper.prototype.mapAModel = function( name, Model, properties ) {
        var p = typeof properties === undefined ? {} : properties;
        this.singleModelMap[name] = Model( p );
        return this.singleModelMap[name];
    };

    J.Mapper.prototype.getAModel = function( name ) {
        return this.singleModelMap[name];
    };

    J.Mapper.prototype.mapModel = function( name, Model ) {
        this.modelMap[name] = Model;
        return this.modelMap[name];
    };

    J.Mapper.prototype.getModel = function( name, properties ) {
        var p = typeof properties === undefined ? {} : properties;
        return this.modelMap[name]( p );
    };

    function makeClass() {
        return function F( args ) {
            if ( this instanceof F ) {
                if ( typeof this.init === "function" ) {
                    this.init.apply( this, args );
                }
            } else {
                return new F( arguments );
            }
        };
    }

    window.J = J;

    return J;
} ) );
