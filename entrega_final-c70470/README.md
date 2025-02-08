Comandos MongoDB

Comando de apoyo
mongod
show dbs
use < db name>
db (obj de la base de datos en la que estamos usando)
show collections
db.createCollection()
db.dropDatabase()
dn.collection.drop()
Comandos para un crud:
use productos
db.createCollection("productos")
db.productos.insertOne({ nombre: "Lápiz", descripcion: "Lápiz de grafito negro", precio: 0.5 })
db.productos.insertMany([ { nombre: "Bolígrafo", descripcion: "Bolígrafo azul", precio: 0.7 }, { nombre: "Goma de borrar", descripcion: "Goma de borrar blanca", precio: 0.3 } ])
db.productos.find().pretty()
db.productos.find({nombre: "Lápiz"}).pretty()
db.productos.findOne({nombre: "Bolígrafo"})
db.productos.updateOne({nombre: "Lápiz"}, {$set: {precio: 0.7}})
db.productos.deleteOne({nombre: "Lápiz"})
Conteo de datos
db.productos.countDocuments() (exacto)
db.productos.estimatedDocumentCount() (aprox)
buscar con condición
db.productos.insertMany([ { nombre: "Laptop Dell", categoria: "Tecnología", precio: 800 }, { nombre: "Refrigerador Samsung", categoria: "Electrodomésticos", precio: 400 } ])

db.productos.find({ categoria: "Tecnología" }).pretty()

Busquedas mas complejas
db.coll.find( {key: {$operator: val}} ) con: $and $or $lt $lte $gt $gte $ne $eq $exists $in $nin $size $all $elemMatch

Ejemplo con producto:

db.productos.insertMany([ { name: "Laptop", price: 800, brand: "Apple", categoria: "electrónica", colors: ["silver", "gold", "space gray"] }, { name: "Smartphone", price: 700, brand: "Samsung", categoria: "electrónica", colors: ["black", "white", "blue"] }, { name: "Tablet", price: 500, brand: "Amazon", categoria: "ropa", colors: ["black", "red"] }, { name: "Headphones", price: 200, brand: "Bose", categoria: "electrónica", colors: ["black", "silver"] }, { name: "Smartwatch", price: 400, brand: "Apple", categoria: "ropa", colors: ["rojo", "verde", "azul"] } ]);

db.products.find({ $and: [ {categoría: "electrónica"}, {precio: {$gt: 50}} ] })
db.products.find({ $or: [ {categoría: "electrónica"}, {precio: {$gt: 50}} ] })
db.products.find({precio: {$lt: 50}})
db.products.find({precio: {$lte: 50}})
db.products.find({precio: {$gt: 50}})
db.products.find({precio: {$gte: 50}})
db.products.find({categoría: {$ne: "electrónica"}})
db.products.find({categoría: {$eq: "electrónica"}})
db.products.find({descripción: {$exists: true}})
db.products.find({categoría: {$in: ["electrónica", "ropa"]}})
db.products.find({categoría: {$nin: ["electrónica", "ropa"]}})
db.products.find({colores: {$size: 3}})
db.products.find({colores: {$all: ["rojo", "verde", "azul"]}})
db.products.find({ tallas: { $elemMatch: { $gt: "M", $lt: "XL" } } })
Busquedas avanzadas
db.coll.distinct( val )
db.coll.find({doc.subdoc:value})
db.coll.find({name: /^Max$/i})
db.products.insertMany([
{ "name": "Laptop", "price": 800, "brand": "Apple" },
{ "name": "Smartphone", "price": 700, "brand": "Samsung" },
{ "name": "Tablet", "price": 500, "brand": "Amazon" },
{ "name": "Headphones", "price": 200, "brand": "Bose" },
{ "name": "Smartwatch", "price": 400, "brand": "Apple" } ])

db.products.distinct("brand")

db.products.find({"brand": "Apple"}): devuelve todos los documentos que tienen "brand" igual a "Apple".

db.products.find({"name": /^Smart/i}): devuelve todos los documentos que tienen "name" que comienzan con "Smart". La búsqueda es case-insensitive por la bandera i al final de la expresión regular.

db.products.find({$and: [{"price": {$gt: 500}}, {"brand": "Apple"}]}): devuelve todos los documentos que tienen "price" mayor a 500 y "brand" igual a "Apple".

db.products.find({$or: [{"brand": "Apple"}, {"brand": "Bose"}]})

db.products.find({$lt: {"price": 600}})
db.products.find({$lte: {"price": 500}})
db.products.find({$gt: {"price": 500}})
db.products.find({$gte: {"price": 500}})
db.products.find({$ne: {"brand": "Samsung"}})
db.products.find({$eq: {"brand": "Apple"}})
db.products.find({$exists: {"brand": true}})
Update
db.products.updateOne({ "_id": 1 }, { $set: { "price": 900 }})
db.products.updateOne({ "_id": 2 }, { $unset: { "brand": "" }})
db.products.updateOne({ "_id": 3 }, { $inc: { "price": 100 }})
db.products.updateOne({ "_id": 4 }, { $rename: { "price": "cost" }})
db.products.updateOne({ "_id": 5 }, { $mul: { "price": 1.2 }})
db.products.updateOne({ "_id": 1 }, { $min: { "price": 800 }})
db.products.updateOne({ "_id": 2 }, { $max: { "price": 600 }})
db.products.updateMany( { "brand": "Apple" }, { $set: { "price": 900 } } )
db.products.updateMany( { "brand": "Apple" }, { $unset: { "brand": "" } } )
db.products.updateMany( { "brand": "Apple" }, { $inc: { "price": 100 } } )
db.products.updateMany( { "brand": "Apple" }, { $min: { "price": 500 } } )
db.products.updateMany( { "brand": "Apple" }, { $max: { "price": 1000 } } )
db.products.updateMany( { "brand": "Apple" }, { $mul: { "price": 1.2 } } )
db.products.updateMany( {}, { $rename: { "brand": "manufacturer" } } )
Delete
Ejemplo:

db.products.deleteOne({"_id": 1})
db.products.deleteOne({"brand": "Apple"})
db.products.deleteMany({"brand": "Apple"})
db.products.deleteMany({"price": {$lt: 500}})


Esta preentrega fue aprobada pero algunas cosas no funcionaban del todo bien, no recuerdo si descargué los enunciados que había que hacer. Este llegó hasta mongo DB, integracion de socket(no lo entendía y nunca funcionó), las consultas estan redactadas en el .HTTP que lo usaba como postman. 