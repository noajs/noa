# Just

Just is a fast, small, thoughtfully written javascript MVC Framework. It's has 3 main goals.

To be:
  
  - Everything you need.
  - Solve common problems and pitfalls that large and small apps have.
  - Easy to write.

## Documentation

- [J](#)
- [J.extends`](#)
- [Prototype](#)
- ["Static" Methods](#)
- [The Blueprint](#)
- [Getting and Setting properties](#)
- [The Mapper](#)
- [Data Binding](#)
- [Templating Engine](#)
- [Views](#)
- [Models](#)
- [Events](#)
- [App](#)

### J
* Main `J` Object which contains static methods.

### J.extends`

* Create prototypal inheritance easily: 
 `J.extends(SubClass, Superclass, Class def (optional))`
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

### Prototype
You can add instance methods using the prototype method as you normally would.

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
<div>{{name}}</div>
<p>His name is {{name}}</p>
```
Now you can load this template into your view. 

```javascript
var view = J.View(document.getElementById("content"),{
	template : J.url("templates/hello.html"),
});
```
You can also load the data by plain HTML injected into the view: 

```javascript
var view = J.View(document.getElementById("content"),{
	template : J.html("<div>{{name}}</div><p>His name is {{name}}</p>"),
});
```
Obviously you could use some sort of jQuery or other selectors to get your HTML into this method. 

You can then render your view by passing a data object into your `render` method.

```javascript
view.render({name : "Jimmy"});
```
### Views
You can create a view and link it to a main element. When rendering you can render in context of a child of that view or for the whole view. There is a couple of typical MVC issues with `Views` that we have solved. See `Mediators` below.

```javascript
var view = J.View(document.getElementById("content"),{
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
var Events = J.Events();

// Subscribe
Events.add(document.body,'customEvent',function() {
	console.log("Event triggered")
});
// Trigger
Events.trigger(document.body,'customEvent');
```

### App
You shouldn't need to create the `Event` on your own. It is included with your app object as well as other `App` nessesities. Here is a refactored version of the previous example using the App object for event delegation.

```javascript
var App = J.App();

// Subscribe
App.Events.add(document.body,'customEvent',function() {
	console.log("Event triggered")
});
// Trigger
App.Events.trigger(document.body,'customEvent');
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




