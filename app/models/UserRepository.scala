package models

import javax.inject.{ Inject, Singleton }
import play.api.Logger
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.JdbcProfile
import scala.concurrent.{ ExecutionContext, Future }

/**
 * A repository for people.
 *
 * @param dbConfigProvider The Play db config provider. Play will inject this for you.
 */
@Singleton
class UserRepository @Inject() (dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {
  // We want the JdbcProfile for this provider
  protected val dbConfig = dbConfigProvider.get[JdbcProfile]

  val logger: Logger = Logger(this.getClass())

  // These imports are important, the first one brings db into scope, which will let you do the actual db operations.
  // The second one brings the Slick DSL into scope, which lets you define the table and other queries.
  import dbConfig._
  import profile.api._

  /**
   * Here we define the table. It will have a name of people
   */
  class UserDbsTable(tag: Tag) extends Table[UserDb](tag, "User") {

    /** The ID column, which is the primary key, and auto incremented */
    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

    def name = column[String]("name")

    def surname = column[String]("surname")

    def email = column[String]("email")

    /**
     * This is the tables default "projection".
     *
     * It defines how the columns are converted to and from the Person object.
     *
     * In this case, we are simply passing the id, name and page parameters to the Person case classes
     * apply and unapply methods.
     */
    def * = (id, name, surname, email) <> ((UserDb.apply _).tupled, UserDb.unapply)
  }

  /**
   * The starting point for all queries on the people table.
   */
  private val users = TableQuery[UserDbsTable]

  /**
   * Create a person with the given name and age.
   *
   * This is an asynchronous operation, it will return a future of the created person, which can be used to obtain the
   * id for that person.
   */
  def create(name: String, surname: String, email: String): Future[UserDb] = db.run {
    // We create a projection of just the name and age columns, since we're not inserting a value for the id column
    (users.map(p => (p.name, p.surname, p.email))
      // Now define it to return the id, because we want to know what id was generated for the person
      returning users.map(_.id)
      // And we define a transformation for the returned value, which combines our original parameters with the
      // returned id
      //      into ((UserDb, id) => UserDb(id, UserDb._1, UserDb._2, UserDb._3, UserDb._4, UserDb._5, UserDb._6, UserDb._7, UserDb._8))
      into { case ((name, surname, email), id) => UserDb(id, name, surname, email) }
    // And finally, insert the person into the database
    ) += ((name, surname, email))
  }

  /**
   * List all the people in the database.
   */
  def list(): Future[Seq[UserDb]] = db.run {
    users.result
  }

  def getById(user_id: Long): Future[Seq[UserDb]] = db.run {
    users.filter(_.id === user_id).result
  }

  def getByEmail(email: String): Future[Seq[UserDb]] = db.run {
    users.filter(_.email === email).result
  }

  def isEmailExist(user_email: String): Future[Boolean] = db.run {
    users.filter(_.email === user_email).exists.result
  }

  def update(id: Long, name: String, surname: String, email: String): Future[Int] = {
    val q = users.filter(_.id === id)
      .map(x => (x.name, x.surname, x.email))
      .update((name, surname, email))

    db.run(q)
  }

  def delete(id: Long): Future[Int] = {
    val q = users.filter(_.id === id).delete
    db.run(q)
  }

}
