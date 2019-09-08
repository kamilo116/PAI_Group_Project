package models

import play.api.libs.json.Json

case class PurchaseDetail(id: Long, orderId: Long, productId: Long, orderProductQuantity: Int)

object PurchaseDetail {
  implicit val orderDetailFormat = Json.format[PurchaseDetail]
}