package models

import play.api.libs.json.Json

case class OrderDetail(id: Long, orderId: Long, productId: Long, orderProductQuantity: Int)

object OrderDetail {
  implicit val orderDetailFormat = Json.format[OrderDetail]
}