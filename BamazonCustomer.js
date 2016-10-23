var mysql = require('mysql');
var prompt = require('prompt');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'Bamazon'
});

connection.connect(function(err) {
    if (err) throw err;
});

function displayInventory() {
	connection.query('SELECT * FROM Products', function(err, res) {
        if (err) throw err;
        console.log("====================");
        console.log("Bamazon Inventory");
        console.log("====================");
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].ItemID +
            " | Product: " + res[i].ProductName +
            " | Department: " + res[i].DepartmentName +
            " | Price: $" + res[i].Price +
            " | Quantity: " + res[i].StockQuantity);
        }

        inquirer.prompt([
        
        	{
        		type: 'input',
        	    message: 'Which item would you like to purchase? Enter Item ID.',
        	    name: 'id'
        	},
        	{
        		type: 'input',
        	    message: 'How many would you like to purchase?',
        	    name: 'quantity'
        	}

        ]).then(function(order) {
        	var quantity = order.quantity;
        	var itemId = order.id;
        	connection.query('SELECT * FROM Products WHERE ItemID=' + itemId, function(err, selectedItem) {
        		if (err) throw err;
        		if (selectedItem[0].StockQuantity - quantity >= 0) {
        			console.log("Quantity in Stock: " + selectedItem[0].StockQuantity + " Order Quantity: " + quantity);
                    console.log("You will be charged $" + (order.quantity * selectedItem[0].Price) + ". Thank you for shopping at Bamazon. Come back soon!");
                    connection.query('UPDATE Products SET StockQuantity=? WHERE ItemID=?', [selectedItem[0].StockQuantity - quantity, itemId], function(err, inventory) {
                    	if (err) throw err;
                    	displayInventory();
                    });
        		}
        		else {
        			console.log("Insufficient quantity. Please enter a valid amount.");
        			displayInventory();
        		};
        	});
        });
    });
};

displayInventory();
