import { ILatLng } from "./IGeoCodeAPI";

export default interface IDeliveryAddress extends ILatLng {
    publicArea: string,
    number: number,
    district: string,
    complement?: string,
    city: string,
    state: string,
    country: string,
}