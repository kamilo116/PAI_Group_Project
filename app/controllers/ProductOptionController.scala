package controllers

import javax.inject._
import models.ProductOptionRepository
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.Json
import play.api.mvc._

import scala.concurrent.{ ExecutionContext, Future }

@Singleton
class ProductOptionController @Inject() (productOptionRepo: ProductOptionRepository, cc: MessagesControllerComponents)(implicit ec: ExecutionContext)
  extends MessagesAbstractController(cc) {
  val productOptionForm: Form[CreateProductOptionForm] = Form {
    mapping(
      "product_id" -> number,
      "option_id" -> number,
      "option_group_id" -> number
    )(CreateProductOptionForm.apply)(CreateProductOptionForm.unapply)
  }

  def getProductOptions = Action.async { implicit request =>
    productOptionRepo.list().map { productOption =>
      Ok(Json.toJson(productOption))
    }
  }

  def getProductOptionById(id: Int) = Action.async { implicit request =>
    val productOptions = for {
      maybeProductOption <- productOptionRepo.findById(id)
    } yield (maybeProductOption)

    productOptions.map {
      case (opt) =>
        opt match {
          case Some(productOption) => Ok(Json.toJson(productOption))
          case None => NotFound
        }
    }
  }

  def getProductOptionByGroupId(id: Int) = Action.async { implicit request =>
    productOptionRepo.findByGroupId(id).map { productOptions =>
      Ok(Json.toJson(productOptions))
    }
  }

  def getProductOptionByProductId(id: Int) = Action.async { implicit request =>
    productOptionRepo.findByProductId(id).map { productOptions =>
      Ok(Json.toJson(productOptions))
    }
  }

  def getProductOptionByOptionId(id: Int) = Action.async { implicit request =>
    productOptionRepo.findByOptionId(id).map { productOptions =>
      Ok(Json.toJson(productOptions))
    }
  }

  def create() = Action.async(parse.json) { implicit request =>
    productOptionForm.bindFromRequest.fold(
      errorForm => {
        Future.successful(BadRequest("failed to create product option"))
      },
      productOption => {

        productOptionRepo.create(
          productOption.product_id,
          productOption.option_id,
          productOption.option_group_id
        ).map { _ =>
          Ok("succesfully added new product option")
        }
      }
    )
  }

  def delete(id: Int) = Action {
    productOptionRepo.delete(id)
    Ok("Successfully removed")
  }
  def edit(id: Int) =
    Action.async(parse.json) {
      implicit request =>
        productOptionForm.bindFromRequest.fold(
          _ => {
            Future.successful(BadRequest("failed to update product option."))
          },
          productOption => {
            productOptionRepo.update(models.ProductOption(
              id,
              productOption.product_id,
              productOption.option_id,
              productOption.option_group_id
            )).map({ _ =>
              Ok
            })
          }
        )
    }

}
case class CreateProductOptionForm(product_id: Int, option_id: Int, option_group_id: Int)