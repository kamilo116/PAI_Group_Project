package controllers

import javax.inject._
import models.OptionGroupRepository
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.Json
import play.api.mvc._

import scala.concurrent.{ ExecutionContext, Future }

@Singleton
class OptionGroupController @Inject() (optionGroupRepo: OptionGroupRepository, cc: MessagesControllerComponents)(implicit ec: ExecutionContext)
  extends MessagesAbstractController(cc) {
  val optionGroupForm: Form[CreateOptionGroupForm] = Form {
    mapping(
      "option_group_name" -> nonEmptyText
    )(CreateOptionGroupForm.apply)(CreateOptionGroupForm.unapply)
  }

  def getOptionGroups = Action.async { implicit request =>
    optionGroupRepo.list().map { optionGroup =>
      Ok(Json.toJson(optionGroup))
    }
  }

  def getOptionGroupById(id: Int) = Action.async { implicit request =>
    val options = for {
      maybeOptionGroup <- optionGroupRepo.findById(id)
    } yield (maybeOptionGroup)

    options.map {
      case (opt) =>
        opt match {
          case Some(optionGroup) => Ok(Json.toJson(optionGroup))
          case None => NotFound
        }
    }
  }

  def create() = Action.async(parse.json) { implicit request =>
    optionGroupForm.bindFromRequest.fold(
      errorForm => {
        Future.successful(BadRequest("failed to create option group"))
      },
      optionGroup => {
        optionGroupRepo.create(
          optionGroup.option_group_name
        ).map { _ =>
          Ok("succesfully added new option group")
        }
      }
    )
  }

  def delete(id: Int) = Action {
    optionGroupRepo.delete(id)
    Ok("Successfully removed")
  }

  def edit(id: Int) =
    Action.async(parse.json) {
      implicit request =>
        optionGroupForm.bindFromRequest.fold(
          _ => {
            Future.successful(BadRequest("failed to update option group."))
          },
          optionGroup => {
            optionGroupRepo.update(models.OptionGroup(
              id,
              optionGroup.option_group_name
            )).map({ _ =>
              Ok
            })
          }
        )
    }

}
case class CreateOptionGroupForm(option_group_name: String)