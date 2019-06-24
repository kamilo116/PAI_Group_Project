package controllers

import com.mohiva.play.silhouette.api.Silhouette
import javax.inject._
import models.{ UserDb, UserRepository }
import play.api.data.Form
import play.api.data.Forms._
import play.api.data.validation.Constraints.{ max, min }
import play.api.libs.json.Json
import play.api.mvc._
import play.api.Logger
import utils.auth.DefaultEnv

import scala.concurrent.duration.Duration
import scala.concurrent.{ Await, ExecutionContext, Future }

@Singleton
class UsersController @Inject() (
  userRepository: UserRepository,
  cc: MessagesControllerComponents, silhouette: Silhouette[DefaultEnv]
)(implicit ec: ExecutionContext)
  extends MessagesAbstractController(cc) {
  val logger: Logger = Logger(this.getClass())
  var loggedUserEmail: String = "user@test.pl"

  /**
   * The mapping for the person form.
   */
  // metoda post musi ma parametry takie jak tutaj w mapping, dodatkowo to co w mapping musi sie zgadzac z tym co jest w html pliku w inputText
  val userRegistrationForm: Form[RegistrationUserForm] = Form {
    mapping(
      "name" -> nonEmptyText,
      "surname" -> nonEmptyText,
      "email" -> email,
      "password" -> nonEmptyText,
      "country" -> nonEmptyText,
      "street" -> nonEmptyText,
      "city" -> nonEmptyText,
      "address" -> nonEmptyText,
      "postal" -> nonEmptyText
    )(RegistrationUserForm.apply)(RegistrationUserForm.unapply)
  }

  val userLoginForm: Form[LoginUserForm] = Form {
    mapping(
      "email" -> email,
      "password" -> nonEmptyText
    )(LoginUserForm.apply)(LoginUserForm.unapply)
  }

  def registration = Action.async { implicit request =>
    userRegistrationForm.bindFromRequest().fold(
      errorForm => {
        Future.successful(
          Ok("Error register user")
        )
      },
      u => {
        userRepository.create(u.name, u.surname, u.email, u.password,
          u.country, u.street, u.city, u.address, u.postal)
          .map { _ =>
            Redirect(routes.ApplicationController.index()).flashing("success" -> "user.created")
          }
      }
    )
  }

  def getUser = Action.async { implicit request =>
    userRepository.getByEmail(loggedUserEmail).map { user: Seq[UserDb] =>
      Ok(Json.toJson(user)).withHeaders(
        "Access-Control-Allow-Origin" -> "*")
    }
  }

  def login = Action { implicit request =>
    val provided_email = request.body.asJson.get("email").as[String]
    val provided_password = request.body.asJson.get("password").as[String]

    val user = userRepository.getByEmailAndPassword(provided_email, provided_password) /*.map { user =>
      Ok("true").withHeaders(
        "Access-Control-Allow-Origin" -> "*")
    }*/

    Await.result(user, Duration.Inf)
    val userResult: Seq[UserDb] = user.value.get.get

    Ok(Json.toJson(userResult)).withHeaders(
      "Access-Control-Allow-Origin" -> "*")
  }

  def signOut = Action { implicit request =>
    //    val result = Redirect(routes.ApplicationController.index())
    loggedUserEmail = ""
    Ok(views.html.home())
  }

  def updateUser(id: Long) = Action.async { implicit request =>
    val user_name = request.body.asJson.get("user_name").as[String]
    val user_surname = request.body.asJson.get("user_surname").as[String]
    val user_email = request.body.asJson.get("user_email").as[String]
    //TODO
    userRepository.update(id, user_name, user_surname, user_email).map { product =>
      Ok(Json.toJson(product)).withHeaders(
        "Access-Control-Allow-Origin" -> "*")
    }
  }

  def deleteUser(id: Long) = Action.async { implicit request =>
    userRepository.delete(id).map { user =>
      Ok(Json.toJson(user)).withHeaders(
        "Access-Control-Allow-Origin" -> "*")
    }
  }

  def getUsers = Action.async { implicit request =>
    userRepository.list().map { users =>
      Ok(Json.toJson(users)).withHeaders(
        "Access-Control-Allow-Origin" -> "*")
    }
  }
}

case class RegistrationUserForm(name: String, surname: String, email: String, password: String,
  country: String, street: String, city: String, address: String, postal: String)

case class LoginUserForm(email: String, password: String)
