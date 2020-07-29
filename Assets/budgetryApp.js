
var budgetController = (function(){

	var Expense = function(id, description, value){

		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	Expense.prototype.calPercentage = function(totalinc){
		
		
		if (totalinc > 0){
			this.percentage = Math.round((this.value/totalinc)*100) ;
		}else{
			this.percentage = -1;
		}
		
	};

	Expense.prototype.getPercent = function(){
		return this.percentage

	};

	var Income = function(id, description, value){

		this.id = id;
		this.description = description;
		this.value = value;
	};

	var calcTotals = function(type){

		var sum;
		sum = 0;

		data.allItems[type].forEach(function(cur){
			sum += cur.value;

		});

		data.totals[type] = sum;
		



	}

	var data = {
		allItems : {

		 	exp : [],
		 	inc : []
		 },
		
		totals : {

			exp : 0,
			inc : 0
		},

		budget : 0,
		percentage : 0
	}

	return {

		addItem : function(type, des, val){

			var newItem,ID;
			

			if (data.allItems[type].length > 0){

				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
				
			}else{

				ID = 0;
			}

			if (type == 'exp'){

				newItem = new Expense(ID, des, val);
			}else{

				newItem = new Income(ID, des, val);
			}

			data.allItems[type].push(newItem);

			return newItem;

		},

		delItem : function(type, ID){
			var delIndex;
			data.allItems[type].forEach(function(current, index){

				if (current.id == ID){

					delIndex = index;
				}
			});

			data.allItems[type].splice(delIndex, 1);
			//console.log(data);
		},

		calcBudget : function(){

			// Calculate total income and expense
			calcTotals('inc');
			calcTotals('exp');
			// Calculate Budget = Income - Expense 
			data.budget = data.totals.inc - data.totals.exp;
			// Calculate percentage
			if (data.totals.inc > 0){

				data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
			}else{

				data.percentage = -1;
			}
		},

		calcPercent : function(){

			var perc =[];
			// 1. Iterate complete array of exp and cal and store its percent in percentage prop

			data.allItems.exp.forEach(function(cur){

				cur.calPercentage(data.totals.inc)
			});

			data.allItems.exp.forEach(function(cur){

				perc.push(cur.percentage)
			});

			return perc;

		},

		getBudget : function(){

			return{
				income : data.totals.inc,
				expense : data.totals.exp,
				budget : data.budget,
				percentage : data.percentage
			}
		}
	}

})();

var UIController = (function(){

	var DOMstrings = {

		inputType : '.add__type',
		inputDescription : '.add__description',
		inputValue : '.add__value',
		inputBtn : '.add__btn',
		incomeContainer :'.income__list',
		expenseContainer:'.expenses__list',
		budget:'.budget__value',
		income:'.budget__income--value',
		expense:'.budget__expenses--value',
		percent: '.budget__expenses--percentage',
		container:'.container',
		expPercentLabel: '.item__percentage',
		dateLabel: '.budget__title--month'
	};

	var formatNum = function(num, type){
		var sign, number;
		num = Math.abs(num);
		num = num.toFixed(2);

		var intDec = num.split('.');
		int = intDec[0];
		dec = intDec[1];

		if (int.length > 5){

			int = int.substr(0,int.length - 5) + ',' + int.substr(int.length-5, 2) + ',' + int.substr(int.length-3, 3);
		}else if (int.length > 3){

			int = int.substr(0,int.length-3) + ',' + int.substr(int.length-3,3);
		}

		type === 'exp' ? sign = '-' : sign = '+';

		number = sign + ' ' + int + '.' + dec;
		return(number);


	};

	return {

		getDom: function(){
			return DOMstrings
		},

		getInput: function(){

			return {

				type: document.querySelector(DOMstrings.inputType).value,
				description: document.querySelector(DOMstrings.inputDescription).value,
				value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
			}
		},

		addListItem : function(obj, type){

			var html, newHtml, element;
			//create HTML string with placeholders

			if (type == 'inc'){

				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}else {

				element = DOMstrings.expenseContainer;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			};
			//Repalce the palceholders with actual values

			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNum(obj.value, type) );
			
			//Add the updted HTML to the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
		},

		delListItem : function(ID){

			var el;
			el = document.getElementById(ID);

			el.parentNode.removeChild(el);
		},

		clearField: function(){

			var fields;
			fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

			ArrFields = Array.prototype.slice.call(fields);

			ArrFields.forEach(function(current, index, arr){

				current.value = '';
			});

			document.querySelector(DOMstrings.inputDescription).focus();
		},

		UIbudgetupdate: function(obj){
			var type;
			if (obj.budget > 0){
				type = 'inc'
			}else{
				type = 'exp'
			}
			document.querySelector(DOMstrings.budget).textContent = formatNum(obj.budget, type ) ;
			document.querySelector(DOMstrings.income).textContent = formatNum(obj.income, 'inc') ;
			document.querySelector(DOMstrings.expense).textContent = formatNum(obj.expense, 'exp') ;
			

			if (obj.percentage > 0){
				document.querySelector(DOMstrings.percent).textContent = obj.percentage + '%';
			}else{
				document.querySelector(DOMstrings.percent).textContent = '--';
			}
		},

		dispDate : function(){

			var now, month, year;

			now = new Date();
			year = now.getFullYear();
			month = now.getMonth();
			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
			//console.log(now);
			document.querySelector(DOMstrings.dateLabel).innerHTML = '<strong>'+months[month] + " " + year +'</strong>';

		},

		inputFormChange : function(){

			document.querySelector(DOMstrings.inputType).classList.toggle('red-focus');
			document.querySelector(DOMstrings.inputDescription).classList.toggle('red-focus');
			document.querySelector(DOMstrings.inputValue).classList.toggle('red-focus');
			document.querySelector(DOMstrings.inputBtn).classList.toggle('red');



		},

		displayPercent: function(arr){

			var el;
			el = document.querySelectorAll(DOMstrings.expPercentLabel);
			for (var i=0; i < el.length; i++){

				if (arr[i] > 0){
					el[i].textContent = arr[i] + '%';
				}else{
					el[i].textContent = '--';
				}
				
			}
		}
	}

})();

var controller = (function(budgetCtrl, UICtrl){

	
	

	


	var setUpEventListeners = function(){
	
		var DOM = UICtrl.getDom();
	
		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function(e){

			if (e.keyCode === 13 || e.which === 13){

				ctrlAddItem();
		}
		});

		document.querySelector(DOM.container).addEventListener('click', ctrlDelItem);
		document.querySelector(DOM.inputType).addEventListener('change', UICtrl.inputFormChange);
	};

	var updateBudget = function(){

		// 1. Calculate budget in the budget controller
		budgetCtrl.calcBudget();

		// 2. return the budget
			
		var budget = budgetCtrl.getBudget();

		// 3. Upadte the the UI to diplay the budget
		UICtrl.UIbudgetupdate(budget);

	};

	var updatePercent = function(){
		var percentages;
		// 1. Calculate the percent

		// 2. Read the percent from the budget controller
		percentages = budgetCtrl.calcPercent();
		// 3. Update the UI with the percentage
		UICtrl.displayPercent(percentages);

	};
	

	var ctrlAddItem = function(){

			//Take input
			var input = UICtrl.getInput();

			if (input.description !='' && !isNaN(input.value) && input.value!== 0){

				//Add Item to budget controller
				var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
			
				//Add Item to the UI
				UICtrl.addListItem(newItem, input.type);

				// Clear the fields
				UICtrl.clearField();

				// Update the budget
				updateBudget();

				// Update the percent
				updatePercent();

			}
			
	};

	var ctrlDelItem = function(event){

		var typeID, arr, type, ID;
		
		typeID = event.target.parentNode.parentNode.parentNode.parentNode.id;  /* We are travelling up in DOM so that we select complete element to be deleted */

		// ID is present only in element with class container
		if (typeID) {

			
			arr = typeID.split('-');
			type = arr[0];
			ID = arr[1];

			// Delete item from budget controller
			budgetCtrl.delItem(type, ID);

			//Delete item from UI
			UICtrl.delListItem(typeID);

			//Recalculate the budget
			updateBudget();

			// Update the percent
			updatePercent();
		}
	};
	
	return {

		init : function(){

			// Sets values to 0 upon loading
			UICtrl.UIbudgetupdate({
				income : 0,
				expense : 0,   
				budget : 0,
				percentage : '---'			
			});
			UICtrl.dispDate();
			return setUpEventListeners()
		}
	}

})(budgetController, UIController);

controller.init();  						//Public initialization function

