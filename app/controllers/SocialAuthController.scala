package controllers

import javax.inject.Inject
import com.mohiva.play.silhouette.api._
import com.mohiva.play.silhouette.api.actions.SecuredRequest
import com.mohiva.play.silhouette.api.exceptions.ProviderException
import com.mohiva.play.silhouette.api.repositories.AuthInfoRepository
import com.mohiva.play.silhouette.impl.providers._
import models.{ UserDb, UserRepository }
import models.services.UserService
import play.api.i18n.{ I18nSupport, Messages }
import play.api.libs.json.Json
import play.api.mvc.{ AbstractController, AnyContent, ControllerComponents, Request }
import play.filters.csrf.CSRF.Token
import utils.auth.DefaultEnv

import scala.concurrent.{ ExecutionContext, Future }

/**
 * The social auth controller.
 *
 * @param components             The Play controller components.
 * @param silhouette             The Silhouette stack.
 * @param userService            The user service implementation.
 * @param authInfoRepository     The auth info service implementation.
 * @param socialProviderRegistry The social provider registry.
 * @param ex                     The execution context.
 */
class SocialAuthController @Inject() (
  components: ControllerComponents,
  silhouette: Silhouette[DefaultEnv],
  userService: UserService,
  authInfoRepository: AuthInfoRepository,
  socialProviderRegistry: SocialProviderRegistry,
  userRepo: UserRepository
)(
  implicit
  ex: ExecutionContext
) extends AbstractController(components) with I18nSupport with Logger {

  var loggedUserEmail: String = "user@test.pl"
  //  var loggedUserEmail: String = ""

  /**
   * Authenticates a user against a social provider.
   *
   * @param provider The ID of the provider to authenticate against.
   * @return The result to display.
   */

  def authenticate(provider: String) = Action.async { implicit request: Request[AnyContent] =>
    (socialProviderRegistry.get[SocialProvider](provider) match {
      case Some(p: SocialProvider with CommonSocialProfileBuilder) =>
        p.authenticate().flatMap {
          case Left(result) => Future.successful(result)
          case Right(authInfo) => for {
            profile <- p.retrieveProfile(authInfo)
            user <- userService.save(profile)
            authInfo <- authInfoRepository.save(profile.loginInfo, authInfo)
            authenticator <- silhouette.env.authenticatorService.create(profile.loginInfo)
            value <- silhouette.env.authenticatorService.init(authenticator)
            result <- silhouette.env.authenticatorService.embed(value, Redirect("http://localhost:3000"))
          } yield {
            silhouette.env.eventBus.publish(LoginEvent(user, request))
            userRepo.isEmailExist(user.email.getOrElse("No email")).map(isExist =>
              if (!isExist) {
                userRepo.create(user.firstName.getOrElse("No name"), user.lastName.getOrElse("No last name"), user.email.getOrElse("No email"))
              }
            )
            loggedUserEmail = user.email.getOrElse("No email")
            result
            //            Redirect("http://localhost:3000/?firstName=" + user.firstName + "&lastName=" + user.lastName + "&avatarUrl=" + user.avatarURL)
          }
        }
      case _ => Future.failed(new ProviderException(s"Cannot authenticate with unexpected social provider $provider"))
    }).recover {
      case e: ProviderException =>
        logger.error("Unexpected provider error", e)
        Redirect("http://localhost:3000/").flashing("error" -> Messages("could.not.authenticate"))
    }
  }

  def getLoggedInEmail = Action.async { implicit request =>
    userRepo.getByEmail(loggedUserEmail).map { user: Seq[UserDb] =>
      Ok(Json.toJson(user)).withHeaders(
        "Access-Control-Allow-Origin" -> "*")
    }
  }

  /**
   * Handles the Sign Out action.
   *
   * @return The result to display.
   */
  def signOut = Action { implicit request =>
    //    val result = Redirect(routes.ApplicationController.index())
    loggedUserEmail = ""
    Ok(views.html.home())
  }

}
