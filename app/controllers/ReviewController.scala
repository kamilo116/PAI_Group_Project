package controllers

import javax.inject._
import models.{ OrderRepository, ReviewRepository }
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.Json
import play.api.mvc._

import scala.concurrent.{ ExecutionContext, Future }

@Singleton
class ReviewController @Inject() (
  reviewRepo: ReviewRepository,
  orderRepo: OrderRepository,
  cc: MessagesControllerComponents)(implicit ec: ExecutionContext)
  extends MessagesAbstractController(cc) {
  val reviewForm: Form[CreateReviewForm] = Form {
    mapping(
      "order_id" -> number,
      "product_id" -> number,
      "mark" -> number,
      "review_content" -> nonEmptyText
    )(CreateReviewForm.apply)(CreateReviewForm.unapply)
  }

  def getReviews = Action.async { implicit request =>
    reviewRepo.list().map { review =>
      Ok(Json.toJson(review))
    }
  }

  def getReviewById(id: Int) = Action.async { implicit request =>
    val options = for {
      maybeReview <- reviewRepo.findById(id)
    } yield (maybeReview)

    options.map {
      case (opt) =>
        opt match {
          case Some(review) => Ok(Json.toJson(review))
          case None => NotFound
        }
    }
  }

  def getIsOrderReviewed(order_id: Int) = Action.async { implicit request =>
    reviewRepo.isOrderAlreadyRated(order_id).map {
      case (opt) =>
        opt match {
          case true => Ok(Json.toJson("true"))
          case false => Ok(Json.toJson("false"))
        }
    }
  }

  def getReviewByProductId(id: Int) = Action.async { implicit request =>
    reviewRepo.findByProductId(id).map { order =>
      Ok(Json.toJson(order))
    }
  }

  def create() = Action.async(parse.json) { implicit request =>

    reviewForm.bindFromRequest.fold(
      errorForm => {
        Future.successful(BadRequest("failed to create review"))
      },
      review => {
        //todo add to order
        reviewRepo.create(
          review.order_id,
          review.product_id,
          review.mark,
          review.review_content,
        ).map { _ =>
          orderRepo.updateReviewValue(review.order_id.toLong)
          Ok("succesfully added new review")
        }
      }
    )
  }

  def delete(id: Int) = Action {
    reviewRepo.delete(id)
    Ok("Successfully removed")
  }
  def edit(id: Int) =
    Action.async(parse.json) {
      implicit request =>
        reviewForm.bindFromRequest.fold(
          _ => {
            Future.successful(BadRequest("failed to update review."))
          },
          review => {
            reviewRepo.update(models.Review(
              id,
              review.order_id,
              review.product_id,
              review.mark,
              review.review_content
            )).map({ _ =>
              Ok
            })
          }
        )
    }

}
case class CreateReviewForm(order_id: Int, product_id: Int, mark: Int, review_content: String)