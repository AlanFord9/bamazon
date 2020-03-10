const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  welcome();
});

function welcome() {
    // query the database for all items being auctioned
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
                // "<table><tr>",
                //             "<th>Item-ID</th>",
                //             "<th>Product Name</th>",
                //             "<th>Price</th>",
                //             "<th>Stock</th>",
                //         "</tr>",
                //         "<tr>",
                //             "<td>" + results[i].item_id + "</td>",
                //             "<td>" + results[i].product_name + "</td>",
                //             "<td>" + results[i].price + "</td>",
                //             "<td>" + results[i].stock_quantity + "</td>",
                //         "</tr>",
                //     "</table>"
            );
        }
        // once you have the items, prompt the user for which they'd like to bid on
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
            // get the information of the chosen item
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (results[i].item_id === answer.choice) {
                chosenItem = results[i];
                }
            }
            console.log(chosenItem);
  
            // determine if bid was high enough
            // if (parseInt(answer.quantity) <= chosenItem.stock_quantity) {
            // // bid was high enough, so update db, let the user know, and start over
            //     connection.query(
            //         "UPDATE products SET ? WHERE ?",
            //         [
            //             {
            //             stock_quantity: stock_quantity - answer.quantity
            //             },
            //             {
            //             item_id: chosenItem.item_id
            //             }
            //         ],
            //         function(error) {
            //             if (error) throw err;
            //             console.log("Item purchased successfully!");
            //             welcome();
            //         }
            //     );
            // }
            // else {
            //     // bid wasn't high enough, so apologize and start over
            //     console.log("Not enough in stock!");
            //     welcome();
            // }
        });
    })
}