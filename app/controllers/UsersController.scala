package controllers

import com.mohiva.play.silhouette.api.Silhouette
import javax.inject._
import models.UserRepository
import play.api.data.Form
import play.api.data.Forms._
import play.api.data.validation.Constraints.{ max, min }
import play.api.libs.json.Json
import play.api.mvc._
import play.api.Logger
import utils.auth.DefaultEnv

import scala.concurrent.{ ExecutionContext, Future }

@Singleton
class UsersController @Inject() (
  repo: UserRepository,
  cc: MessagesControllerComponents, silhouette: Silhouette[DefaultEnv]
)(implicit ec: ExecutionContext)
  extends MessagesAbstractController(cc) {
  val logger: Logger = Logger(this.getClass())

  /**
   * The mapping for the person form.
   */
  // metoda post musi ma parametry takie jak tutaj w mapping, dodatkowo to co w mapping musi sie zgadzac z tym co jest w html pliku w inputText
  val userRegistrationForm: Form[RegistrationUserForm] = Form {
    mapping(
      "name" -> nonEmptyText,
      "surname" -> nonEmptyText,
      "email" -> email
    )(RegistrationUserForm.apply)(RegistrationUserForm.unapply)
  }

  val userLoginForm: Form[LoginUserForm] = Form {
    mapping(
      "email" -> email,
      "password" -> nonEmptyText
    )(LoginUserForm.apply)(LoginUserForm.unapply)
  }

  def updateUser(id: Long) = Action.async { implicit request =>
    val user_name = request.body.asJson.get("user_name").as[String]
    val user_surname = request.body.asJson.get("user_surname").as[String]
    val user_email = request.body.asJson.get("user_email").as[String]

    repo.update(id, user_name, user_surname, user_email).map { product =>
      Ok(Json.toJson(product)).withHeaders(
        "Access-Control-Allow-Origin" -> "*")
    }
  }

  def deleteUser(id: Long) = Action.async { implicit request =>
    repo.delete(id).map { user =>
      Ok(Json.toJson(user)).withHeaders(
        "Access-Control-Allow-Origin" -> "*")
    }
  }

  def getUsers = Action.async { implicit request =>
    repo.list().map { users =>
      Ok(Json.toJson(users)).withHeaders(
        "Access-Control-Allow-Origin" -> "*")
    }
  }
}

case class RegistrationUserForm(name: String, surname: String, email: String)

case class LoginUserForm(email: String, password: String)
