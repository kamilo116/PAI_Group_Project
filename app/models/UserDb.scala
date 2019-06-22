package models

import play.api.libs.json.Json

case class UserDb(id: Long, name: String, surname: String, email: String, password: String,
  country: String, street: String, city: String, address: String, postal: String)

object UserDb {
  implicit val userFormat = Json.format[UserDb]
}