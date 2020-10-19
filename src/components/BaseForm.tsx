import React, { ChangeEvent, useContext, useState } from 'react';
import IDeliveryAddress from '../interfaces/IDeliveryAddress';
import { IGeoCodeResponse, ILatLng } from '../interfaces/IGeoCodeAPI';
import axios from 'axios';
import { LayerContext } from '../providers/LayerContext';
import { useForm } from 'react-hook-form';

const initialAddress : IDeliveryAddress = {
  publicArea: '',
  number: 0,
  district: '',
  city: '',
  state: '',
  country: '',
  latitude: 0,
  longitude: 0,
};

enum EAddressesResponse {
  'SINGLE_ADDRESS_FOUND'= 1,
  'DEFAULT_VALUE'= 1,
  'ADDRESS_NOT_FOUND' = 0,
  'MULTIPLE_ADDRESSES_FOUNDED' = -1,
}

const BaseForm: React.FC = () => {
  const { setCenter } = useContext(LayerContext);
  const [ address, setAddress ] = useState<string>('');
  const [ formattedAddress, setFormattedAddress ] = useState<IDeliveryAddress>(initialAddress);
  const [ addressesFound, setAddressesFound ] = useState<EAddressesResponse>(EAddressesResponse.DEFAULT_VALUE);
  const [ clientName, setClientName ] = useState<string>('');
  const [ weight, setWeight ] = useState<number | null>(null);
  const [ latLngField, setLatLngField ] = useState<ILatLng>({ latitude: initialAddress.latitude, longitude: initialAddress.longitude });

  const { register, handleSubmit, errors, reset } = useForm();

  async function handleSearch() {
    const geoCodeKeyPrefix = '&key=';
    const geoCodeKey = 'AIzaSyBZbOv1GrT4qs-XQK5D51c1jXrMi2U9jrU';
    const queryParams = address.replace(' ', '%20') + geoCodeKeyPrefix + geoCodeKey;

    const response = await axios.get<IGeoCodeResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${queryParams}`);

    if (response.data.status === "OK" && response.data.results.length === EAddressesResponse.SINGLE_ADDRESS_FOUND) {
      const { geometry, formatted_address } = response.data.results[0];

      setCenter(geometry.location);
      setAddressesFound(EAddressesResponse.SINGLE_ADDRESS_FOUND);

      const addressInfoArray = formatted_address.split(',');
      const publicArea = addressInfoArray[0];
      const [ city, state ] = addressInfoArray[2].split(' - ');
      const country = addressInfoArray[4];

      let number, district, complement;
      const numberDisctrict = addressInfoArray[1].split(' - ');
      
      // check if the address have complement
      if (numberDisctrict.length > 2)
        [ number, complement, district ] = numberDisctrict;
      else
        [ number, district ] = numberDisctrict;

      setFormattedAddress({
        publicArea,
        number: parseInt(number),
        district,
        complement,
        city,
        state,
        country,
        latitude: geometry.location.lat,
        longitude: geometry.location.lng,
      });

      setLatLngField({
        latitude: geometry.location.lat,
        longitude: geometry.location.lng,
      });
    } else if (response.data.results.length > EAddressesResponse.SINGLE_ADDRESS_FOUND) {
      setAddressesFound(EAddressesResponse.MULTIPLE_ADDRESSES_FOUNDED);
    }    
    else {
      setAddressesFound(EAddressesResponse.ADDRESS_NOT_FOUND);
    }
  }

  function handleAddressChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setAddressesFound(EAddressesResponse.DEFAULT_VALUE);
    setAddress(e.target.value);
  }

  function handleClientNameChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setClientName(e.target.value);
  }

  function handleWeightChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setWeight(parseFloat(e.target.value));
  }

  async function handleDelivery() {
    await axios.post('http://localhost:3001/deliveries', {
      ...formattedAddress,
      name: clientName,
      weight,
    });
    resetFormAndValues();
  };

  function resetFormAndValues() {
    setLatLngField({latitude: initialAddress.latitude, longitude: initialAddress.longitude});
    setAddress('');
    setClientName('');
    setWeight(null);
    setFormattedAddress(initialAddress);
    reset();
  }

  async function handleReset() {
    await axios.delete('http://localhost:3001/deliveries');
    resetFormAndValues();
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleDelivery)}>
        <div className="form-inputs shadow">
          <input 
            id="clientName"
            type="text"
            name="clientName"
            placeholder="Nome Cliente*"
            onChange={handleClientNameChange}
            ref={register({required: 'Nome não pode ser nulo'})}
          />
          <input 
            id="weigth"
            type="number" 
            name="weigth"
            placeholder="Peso Entrega*"
            onChange={handleWeightChange}
            ref={register({required: 'Peso não pode ser nulo'})}
          />
          <input
            id="address"
            type="text"
            name="address"
            placeholder="Endereço Cliente*"
            onChange={handleAddressChange}
            ref={register({required: 'Endereço não pode ser nulo' })}
          />
          <button type="button" className="search" onClick={handleSearch}>Buscar</button>
          { 
            addressesFound !== EAddressesResponse.SINGLE_ADDRESS_FOUND ? (
            addressesFound === EAddressesResponse.ADDRESS_NOT_FOUND ?
              <span className="address404">Nenhum endereço encontrado!</span> :
              <span className="address404">Múltiplos endereços encontrados</span>
            ) : ''
          }
          <div className="geo">
            <input
              id="longtitude"
              type="text"
              disabled
              name="longtitude"
              placeholder="longtitude"
              value={latLngField.latitude}              
            />
            <input
              id="latitude"
              type="text"
              disabled
              name="latitude"
              placeholder="latitude"
              value={latLngField.longitude}
            />
          </div>
          <button
            type="submit"
            disabled={ (latLngField.latitude === 0 && latLngField.latitude === 0 )}
            className="add"
          >
            Cadastrar Cliente
          </button>
          { errors.clientName && <><span className="address404">{errors.clientName.message}</span><br/></> }
          { errors.weigth && <><span className="address404">{errors.weigth.message}</span><br/></> }
          { errors.address && <><span className="address404">{errors.address.message}</span><br/></> }
        </div>
      </form>
      <div className="form-inputs shadow reset-div">
        <button type="reset" onClick={handleReset}>resetar cadastro</button>
      </div>
    </>
  );
}


export {
  BaseForm,
} 