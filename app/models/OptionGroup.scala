package models

import play.api.libs.json.Json

case class OptionGroup(
  option_group_id: Int,
  option_group_name: String
)

object OptionGroup {
  implicit val optionGroupFormat = Json.format[OptionGroup]
}
