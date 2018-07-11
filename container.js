const dependable = require('dependable');
const path = require('path');

const container = dependable.container();

// Adding modules as arrays for dependencies

const simpleDependencies = [
    ['_', 'lodash'], // Instance of dependancy module and name of module
    ['passport', 'passport']
];

// Register each of the dependency module added into the array
simpleDependencies.forEach(function(val) {
    container.register(val[0], function() {
        return require(val[1]);
    });
});

// Laoding the container files which we need to reuse in our files
container.load(path.join(__dirname, '/controllers'));
container.load(path.join(__dirname, '/helpers'));

// Registering our container itself
container.register('container', function() {
    return container;
});

module.exports = container;