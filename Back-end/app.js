let mysql = require("mysql");
let express = require("express");
let bodyparser = require("body-parser");
let server = express();
let cors = require("cors");
const { application } = require("express");

//  server.use(server.json());
 server.use(express.urlencoded({ extended: true }));

// server.use(bodyparser.urlencoded({ extended: true }));

server.use(cors());
server.use(express.json())

let PORT = 1234;
server.listen(
  PORT,
  console.log(`Server connected to: http://localhost:${PORT}`)
);

let mysqulConnection = mysql.createConnection({
  user: "myDBuser",
  password: "myDBuser",
  host: "127.0.0.1",
  database: "mydb",
});

mysqulConnection.connect((err) => {
  if (err) console.log(err);
  else console.log("Connected to data base");
});

server.get("/install", (req, res) => {
  let createProducts = `CREATE TABLE if not exists Products(
        product_id int auto_increment,
        product_url varchar(255) not null,
        product_name varchar(255) not null,
        PRIMARY KEY (product_id)
    )`;

  let createProductsDiscription = `CREATE TABLE if not exists ProductsDescription(
    description_id int auto_increment,
    product_id int(11) not null,
    product_brief_description TEXT not null,
    product_description TEXT not null,
    product_img varchar(255) not null,
    product_link varchar(255) not null,
    PRIMARY KEY (description_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
  )`;

  let creatProductPrice = `CREATE TABLE if not exists ProductPrice(
        price_id int auto_increment,
        product_id int(11) not null,
        starting_price varchar(255) not null,
        price_range varchar(255) not null,
        PRIMARY KEY (price_id),
        FOREIGN KEY (product_id) REFERENCES Products(product_id)
    )`;

  let createUser = `CREATE TABLE if not exists User(
        user_id int auto_increment,
        user_name TEXT not null,
        user_password varchar(255) not null,
        PRIMARY KEY (user_id)
    )`;

  let createOrders = `CREATE TABLE if not exists Orders(
      order_id int auto_increment,
      product_id int(11) not null,
      user_id int(11) not null,
      PRIMARY KEY (order_id),
      FOREIGN KEY (product_id) REFERENCES Products(product_id),
      FOREIGN KEY (user_id) REFERENCES User(user_id)
     )`;

  mysqulConnection.query(createProducts, (err, result, fields) => {
    if (err) console.log(err);
  });

  mysqulConnection.query(createProductsDiscription, (err, result, fields) => {
    if (err) console.log(err);
  });

  mysqulConnection.query(creatProductPrice, (err, result, fields) => {
    if (err) console.log(err);
  });

  mysqulConnection.query(createUser, (err, result, fields) => {
    if (err) console.log(err);
  });

  mysqulConnection.query(createOrders, (err, result, fields) => {
    if (err) console.log(err);
  });
  res.end("<h1>Tables are Created</h1>");
});

server.post("/add-product", (req, res) => {
  res.send("its working");
   console.log(req.body);

    distrtucture;
  const {
    product_name,
    product_url,
    product_discription,
    product_brief_description,
    product_img,
    product_link,
    starting_price,
    price_range,
    user_name,
    user_password,
  } = req.body;

  let addToProduct = `INSERT INTO Products (product_url, product_name) VALUES ("${product_url}","${product_name}")`;

  mysqulConnection.query(addToProduct, (err, result) => {
    if (err) throw err;
    console.log("Product Tabel Created");
  });

  let addToUser = `INSERT INTO User (user_name,user_password) VALUES ('${user_name}','${user_password}')`;

  mysqulConnection.query(addToUser, (err, result) => {
    if (err) throw err;
    console.log("user info added");
  });

  mysqulConnection.query(
    `SELECT * FROM products WHERE product_name='${product_name}'`,
    (err, rows, fields) => {
      //extracting forign key
       console.log(rows);
      let productAdded_id = rows[0].product_id;

      mysqulConnection.query(
        `SELECT * FROM User WHERE user_name='${user_name}'`,
        (err, rows, fields) => {
          let userAdded_id = rows[0].user_id;

          // console.log(userAdded_id);

          let insertOrders = `INSERT INTO Orders (product_id,user_id) VALUES ('${productAdded_id}','${userAdded_id}')`;

          mysqulConnection.query(insertOrders, (err, result, fields) => {
            if (err) throw err;
          });
        }
      );

      let insertProductDiscription = `INSERT INTO ProductsDescription (product_id, product_brief_description, product_description, product_img, product_link) VALUES ('${productAdded_id}', '${product_brief_description}', '${product_discription}','${product_img}', '${product_link}')`;

      let insertProductPrice = `INSERT INTO ProductPrice (product_id, starting_price, price_range) VALUES ('${productAdded_id}', '${starting_price}', '${price_range}')`;

      mysqulConnection.query(
        insertProductDiscription,
        (err, result, fields) => {
          if (err) throw err;
        }
      );

      mysqulConnection.query(insertProductPrice, (err, result, fields) => {
        if (err) throw err;
      });
    }
  );
  // res.end("data inserted into the the table");
  // console.log("data inserted into table");
});

server.get("/data", (req, res) => {
  mysqulConnection.query(
    "SELECT * FROM Products JOIN ProductsDescription JOIN ProductPrice ON Products.product_id = ProductsDescription.description_id AND Products.product_id = ProductPrice.price_id",
    (err, results, fields) => {
      if (err) console.log("Error When Selecting", err);

      // console.log(results);
      res.send(results);
    }
  );
});
