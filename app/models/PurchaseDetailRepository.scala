package models

import java.sql.Timestamp

import javax.inject.{ Inject, Singleton }
import play.api.Logger
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.JdbcProfile

import scala.concurrent.{ ExecutionContext, Future }

@Singleton
class PurchaseDetailRepository @Inject() (dbConfigProvider: DatabaseConfigProvider, orderRepository: PurchaseRepository, productRepository: ProductRepository)(implicit ec: ExecutionContext) {

  // We want the JdbcProfile for this provider
  protected val dbConfig = dbConfigProvider.get[JdbcProfile]

  val logger: Logger = Logger(this.getClass())

  // These imports are important, the first one brings db into scope, which will let you do the actual db operations.
  // The second one brings the Slick DSL into scope, which lets you define the table and other queries.
  import dbConfig._
  import orderRepository.OrderTable
  import productRepository.ProductTable
  import profile.api._

  private class OrderDetailTable(tag: Tag) extends Table[PurchaseDetail](tag, "purchase_detail") {

    /** The ID column, which is the primary key, and auto incremented */
    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

    def purchase_id = column[Long]("purchase_id")

    def product_id = column[Long]("product_id")

    def purchase_date = column[Timestamp]("date")

    def purchase_product_quantity = column[Int]("amount")

    def purchase_fk = foreignKey("purchase_fk", purchase_id, order)(_.id)

    def product_fk = foreignKey("product_fk", product_id, product)(_.id)

    def * = (id, purchase_id, product_id, purchase_product_quantity) <> ((PurchaseDetail.apply _).tupled, PurchaseDetail.unapply)
  }

  private val orderDetail = TableQuery[OrderDetailTable]

  private val order = TableQuery[OrderTable]

  private val product = TableQuery[ProductTable]

  def create(orderId: Long, productId: Long, amount: Int): Future[PurchaseDetail] = db.run {
    // We create a projection of just the name and age columns, since we're not inserting a value for the id column
    (orderDetail.map(p => (p.purchase_id, p.product_id, p.purchase_product_quantity))
      // Now define it to return the id, because we want to know what id was generated for the person
      returning orderDetail.map(_.id)
      // And we define a transformation for the returned value, which combines our original parameters with the
      // returned id
      into { case ((orderId, productId, orderProductQuantity), id) => PurchaseDetail(id, orderId, productId, orderProductQuantity) }
    ) += ((orderId, productId, amount))
  }

  def list(): Future[Seq[PurchaseDetail]] = db.run {
    orderDetail.result
  }

  def getById(id: Long): Future[Seq[PurchaseDetail]] = db.run {
    orderDetail.filter(_.id === id).result
  }

  def getByOrderId(order_id: Long): Future[Seq[PurchaseDetail]] = db.run {
    orderDetail.filter(_.purchase_id === order_id).result
  }

  def delete(id: Long): Future[Int] = {
    val q = orderDetail.filter(_.id === id).delete
    db.run(q)
  }

  def deleteByOrderId(id: Long): Future[Int] = {
    val q = orderDetail.filter(_.purchase_id === id).delete
    db.run(q)
  }

}
