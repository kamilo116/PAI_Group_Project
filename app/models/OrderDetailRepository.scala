package models

import javax.inject.{ Inject, Singleton }
import play.api.Logger
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.JdbcProfile

import scala.concurrent.{ ExecutionContext, Future }

@Singleton
class OrderDetailRepository @Inject() (dbConfigProvider: DatabaseConfigProvider, orderRepository: OrderRepository, productRepository: ProductRepository)(implicit ec: ExecutionContext) {

  // We want the JdbcProfile for this provider
  protected val dbConfig = dbConfigProvider.get[JdbcProfile]

  val logger: Logger = Logger(this.getClass())

  // These imports are important, the first one brings db into scope, which will let you do the actual db operations.
  // The second one brings the Slick DSL into scope, which lets you define the table and other queries.
  import dbConfig._
  import orderRepository.OrderTable
  import productRepository.ProductTable
  import profile.api._

  private class OrderDetailTable(tag: Tag) extends Table[OrderDetail](tag, "order_detail") {

    /** The ID column, which is the primary key, and auto incremented */
    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

    def order_id = column[Long]("order_id")

    def product_id = column[Long]("product_id")

    def order_product_quantity = column[Int]("product_quantity")

    def order_fk = foreignKey("order_fk", order_id, order)(_.id)

    def product_fk = foreignKey("product_fk", product_id, product)(_.id)

    def * = (id, order_id, product_id, order_product_quantity) <> ((OrderDetail.apply _).tupled, OrderDetail.unapply)
  }

  private val orderDetail = TableQuery[OrderDetailTable]

  private val order = TableQuery[OrderTable]

  private val product = TableQuery[ProductTable]

  def create(orderId: Long, productId: Long, orderProductQuantity: Int): Future[OrderDetail] = db.run {
    // We create a projection of just the name and age columns, since we're not inserting a value for the id column
    (orderDetail.map(p => (p.order_id, p.product_id, p.order_product_quantity))
      // Now define it to return the id, because we want to know what id was generated for the person
      returning orderDetail.map(_.id)
      // And we define a transformation for the returned value, which combines our original parameters with the
      // returned id
      into { case ((orderId, productId, orderProductQuantity), id) => OrderDetail(id, orderId, productId, orderProductQuantity) }
    ) += ((orderId, productId, orderProductQuantity))
  }

  def list(): Future[Seq[OrderDetail]] = db.run {
    orderDetail.result
  }

  def getById(id: Long): Future[Seq[OrderDetail]] = db.run {
    orderDetail.filter(_.id === id).result
  }

  def getByOrderId(order_id: Long): Future[Seq[OrderDetail]] = db.run {
    orderDetail.filter(_.order_id === order_id).result
  }

  def delete(id: Long): Future[Int] = {
    val q = orderDetail.filter(_.id === id).delete
    db.run(q)
  }

  def deleteByOrderId(id: Long): Future[Int] = {
    val q = orderDetail.filter(_.order_id === id).delete
    db.run(q)
  }

}
