package controllers

import javax.inject._
import models.OptionRepository
import models.OptionGroupRepository
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.Json
import play.api.mvc._
import scala.concurrent.{ ExecutionContext, Future }

@Singleton
class OptionController @Inject() (optionRepo: OptionRepository, cc: MessagesControllerComponents)(implicit ec: ExecutionContext)
  extends MessagesAbstractController(cc) {
  val optionForm: Form[CreateOptionForm] = Form {
    mapping(
      "option_group_id" -> number,
      "option_value" -> nonEmptyText
    )(CreateOptionForm.apply)(CreateOptionForm.unapply)
  }

  def getOptions = Action.async { implicit request =>
    optionRepo.list().map { option =>
      Ok(Json.toJson(option))
    }
  }

  def getOptionById(id: Int) = Action.async { implicit request =>
    val options = for {
      maybeOption <- optionRepo.findById(id)
    } yield (maybeOption)

    options.map {
      case (opt) =>
        opt match {
          case Some(option) => Ok(Json.toJson(option))
          case None => NotFound
        }
    }
  }

  def getOptionByOptionGroupId(id: Int) = Action.async(
    implicit request => (
      optionRepo.findByGroupId(id).map(
        option => Ok(Json.toJson(option))
      )
    )
  )

  def create() = Action.async(parse.json) { implicit request =>
    optionForm.bindFromRequest.fold(
      errorForm => {
        Future.successful(BadRequest("failed to create option"))
      },
      option => {

        optionRepo.create(
          option.option_group_id,
          option.option_value
        ).map { _ =>
          Ok("succesfully added new option")
        }
      }
    )
  }

  def delete(id: Int) = Action {
    optionRepo.delete(id)
    Ok("Successfully removed")
  }
  def edit(id: Int) =
    Action.async(parse.json) {
      implicit request =>
        optionForm.bindFromRequest.fold(
          _ => {
            Future.successful(BadRequest("failed to update option."))
          },
          option => {
            optionRepo.update(models.Option(
              id,
              option.option_group_id,
              option.option_value
            )).map({ _ =>
              Ok
            })
          }
        )
    }
}
case class CreateOptionForm(option_group_id: Int, option_value: String)