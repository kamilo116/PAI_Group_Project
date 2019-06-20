package models

import javax.inject.{ Inject, Singleton }
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.JdbcProfile
import scala.concurrent.{ Future, ExecutionContext }

@Singleton
class OptionGroupRepository @Inject() (dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {

  val dbConfig = dbConfigProvider.get[JdbcProfile]

  import dbConfig._
  import profile.api._

  class OptionGroupTable(tag: Tag) extends Table[OptionGroup](tag, "option_group") {
    def option_group_id = column[Int]("option_group_id", O.PrimaryKey, O.AutoInc)
    def option_group_name = column[String]("option_group_name")

    def * = (option_group_id, option_group_name) <> ((OptionGroup.apply _).tupled, OptionGroup.unapply)
  }

  val optionGroup = TableQuery[OptionGroupTable]

  def create(option_group_name: String): Future[OptionGroup] = db.run {
    (optionGroup.map(o => (o.option_group_name))
      returning optionGroup.map(_.option_group_id)
      into {
        case ((option_group_name), option_group_id) =>
          OptionGroup(option_group_id, option_group_name)
      }
    ) += ((option_group_name))
  }

  def list(): Future[Seq[OptionGroup]] = db.run {
    optionGroup.result
  }

  def delete(id: Int): Future[Unit] = db.run {
    (optionGroup.filter(_.option_group_id === id).delete).map(_ => ())
  }

  def findById(id: Int): Future[scala.Option[OptionGroup]] = db.run {
    optionGroup.filter(_.option_group_id === id).result.headOption
  }
  def update(newValue: OptionGroup) = db.run {
    optionGroup.insertOrUpdate(newValue)
  }
}