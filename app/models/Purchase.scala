package models

import play.api.libs.json.Json

case class Purchase(id: Long, userId: Long, address: String, is_reviewed: Boolean)

object Purchase {
  implicit val orderFormat = Json.format[Purchase]
}