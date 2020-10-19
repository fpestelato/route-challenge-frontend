import IDeliveryAddress from "./IDeliveryAddress";

export default interface IDelivery extends IDeliveryAddress {
    _id?: string,
    name: string,
    weight: number,
    _v?: number,
}
