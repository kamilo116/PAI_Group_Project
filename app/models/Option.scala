package models

import play.api.libs.json.Json

case class Option(
  option_id: Int,
  option_group_id: Int,
  option_value: String
)

object Option {
  implicit val optionFormat = Json.format[Option]
}
