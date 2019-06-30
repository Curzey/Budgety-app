
/*
** Architecture: Module pattern. 
* Budget Controller: Handles the inputtet data.
* UI Controller: Handles the view part of the data
* Controller: Connects the above, and handles the app in general.
*/



var budgetController = (function() {



})();


var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value  
            } 
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    }
    
})();


var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOMstrings = UICtrl.getDOMstrings();
        
        // Call ctrlAddItem() on add btn click
        document.querySelector(DOMstrings.inputBtn).addEventListener('click', ctrlAddItem);
        
        // Call ctrlAddItem() on enter keypress
        document.addEventListener('keypress', function(event) {
            if (event.keyCode == 13 || event.which == 13) {
                ctrlAddItem();
            }
        });
    };


    var ctrlAddItem = function() {
        // 1. Get the field input data
        var input = UICtrl.getInput();

        // 2. Add the item to the budget controller
        // 3. Add the item to the UI
        // 4. Calculate the budget
        // 5. Display the budget in the UI

        console.log(input);
    };

    return {
        init: function() {
            console.log('App has started.');
            setupEventListeners();
        }
    };


})(budgetController, UIController);

// Initialize app
controller.init();