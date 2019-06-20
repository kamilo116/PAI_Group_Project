package models

import play.api.libs.json.Json

case class ProductOption(
  product_option_id: Int,
  product_id: Int,
  option_id: Int,
  option_group_id: Int
)

object ProductOption {
  implicit val productOptionFormat = Json.format[ProductOption]
}
