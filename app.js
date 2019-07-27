
/*
**# Architecture: Module pattern. 
*** Budget Controller: Contains and handles the data structure (DATA MODULE)
*** UI Controller: Updates the UI (UI MODULE)
*** Controller: Connects the above, and handles the app in general, with it's event handlers.
*/

/*
*** To be done ***
** Finish course.
** Add webpack and update to ES6
** Add a way of saving data (maybe in a key)
** Add a way of resetting everything (use case: next month, new salary)
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

    // Local helper: calculates total expense/income
    var calculateTotal = function(type) {
        var sum = 0;

        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });

        // Set global data structure total value
        data.totals[type] = sum;
    }

    // Overall data
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1 //nonexistant.
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

        },

        calculateBudget: function() {

            // Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);                
            } else {
                data.percentage = -1; //nonexistant
            }

        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
            }
        },

        test: function() {
            console.log(data); // simply for testing.
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
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

        clearFields: function() {
            var fields, fieldsArr;

            // Set list of field elements
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            // Change the above to an array
            fieldsArr = Array.prototype.slice.call(fields);

            // Reset each item value 
            fieldsArr.forEach(function(current, index, array) {
                current.value = '';
            });

            fieldsArr[0].focus(); // Sets focus back to first input field

        },

        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';                
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '-';                                
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

    var updateBudget = function() {

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget in the UI
        UICtrl.displayBudget(budget);

    };

    var ctrlAddItem = function() {

        // 1. Get the field input data
        var input = UICtrl.getInput();

        // Only execute if description and value is valid
        var VALIDATION = input.description !== '' && !isNaN(input.value) && input.value > 0;
        if (VALIDATION) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    
            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);
    
            // 4. Clear the fields
            UICtrl.clearFields();
    
            // 5. Calc and update budget
            updateBudget();
        }

    };

    return {
        init: function() {
            console.log('App has started.');

            // Reset UI.
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1,
            });

            setupEventListeners();
        }
    };


})(budgetController, UIController);

// Initialize app
controller.init();