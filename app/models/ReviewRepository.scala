package models

import javax.inject.{ Inject, Singleton }
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.JdbcProfile
import scala.concurrent.{ Future, ExecutionContext }

@Singleton
class ReviewRepository @Inject() (dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {

  val dbConfig = dbConfigProvider.get[JdbcProfile]

  import dbConfig._
  import profile.api._

  class ReviewTable(tag: Tag) extends Table[Review](tag, "review") {
    def review_id = column[Int]("review_id", O.PrimaryKey, O.AutoInc)
    def order_id = column[Int]("order_id")
    def product_id = column[Int]("product_id")
    def mark = column[Int]("mark")
    def review_content = column[String]("review_content")

    def * = (review_id, order_id, product_id, mark, review_content) <> ((Review.apply _).tupled, Review.unapply)
  }

  val review = TableQuery[ReviewTable]

  def create(order_id: Int, product_id: Int, mark: Int, review_content: String): Future[Review] = db.run {
    (review.map(r => (r.order_id, r.product_id, r.mark, r.review_content))
      returning review.map(_.review_id)
      into {
        case ((order_id, product_id, mark, review_content), review_id) =>
          Review(review_id, order_id, product_id, mark, review_content)
      }
    ) += ((order_id, product_id, mark, review_content))
  }

  def list(): Future[Seq[Review]] = db.run {
    review.result
  }

  def delete(id: Int): Future[Unit] = db.run {
    (review.filter(_.review_id === id).delete).map(_ => ())
  }

  def findById(id: Int): Future[scala.Option[Review]] = db.run {
    review.filter(_.review_id === id).result.headOption
  }

  def findByProductId(id: Int): Future[Seq[Review]] = db.run {
    review.filter(_.product_id === id).result
  }

  def isOrderAlreadyRated(order_id: Int): Future[Boolean] = db.run {
    review.filter(_.order_id === order_id).exists.result
  }

  def update(newValue: Review) = db.run {
    review.insertOrUpdate(newValue)
  }

}