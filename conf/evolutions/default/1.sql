# --- !Ups

CREATE TABLE "category" (
	"id"	integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"name"	TEXT NOT NULL
);

CREATE TABLE "order" (
	"order_id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"user_id"	INTEGER NOT NULL,
	"order_address"	TEXT NOT NULL
);

CREATE TABLE "order_detail" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"order_id"	INTEGER NOT NULL,
	"product_id"	INTEGER NOT NULL,
	"product_quantity"	INTEGER NOT NULL,
	FOREIGN KEY("product_id") REFERENCES "product",
	FOREIGN KEY("order_id") REFERENCES "order"
);

CREATE TABLE "product" (
	"id"	integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"name"	varchar NOT NULL,
	"description"	TEXT NOT NULL,
	"category"	int NOT NULL,
	"price"	INTEGER NOT NULL,
	FOREIGN KEY("category") REFERENCES "category"("id")
);

CREATE TABLE "user" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"name"	TEXT NOT NULL,
	"surname"	TEXT NOT NULL,
	"email"	TEXT NOT NULL
);



# --- !Downs

drop table "product";
drop table "category";
drop table "order";
drop table "order_detail";
drop table "user";