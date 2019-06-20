package models

import javax.inject.{ Inject, Singleton }
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.JdbcProfile

import scala.concurrent.{ ExecutionContext, Future }

@Singleton
class ProductOptionRepository @Inject() (dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {

  val dbConfig = dbConfigProvider.get[JdbcProfile]

  import dbConfig._
  import profile.api._

  class ProductOptionTable(tag: Tag) extends Table[ProductOption](tag, "product_option") {
    def product_option_id = column[Int]("product_option_id", O.PrimaryKey, O.AutoInc)
    def product_id = column[Int]("product_id")
    def option_id = column[Int]("option_id")
    def option_group_id = column[Int]("option_group_id")

    def * = (product_option_id, product_id, option_id, option_group_id) <> ((ProductOption.apply _).tupled, ProductOption.unapply)
  }

  val product_option = TableQuery[ProductOptionTable]

  def create(product_id: Int, option_id: Int, option_group_id: Int): Future[ProductOption] = db.run {
    (product_option.map(p => (p.product_id, p.option_id, p.option_group_id))
      returning product_option.map(_.product_option_id)
      into {
        case ((product_id, option_id, option_group_id), product_option_id) =>
          ProductOption(product_option_id, product_id, option_id, option_group_id)
      }
    ) += ((product_id, option_id, option_group_id))
  }

  def list(): Future[Seq[ProductOption]] = db.run {
    product_option.result
  }

  def delete(id: Int): Future[Unit] = db.run {
    (product_option.filter(_.product_option_id === id).delete).map(_ => ())
  }

  def findById(id: Int): Future[scala.Option[ProductOption]] = db.run {
    product_option.filter(_.product_option_id === id).result.headOption
  }

  def findByGroupId(id: Int): Future[Seq[models.ProductOption]] = db.run {
    product_option.filter(_.option_group_id === id).result
  }
  def findByProductId(id: Int): Future[Seq[models.ProductOption]] = db.run {
    product_option.filter(_.product_id === id).result
  }
  def findByOptionId(id: Int): Future[Seq[models.ProductOption]] = db.run {
    product_option.filter(_.option_id === id).result
  }
  def update(newValue: ProductOption) = db.run {
    product_option.insertOrUpdate(newValue)
  }
}