
/*
**# Architecture: Module pattern. 
*** Budget Controller: Contains the data structure
*** UI Controller: Gets and sets data
*** Controller: Connects the above, and handles the app in general.
*/



var budgetController = (function() {

    // Expense constructor
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Income constructor
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Overall data
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            // Create new ID
            // if data has any items of the type, set id to be length + 1, or else set id to 0.
            ID = data.allItems[type].length > 0 
                ? data.allItems[type][data.allItems[type].length - 1].id + 1 
                : 0;

            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);                
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // Push new item into data structure
            data.allItems[type].push(newItem);

            // Return new element
            return newItem;
        }
    };
    
})();


var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value  
            } 
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';                
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

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
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);

        // 4. Calculate the budget

        // 5. Display the budget in the UI

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