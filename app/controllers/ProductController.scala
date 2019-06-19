package controllers

import com.mohiva.play.silhouette.api.Silhouette
import com.mohiva.play.silhouette.impl.providers.CredentialsProvider
import javax.inject._
import models._
import play.api.data.Form
import play.api.data.Forms._
import play.api.data.validation.Constraints._
import play.api.i18n._
import play.api.libs.json.Json
import play.api.mvc._
import utils.auth.{ DefaultEnv, WithProvider }

import scala.concurrent.{ ExecutionContext, Future }
import scala.util.{ Failure, Success }

class ProductController @Inject() (
  productsRepo: ProductRepository,
  cc: MessagesControllerComponents, silhouette: Silhouette[DefaultEnv])(implicit ec: ExecutionContext)
  extends MessagesAbstractController(cc) {

  def addProduct = Action { implicit request =>
    val product_name = request.body.asJson.get("product_name").as[String]
    val product_description = request.body.asJson.get("product_description").as[String]
    val product_category = request.body.asJson.get("product_category").as[Int]
    val product_price = request.body.asJson.get("product_price").as[Int]

    productsRepo.create(product_name, product_description, product_category, product_price)
    Ok("Added product").withHeaders(
      "Access-Control-Allow-Origin" -> "*")
  }

  def getProducts = Action.async { implicit request =>
    productsRepo.list().map { products =>
      Ok(Json.toJson(products)).withHeaders(
        "Access-Control-Allow-Origin" -> "*")
    }
  }

  def getProduct(id: Long) = Action.async { implicit request =>
    productsRepo.select(id).map { product =>
      Ok(Json.toJson(product)).withHeaders(
        "Access-Control-Allow-Origin" -> "*")
    }
  }

  def updateProduct(id: Long) = Action.async { implicit request =>
    val product_name = request.body.asJson.get("product_name").as[String]
    val product_description = request.body.asJson.get("product_description").as[String]
    val product_category = request.body.asJson.get("product_category").as[Int]
    val product_price = request.body.asJson.get("product_price").as[Int]

    productsRepo.update(id, product_name, product_description, product_category, product_price).map { product =>
      Ok(Json.toJson(product)).withHeaders(
        "Access-Control-Allow-Origin" -> "*")
    }
  }

  def deleteProduct(id: Long) = Action.async { implicit request =>
    productsRepo.delete(id).map { product =>
      Ok(Json.toJson(product)).withHeaders(
        "Access-Control-Allow-Origin" -> "*")
    }
  }
}