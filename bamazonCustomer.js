const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "password",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  welcome();
});

function welcome() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            console.log(
                "Item-ID: " +
                results[i].item_id +
                " || Product Name: " +
                results[i].product_name +
                " || Price: " +
                results[i].price +
                " || Stock: " +
                results[i].stock_quantity
            );
        }
        inquirer
            .prompt([
                {
                name: "choice",
                type: "input",
                message: "What is the item-id # you would like to select?"
                },
                {
                name: "quantity",
                type: "input",
                message: "How many of this item would you like?"
                }
            ])
        .then(function(answer) {
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (results[i].item_id == answer.choice) {
                    chosenItem = results[i];
                }
            }
  
            if (parseInt(answer.quantity) <= chosenItem.stock_quantity) {
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                        stock_quantity: chosenItem.stock_quantity - answer.quantity
                        },
                        {
                        item_id: chosenItem.item_id
                        }
                    ],
                        function(error) {
                            if (error) throw err;
                            console.log("Item purchased successfully!");
                            welcome();
                        }
                );
            }
            else {
                console.log("Not enough in stock!");
                welcome();
            }
        });
    })
}