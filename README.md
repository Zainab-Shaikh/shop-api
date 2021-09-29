# shop-api
used express ,mongoose , mongodb , nodeJs.
### Downoad the project
Run npm i command in your code editor terminal to install node modules and dependencies
### Usind cmd as administrator run the following command to start the mongodb server or wherever your mongodb.exe file is located in your computer ,copy the path and run in the terminal.
"C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe"
### Start the project
run "npm start" in your code editor terminal
### Open Postman
#### for product
1.Send the request on "http://localhost:4000/product" and select the post method
2.Select raw radio button and choose json type from the list in postman and send the data in the json format.
3.Same to get the product details just change the method to "get" request in postman"
#### for order
1.Send the request on "http://localhost:4000/order" and select the post method
2.Select raw radio button and choose json type from the list in postman and send the data in the json format.
3. In Json data use two field first specify quantity and second the product id that you will get from product request in postman ,copy the product id and paste it in the order route json data
4.Same to get the order details just change the method to "get" request in postman"
#### to update the product
1. Select the put method in postman and send the request using product id i.e "http://localhost:4000/product/productId"
#### to delete the product or order
1. Select the delete method in postman and send the request using product id or order id i.e "http://localhost:4000/product/productId" or "http://localhost:4000/product/orderId"
#### to get the specific order or product
1. Select the get method in postman and send the request using product id or order id i.e "http://localhost:4000/product/productId" or "http://localhost:4000/product/orderId"
