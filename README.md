![Just](https://raw.githubusercontent.com/jsz1/just/master/just.png)
Just is a fast, small, thoughtfully written javascript MVC Framework. It's has 3 main goals.
  
  - To be everything you need.
  - To solve common problems and pitfalls that large and small apps have.
  - To be easy to write.

## Documentation

- [J](#j)
- [J.extends`](#jextends)
- ["Static" Methods](#static-methods)
- [The Blueprint](#the-blueprint)
- [Getting and Setting properties](#getting-and-setting-properties)
- [super](#_super)
- [The Mapper](#the-mapper)
- [Data Binding](#data-binding)
- [Templating Engine](#templating-engine)
- [Views](#views)
- [Models](#models)
- [Events](#events)
- [App](#app)

# Just
Just has **0** dependecies. IE >= 9 is supported. JQuery is not required to use Just. However if you happen to be using JQuery (if the JQuery object is available), Just will use it to support browsers < IE 9.  Bottom line: Just add JQuery for <=IE8.

### J
* Main `J` Object which contains static methods.

### J.extends`

* Create inheritance easily: 
 `J.extends(Superclass, Class def (optional))`
 Example:
 
```javascript
var TinyModel = J.extends(MiniModel, {
	bump : function() {
		console.log("bumpping")
	}, 

	init : function() {
		console.log("initting Tiny Model")
	}
});

```
You can read this as `TinyModel` will extend or inherit from `MiniModel`.

When creating a class definition you can create a constructor with an `init` method as in the the previous example. 

You can create an instance of the previous class like so: 

```javascript
tm = TinyModel();
tm.dance();
tm.bump();
```
You can also add instance methods using the prototype method as you normally would.

```javascript
var TinyModel = J.extends(MiniModel);

TinyModel.prototype.init = function() {
	console.log("Being created")
}

tm = TinyModel();
```

### "Static" Methods
You can create static methods by capitalizing the name of the method you create. 

```javascript
var TinyModel = J.extends(MiniModel, {
	bump : function() {
		console.log("bumpping")
	}, 

	Plus : function(a,b) {
		return a + b
	},

	init : function() {
		console.log("initting Tiny Model")
	}
});

tm = TinyModel();
console.log(TinyModel.Plus(1,2));
```
### The Blueprint
Everything in `J` extends from the `Blueprint` object.

### Getting and Setting properties
You can initialize `Blueprint` with getters and setters. 

```javascript
var blueprint = J.Blueprint({

});
```

The `Blueprint` object/class gives everything that inherits it the ability to `get` and `set` properties. Those properties can then be watched for changes. 

```javascript
//inherit from the Blueprint
var SomeModel = J.extends(J.Blueprint);

//create a new Some Model
var sm = SomeModel();

//Listen for changes to properties of some model
sm.watcher = function(key,val) {
	console.log("sm change","key:",key, "sm changed to:",val)
}
console.log(sm.get("name")); // undefined
sm.set("name","John") // sm change key: name sm changed to: John
console.log(sm.get("name")); // John
sm.set("name","Frank") // sm change key: name sm changed to: frank
console.log(sm.get("name")); // Frank
```

You can create read only properties by creating a property starting with an underscore. This will create the properties sans underscore as a getter only. 
```javascript
var Blue = J.extends(J.Blueprint);
var blue = Blue({
	name : "John",
	age : 25,
	_i : 0
});

console.log(
	blue.get("name"),
	blue.get("age"),
	blue.get("i"));
// John 25 0

	blue.set("name","Jeff");
	blue.set("age",30);
	blue.set("i",20);
	blue.set("_winner",false);
	blue.set("winner",true);
// Object {name: "Jeff", age: 30, i: 0, winner: false}

console.log(
	blue.get("name"),
	blue.get("age"),
	blue.get("i"),
	blue.get("winner"));
// Jeff 30 0 false
```

#### `_super`
When you inherit from `Blueprint` you will have a `_super` method avaiable to you. You can use it to call the parent class method and override your own. Here is a basic implementation.
```javascript
var container = document.getElementsByClassName("container")[2];
var View = J.extends(J.View, {
	render: function(data) {
		this._super(J.View,"render",[data]);
	}
});
```
`this._super` takes the `SuperClass` as the first parameter. The name of the function as a string as the second parameter and the parameters you want to pass to said function as an array. In this example we are passing just one parameter to the super call. Then we can call `render` on our instance of our custom `View` class

```javascript
var view = app.addView("list",View({
	el: container,
	template: "sometemplate.html#item"
}));

view.render({link:"google.com",
	name:{
		first:"jeff",
		middle: {
			initial: "B",
			full:"Benjamin"
		},
		last:"Johnston",
		quote:"and you know he was a good dog.",
		nickname: "Jacky"
	}
});
```
See more on template rendering below.


### The Mapper
You can use the `Mapper` class to get back a single instance of your model, or a new instance of your model. Make sure to create a single instance of a new `Mapper` with something like this: 

```javascript
var mapper = J.Mapper();
```

Then you add models to it with two methods `mapAModel` which will always return the same instance of a model. The mapper will instantiate it for you. You also have `mapModel` which will also instantiate a new model everytime you grab the model back. You can retrieve models with `getAModel` and `getModel`. 

```javascript
var mapper = J.Mapper();
var SomeModel = J.extends(J.Blueprint);
mapper.mapAModel("some",SomeModel);
var oneModel = mapper.getAModel("some"); //give it a name. Mapping "some" model.
oneModel.set("name","john");
console.log(oneModel.get("name")); // returns John
var sameModel = mapper.getAModel("some"); // get that same instance on a new variable. 
console.log(sameModel.get("name")) // returns John. We are dealing with the same instance as before.
```

### Data Binding
You can setup to have data binding between different fields. Initialize a view with a `el` and setup your template and bindings. 

```javascript
var view = J.View(document.getElementById("content"),{
	bind : {
		"name" : "keyup #name-input"
	}
});
```
This will bind the `name` property to the `keyup` of `#name-input`.

In your HTML you can setup an element to receive that data like so: 

```html
<div data-j-bindable="name"></div>
<input type="text" id="name-input" />
```
Using `data-j-bindable` means that anything that is populating a name property will appear in that div. 

### Templating Engine
You can create dynamic templates in HTML. You can use your own templating engine as well but to use the built in one just create a template file. For example `templates/hello.html`

```html
<!-- somefile.html -->
*/list\*
<ul></ul>
*\list/*

*/item\*
<li><a href="{link}">
	A dog named {name.first} {name.middle.full|capitalize} {name.last|capitalize}
	<p>{name.quote|titleize}</p>
	<p>AKA: {name.nickname|camelCase}</p>
</a></li>
*\item/*
```
You can tell Just where to find your templates. 

```javascript
J.registerApp( J.App() );
var app = J.getApp();
app.config = {
	root: "http://localhost:3000",
	templates: "http://localhost:3000/templates"
};
```
With this info in hand Just will make a url request for your templates, but only when you render. You tell Just which template on the page you want to grab. `*/templatename\*` refers to the template name and wrap the end with `*\templatename/*`. You can then grab the template like so
```javascript
var container = document.getElementsByClassName("container")[2];
var View = J.extends(J.View);
var view = app.addView("list",View({
	el: container,
	template: "somefile.html#item", //#item refers to the template name.
}));
```
Notice that our view can grab variables. You can wrap the variable with a single curly brace to add a variable in there.

We also added a filter to our variable using the pipe `|`. There are a few included filters. You can add your own very easily. 

```javascript
J.addFilter("camelCase",function(str){
	return str.replace(/^([A-Z])|\s(\w)/g, function(match, p1, p2, offset) {
	if (p2) return p2.toUpperCase();
	return p1.toLowerCase();        
	});
});
```

### Views
You can create a view and link it to a main element. When rendering you can render in context of a child of that view or for the whole view. There is a couple of typical MVC issues with `Views` that we have solved. See `Mediators` below.

```javascript
var view = J.View({
	el: document.getElementById("content"),
	template : J.html("<div>{{name}}</div>");
});
```


### Models
`Blueprint` and `Model` are similar but `Model` is meant for being the M in MVC. You can set all of it's properties at creation time. You can do this for the model and when creating the model through the `Mapper`.

```javascript
var mapper = J.Mapper();
var mainModel = mapper.mapAModel("mainModel",J.Model,{
	"height" : 50
});
mainModel.set("name","Jeffery")
mainModel.set("name2","John")

var otherModel = J.Model({
	color : "#9b59b6",
	size : {
		height : 50,
		width : 25
	}
});
```
Models also have a `toJSON()` method and `toObject()` method. 

```javascript
var otherModel = J.Model({
	color : "#9b59b6",
	size : {
		height : 50,
		width : 25
	}
});
J.l(otherModel.toObject());
J.l(otherModel.toJSON());
```
We also have a convenience method you'll notice from the last example `J.l` which pipes directly to `console.log`. It's just easier to type. 

### Events
We have cross browser events available and you would (but won't have to see `App` below) create 1 event class/object for app wide event triggering and listening. 

```javascript
// New instance of Events class.
var events = J.Events();

// Subscribe
events.add(document.body,'customEvent',function() {
	console.log("Event triggered")
});
// Trigger
events.trigger(document.body,'customEvent');
```

### App
You shouldn't need to create the `Event` on your own. It is included with your app object as well as other `App` nessesities. Here is a refactored version of the previous example using the App object for event delegation.

```javascript
var App = J.App();

// Subscribe
App.events.add(document.body,'customEvent',function() {
	console.log("Event triggered")
});
// Trigger
App.events.trigger(document.body,'customEvent');
```
You can set config values on your `App`.
```javascript
J.registerApp( J.App() );
var app = J.getApp();
app.config = {
	root: "http://localhost:3000",
	templates: "http://localhost:3000/templates"
};
```

### Mediator
The Mediator (sometimes called the controller) is listening on behalf of the view and communicates with Models. The view in MVC is supposed to only be dealing with display information. If that's true then we don't do any logic *for* the view on the view. The problem in typical javascript MVC frameworks is that it is hard to tell the difference between the HTML view and the javascript view. Well in **Just**, we have solved that. You'll typically have one of two situations: 

1. You have your HTML written already and you just need to listen for events (buttons to be click, and text to be typed). 
2. You have an empty HTML element you want to populate with some data from the server. And it may change over time. 

In the case of #1 you can use the `Mediator`. In that case your **View** is your HTML, since it alone is responsible for displaying data. The `Mediator` will listen to changes on your HTML view like it is supposed to do. 
In the case of #2 you can use the `View` class and attach a `Mediator` to your view. You'll use template files to render your html. In that case your HTML is called templates and the responsibility of making things appear on the screen is left to your `View` class. 

All that to say you can use your `Mediator` class in two ways. 

1. Where it acts with the view as the HTML. In that case you'll pass an HTML element to your `Mediator`. 

2. Where you have a view responsible for populating the template. In that case you'll pass a view class to the `Mediator`.
