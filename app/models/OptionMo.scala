package models

import play.api.libs.json.Json

case class OptionMo(
  option_id: Int,
  option_group_id: Int,
  option_value: String
)

object OptionMo {
  implicit val optionFormat = Json.format[OptionMo]
}
