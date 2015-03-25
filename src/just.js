/*jslint browser:true */
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

    J.EventTypes = {
        "View.TEMPLATE_PARSED" : "View.TEMPLATE_PARSED",
        "URL.COMPLETE" : "URL.COMPLETE",
        "Mediator.ADDED" : "Mediator.ADDED"
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

    J.isJQueryAvailable = function() {
        return typeof jQuery !== "undefined";
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

    J.Filter = {
        titleize: function(str) {
            return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        },
        capitalize: function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    };

    J.addFilter = function(name,filter){
        J.Filter[name] = filter;
    };

    J.template = function( template, data, typeOfTemplate, callback ) {
        var templateNameSplit = template.split("#"),
            appTemplatesPath = J.getApp().config.templates;
        if ( typeof typeOfTemplate === "undefined" || typeOfTemplate === J.types.URL ) {
            // if they use trailing slashes then use trailing slashes.
            if(appTemplatesPath[appTemplatesPath.length-1] !== "/"){
                appTemplatesPath += "/" + templateNameSplit[0];
            } else {
                appTemplatesPath += templateNameSplit[0] + "/";
            }

            J.url(appTemplatesPath).get(function(response){
                callback(J.compile(response.data, templateNameSplit[1], data));
            });
        } else if( typeOfTemplate === J.types.HTML ) {
            callback(J.compile(this.template, templateNameSplit[1], data));
        }
    };

    J.bindTemplate = function(mediator, el) {
        var matchers = {
            mediatorEvents: /on(\S)*\="{mediator\.([\S\s]+?)}"/g,
            mediatorInBracketsAndQuotes: /\"{([\S\s]+?)}\"/g
        };
        var results,
            bracketExec,
            resultSplit,
            methodToCall,
            randIds = [],
            html = el.innerHTML;

        results = html.match(matchers.mediatorEvents);
        if(results){
            for (var i = 0; i < results.length; i++) {
                resultSplit = results[i].split("=");
                html = html.replace(resultSplit[0]+"=","");
                while(( bracketExec = matchers.mediatorInBracketsAndQuotes.exec(resultSplit[1])) !== null){
                    methodToCall = bracketExec[1].replace("mediator.","");
                    var randId = J.randString(9);
                    html = html.replace(bracketExec[0],"data-just-event=\"" + randId + "\"");
                    randIds.push({
                        id: randId,
                        methodToCall: methodToCall
                    });
                }
            }            
        }

        
        el.innerHTML = html;
        
        for (var j = 0; j < randIds.length; j++) {
            if(J.isJQueryAvailable()){
                $(el).on("click","[data-just-event='" + randIds[j].id + "']", 
                    mediator._listeners[randIds[j].methodToCall]);
            } else {
                el.querySelector( "[data-just-event='" + randIds[j].id + "']" )
                    .addEventListener( "click", mediator._listeners[randIds[j].methodToCall]);    
            }
        }
    };

    J.compile = function( componentSource, templateName, obj ) {
        var matchers = {
            componentStart: /\*\/([\S\s]+?)\\\*/g,
            componentEnd: /\*\\([\S\s]+?)\/\*/g,
            inBetween: new RegExp("\\*\\/" + templateName + "\\\\\\*([\\S\\s]+?)\\*\\\\" + templateName + "\\/\\*", "g"),
            brackets: /{([\S\s]+?)}/g
        };
        var result,
            toParse = "",
            prop,
            propSplit,
            propAndFilter,
            filter,
            skipBracket = false,
            filterAddon,
            thisObj;

        while ((result = matchers.componentStart.exec(componentSource)) !== null) {
            if(result[1] === templateName){
                var inside;
                while ((inside = matchers.inBetween.exec(componentSource)) !== null) {
                    toParse = inside[1];
                    break;
                }
                break;
            }
        }
        var bracketVals = toParse.match(matchers.brackets);
        if(!bracketVals){
            return toParse;
        }
        for (var i = 0; i < bracketVals.length; i++) {
            while(prop = matchers.brackets.exec( bracketVals[i] )) {
                skipBracket = false;
                prop = prop[1];
                propAndFilter = null;
                filter = null;
                if(prop.indexOf("|") !== -1){
                    propAndFilter = prop.split("|");
                    prop = propAndFilter[0];
                    filter = propAndFilter[1];
                    if(J.Filter.hasOwnProperty(filter)){
                        filter = J.Filter[filter];
                    } else {
                        filter = null;
                    }
                }

                if(prop.indexOf(".") !== -1){
                    // Let's grab the insides of objects by splitting them by dots.
                    propSplit = prop.split(".");
                    thisObj = obj;
                    for (var j = 0; j < propSplit.length; j++) {
                        if( thisObj.hasOwnProperty( propSplit[j] ) ){
                            thisObj = thisObj[propSplit[j]];    
                        } else {
                            // Most likely an event listener bracket.
                            skipBracket = true;
                            continue;
                        }
                        
                    }
                    if(skipBracket){
                        // Most likely an event listener bracket.
                        continue;
                    }
                    if(filter){
                        thisObj = filter(thisObj);
                        filterAddon = "\\|" + propAndFilter[1];
                    } else {
                        filterAddon = "";
                    }
                    toParse = toParse.replace(new RegExp("{" + prop + filterAddon + "}", "g"), thisObj);
                } else {
                    if( obj.hasOwnProperty( prop ) ) {
                        thisObj = obj[prop];    
                    } else {
                        continue;
                    }
                    
                    if(filter){
                        thisObj = filter(thisObj);
                        filterAddon = "\\|" + propAndFilter[1];
                    } else {
                        filterAddon = "";
                    }
                    toParse = toParse.replace(new RegExp("{" + prop + filterAddon + "}", "g"), obj[prop]);
                }
            }
        }
        return toParse;
    };

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
    J._IEVersion = null;
    J.IEVersion = function() {
        if(J._IEVersion){
            return J._IEVersion;
        }
        if(document.all && !window.XMLHttpRequest){
            // IE6  or older
            return J._IEVersion = "<=6";
        } else if (document.all && !document.querySelector){
            // IE7  or older
            return J._IEVersion = "<=7";
        } else if(document.all && !document.addEventListener){
            // IE8  or older
            return J._IEVersion = "<=8";
        } else if(document.all && !window.atob){
            // IE9  or older
            return J._IEVersion = "<=9";
        } else if(document.all) {
            // 10 or older
            return J._IEVersion = "<=10";
        }
    };

    J.isIE = function(userAgent) {
        // Works for the IE's that we have to worry about.
        userAgent = userAgent || navigator.userAgent;
        return userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1;
    };

    J.IEAtLeast = function(num) {
        // Why would anyone ever need at least version 6 of IE? I have no idea.
        if(num === 6){
            if(J.IEVersion() === "<=6" || J.IEVersion() === "<=7" || J.IEVersion() === "<=8" || J.IEVersion() === "<=9" || J.IEVersion() === "<=10"){
                return true;
            }
        }
        if(num === 7){
            if(J.IEVersion() === "<=7" || J.IEVersion() === "<=8" || J.IEVersion() === "<=9" || J.IEVersion() === "<=10"){
                return true;
            }
        } else if(num === 8){
            if(J.IEVersion() === "<=8" || J.IEVersion() === "<=9" || J.IEVersion() === "<=10"){
                return true;
            }    
        } else if(num === 9){
            if(J.IEVersion() === "<=9" || J.IEVersion() === "<=10"){
                return true;
            }    
        } else if(num === 10) {
            if(J.IEVersion() === "<=10"){
                return true;
            }
        }
        return false;
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
    };

    J.Blueprint.prototype._super = function(SuperClass,toCall,params){
        SuperClass.prototype[toCall].apply(this,params);
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
        this.mediators = {};
        this.config = {
            root: document.URL,
            template: document.URL + "/templates"
        };
        this.templateCache = {};
    };

    J.App.prototype.addView = function( name, view ) {
        this.views[name] = view;
        return view;
    };

    J.App.prototype.addMediator = function( view, mediator ) {
        this.mediators[view] = mediator;
        this.views[view].mediator = mediator;
        J._App.events.trigger(this.views[view].el, J.EventTypes["Mediator.ADDED"],
        {
                mediator: mediator,
                view: view
        });
        return mediator;
    };

    J.App.prototype.config = function( configObj ) {
        if(configObj !== "undefined"){
            this.config = configObj;    
        } else {
            return this.config;
        }  
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
    J.Events.prototype.trigger = function( el, eventName, data ) {
        var event;
        if ( window.document.createEvent ) {

            if(typeof data !== "undefined") {
                if(J.isJQueryAvailable()){
                    $(el).trigger(eventName, data);
                    return $(el);
                }
                if( J.IEAtLeast(9) || J.isIE() ){
                    event = window.document.createEvent(eventName);
                    event.initCustomEvent(eventName, false, false, data);
                } else {
                    event = new CustomEvent(eventName, {
                        detail: data 
                    });
                    el.dispatchEvent(event);
                    return el;
                }
            } else {
                if(J.isJQueryAvailable()){
                    $(el).trigger(eventName);
                    return $(el);
                }
                event = document.createEvent( "HTMLEvents" );
                event.initEvent( eventName, true, true );
            }
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
        if(J.isJQueryAvailable()){
            $(el).on(type, handler);
            return $(el);
        }
        if ( el.addEventListener ) {
            el.addEventListener( type, handler, false );
            return el;
        }else if ( el.attachEvent ) {// IE < 9
            if(J.isJQueryAvailable()){
                $(el).on(type, handler);
                return $(el);
            }
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
            if(J.isJQueryAvailable()){
                $(el).off(type, handler);
                return;
            } else {
                el.detachEvent( "on" + type, handler );    
            }
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
    J.View.prototype.init = function( properties ) {
        J.Blueprint.prototype.init.call( this );
        if ( typeof properties !== "undefined" ) {
            for ( var s in properties ) {
                if ( s === "template" ) {
                    this.template = properties[s];
                } else if ( s === "bind" ) {
                    this.bindables = properties[s];
                } else if ( s === "el" ) {
                    this.el = properties[s];
                }
            }
        }
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

    J.View.prototype.render = function( data, type ) {
        var renderedHTML;
        if(!this.template){
            throw J._makeError( "template_missing", "View is missing a template", null );
        }
        J.template(this.template, data, type, function(rendered){
            renderedHTML = rendered;
            J._App.events.trigger(this.el, "View.TEMPLATE_PARSED",{
                data: renderedHTML
            });
            
            this.el.innerHTML = renderedHTML;
            
            // bind the events on this element to this mediator
            J.bindTemplate(this.mediator, this.el);
        }.bind(this));
            // finished = function() {
            //     if ( this.bindables ) {
            //         this.initBindables.call( this );
            //         this.initBindableListeners.call( this );
            //     }
            // };
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

            if( !J.isEmpty( this._listeners ) ) {}
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
                    if(J.isJQueryAvailable()){
                        query = $(target);
                    } else {
                        query = this.view.el.querySelectorAll( target );
                    }

                    if ( query ) {
                        if(J.isJQueryAvailable()){
                            query.on(action, this._listeners[this._events[s]]);
                        } else {
                            for (var i = 0; i < query.length; i++) {
                                query[i].addEventListener( action, this._listeners[this._events[s]] );
                            }
                        }
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

    J.Effects = {};
    J.Effects.slideDown = function (element, duration, finalheight, callback) {
        var s = element.style;
        s.height = "0px";

        var y = 0,
            framerate = 10,
            one_second = 1000,
            interval = one_second*duration/framerate,
            totalframes = one_second*duration/interval,
            heightincrement = finalheight/totalframes,
            tween = function () {
            y += heightincrement;
            s.height = y + "px";
            if (y < finalheight) {
                setTimeout(tween,interval);
            } else {
                callback();
            }
        };
        tween();
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
