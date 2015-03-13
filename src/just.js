(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['b'], function (b) {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root.amdWebGlobal = factory(b));
        });
    } else {
        // Browser globals
        root.amdWebGlobal = factory(root.b);
    }
}(this, function (b) {
    //use b in some fashion.
    var a = {a:2}
    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return {};
}));