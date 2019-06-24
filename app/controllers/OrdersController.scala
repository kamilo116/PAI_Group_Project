package controllers

import com.mohiva.play.silhouette.api.Silhouette
import models.{ Order, OrderRepository, User }
import javax.inject._
import play.api.Logger
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.Json
import play.api.mvc._
import utils.auth.DefaultEnv

import scala.concurrent.duration.Duration
import scala.concurrent.{ Await, ExecutionContext, Future }
import scala.util.{ Failure, Success }

@Singleton
class OrdersController @Inject() (
  orderRepo: OrderRepository /*, userRepo: UserRepository*/ ,
  cc: MessagesControllerComponents, silhouette: Silhouette[DefaultEnv])(implicit ec: ExecutionContext)
  extends MessagesAbstractController(cc) {
  val logger: Logger = Logger(this.getClass())

  val orderForm: Form[CreateOrderForm] = Form {
    mapping(
      "user_id" -> number,
      "order_date" -> nonEmptyText,
      "order_address" -> nonEmptyText,
      "is_reviewed" -> boolean
    )(CreateOrderForm.apply)(CreateOrderForm.unapply)
  }

  def get = Action.async { implicit request =>
    orderRepo.list().map { order =>
      Ok(Json.toJson(order)).withHeaders(
        "Access-Control-Allow-Origin" -> "*")
    }
  }

  def getByUserId(userId: Long) = Action.async { implicit request =>
    orderRepo.getByUserId(userId).map { order =>
      Ok(Json.toJson(order)).withHeaders(
        "Access-Control-Allow-Origin" -> "*")
    }
  }

  def add = Action { implicit request =>
    val user_id = request.body.asJson.get("user_id").as[Long]
    val order_address = request.body.asJson.get("order_address").as[String]

    val order = orderRepo.create(user_id, order_address, false) /*.map(order => {
//      Ok(Json.toJson(order)).withHeaders(
//        "Access-Control-Allow-Origin" -> "*")
//    })*/
    Await.result(order, Duration.Inf)
    var createdOrder: Order = order.value.get.get

    Ok(Json.toJson(createdOrder)).withHeaders(
      "Access-Control-Allow-Origin" -> "*")
  }

}

case class CreateOrderForm(userId: Int, orderDate: String, orderAddress: String, is_reviewed: Boolean)
