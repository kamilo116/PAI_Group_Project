package models

import javax.inject.{ Inject, Singleton }
import play.api.Logger
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.JdbcProfile

import scala.concurrent.{ ExecutionContext, Future }

@Singleton
class PurchaseRepository @Inject() (dbConfigProvider: DatabaseConfigProvider /*, userRepository: UserRepository*/ )(implicit ec: ExecutionContext) {
  // We want the JdbcProfile for this provider
  protected val dbConfig = dbConfigProvider.get[JdbcProfile]

  val logger: Logger = Logger(this.getClass())

  // These imports are important, the first one brings db into scope, which will let you do the actual db operations.
  // The second one brings the Slick DSL into scope, which lets you define the table and other queries.
  import dbConfig._
  import profile.api._
  //  import userRepository.UsersTable

  class OrderTable(tag: Tag) extends Table[Purchase](tag, "purchase") {

    /** The ID column, which is the primary key, and auto incremented */
    def id = column[Long]("purchase_id", O.PrimaryKey, O.AutoInc)

    def user_id = column[Long]("user_id")

    def purchase_address = column[String]("delivery_address")

    def is_reviewed = column[Boolean]("is_reviewed")

    //    def user_fk = foreignKey("user_fk",user_id, user)(_.id)

    def * = (id, user_id, purchase_address, is_reviewed) <> ((Purchase.apply _).tupled, Purchase.unapply)
  }

  private val purchase = TableQuery[OrderTable]

  //`product_id` int NOT NULL, ???
  def create(userId: Long, orderAddress: String, is_reviewed: Boolean): Future[Purchase] = db.run {
    // We create a projection of just the name and age columns, since we're not inserting a value for the id column
    (purchase.map(p => (p.user_id, p.purchase_address, p.is_reviewed))
      // Now define it to return the id, because we want to know what id was generated for the person
      returning purchase.map(_.id)
      // And we define a transformation for the returned value, which combines our original parameters with the
      // returned id
      into { case ((userId, orderAddress, is_reviewed), id) => Purchase(id, userId, orderAddress, is_reviewed) }
    ) += ((userId, orderAddress, is_reviewed))
  }

  def list(): Future[Seq[Purchase]] = db.run {
    purchase.result
  }

  def getByUserId(user_id: Long): Future[Seq[Purchase]] = db.run {
    purchase.filter(_.user_id === user_id).result
  }

  def getById(order_id: Long): Future[Seq[Purchase]] = db.run {
    purchase.filter(_.id === order_id).result
  }

  def delete(id: Long): Future[Int] = {
    val q = purchase.filter(_.id === id).delete
    db.run(q)
  }

  def updateReviewValue(order_id: Long): Future[Int] = {

    val q = purchase.filter(_.id === order_id)
      .map(x => x.is_reviewed).update(true)
    db.run(q)
  }

}
