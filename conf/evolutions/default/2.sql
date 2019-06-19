# --- !Ups

-- create table "basket" (
--   "id" integer not null primary key autoincrement,
--   "product_id" integer not null,
--   FOREIGN KEY(product_id) REFERENCES product(id)
-- );
--
-- alter table "product" add "key_words" varchar(255);
--
-- # --- !Downs
-- ALTER TABLE product DROP key_words;
-- drop table "basket";
--
