package models

import play.api.libs.json.Json

case class Order(id: Long, userId: Long, address: String)

object Order {
  implicit val orderFormat = Json.format[Order]
}