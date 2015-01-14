// Helper method to make sure the grid size input is always
// an integer, and also to make sure this observable value
// is always numeric
ko.roundedIntegerObservable = function(initialValue) {
    var _actual = ko.observable(initialValue);
    var result = ko.dependentObservable({
        read: function() {
            return _actual();
        },
        write: function(newValue) {
            var parsedValue = parseFloat(newValue);
            _actual(isNaN(parsedValue) ? newValue : Math.round(parsedValue));
        }
    });
    return result;
};

// If I understand correctly, I could an extender for this too...