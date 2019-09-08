package controllers

import com.mohiva.play.silhouette.api.Silhouette
import javax.inject._
import models.{ Purchase, PurchaseDetail, PurchaseDetailRepository, PurchaseRepository, ProductRepository, UserRepository }
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
class PurchasesDetailController @Inject() (orderDetailRepo: PurchaseDetailRepository, orderRepo: PurchaseRepository, productRepo: ProductRepository,
  cc: MessagesControllerComponents, silhouette: Silhouette[DefaultEnv])(implicit ec: ExecutionContext)
  extends MessagesAbstractController(cc) {
  val logger: Logger = Logger(this.getClass())

  val orderDetailForm: Form[CreateOrderDetailForm] = Form {
    mapping(
      "order_id" -> number,
      "product_id" -> number,
      "order_product_quantity" -> number
    )(CreateOrderDetailForm.apply)(CreateOrderDetailForm.unapply)
  }

  def get = Action.async { implicit request =>
    orderDetailRepo.list().map { order =>
      Ok(Json.toJson(order))
    }
  }

  def add = Action { implicit request =>
    val order_id = request.body.asJson.get("order_id").as[Long]
    val product_id = request.body.asJson.get("product_id").as[Long]
    val product_quantity = request.body.asJson.get("product_quantity").as[Int]

    val orderDetail = orderDetailRepo.create(order_id, product_id, product_quantity) /*.map(order => {
      Ok(Json.toJson(order)).withHeaders(
        "Access-Control-Allow-Origin" -> "*")
    })*/
    Await.result(orderDetail, Duration.Inf)
    var createdOrderDetail: PurchaseDetail = orderDetail.value.get.get

    Ok(Json.toJson(createdOrderDetail)).withHeaders(
      "Access-Control-Allow-Origin" -> "*")
  }

  def getByOrderId(orderId: Long) = Action.async { implicit request =>
    orderDetailRepo.getByOrderId(orderId).map { order =>
      Ok(Json.toJson(order)).withHeaders(
        "Access-Control-Allow-Origin" -> "*")
    }
  }

  def getById(id: Long) = Action.async { implicit request =>
    orderDetailRepo.getById(id).map { order =>
      Ok(Json.toJson(order))
    }
  }

  def deleteOrderDetail(id: Long) = Action.async { implicit request =>
    orderDetailRepo.delete(id).map { order =>
      Ok(Json.toJson(order)).withHeaders(
        "Access-Control-Allow-Origin" -> "*")
    }
  }

  def deleteOrderDetailAndOrderByOrderId(id: Long) = Action.async { implicit request =>
    orderDetailRepo.deleteByOrderId(id).map {
      orderDetail =>
        orderRepo.delete(id).map {
          order => {}
        }
    }.map {
      _ => Ok(Json.toJson("Deleted order and orderDetails"))
    }
  }
}

case class CreateOrderDetailForm(orderId: Int, productId: Int, orderProductQuantity: Int)