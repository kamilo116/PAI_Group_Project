package models

import play.api.libs.json._

case class Review(
  review_id: Int,
  order_id: Int,
  product_id: Int,
  mark: Int,
  review_content: String
)

object Review {
  implicit val userFormat = Json.format[Review]
}
