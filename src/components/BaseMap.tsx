import React, { useContext } from 'react';
import { LayerContext } from '../providers/LayerContext';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import IDelivery from '../interfaces/IDelivery';

export default function BaseMap () {
    const { points, center, zoom } = useContext(LayerContext);
    return (
      <Map id="mapId" center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {
          points.map((point: IDelivery) => 
            <Marker key={point._id || point.latitude + point.longitude } position={[point.latitude, point.longitude]}>
              <Popup>
                <span>{point.name}</span>
                <br/>
                <span>{point.weight} KG</span>
              </Popup>
            </Marker>
          )
        }
      </Map>
    );
}