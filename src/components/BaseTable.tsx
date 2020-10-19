import React, { useContext, useEffect, useState } from 'react';
import IDelivery from '../interfaces/IDelivery';
import { LayerContext } from '../providers/LayerContext';

const BaseTable: React.FC = () => {
  const { points } = useContext(LayerContext);
  const [ totalsPharagraph, setTotalsPharagraph ] = useState<string>('Total de Clientes: 0; Peso Total: 0; Ticket Médio*: 0');

  useEffect(() => {
    const deliveriesLenght =  points?.length || 0;
    const totalWeigth = deliveriesLenght ? points!.map((d: IDelivery)=> d.weight).reduce((a: number, b: number) => a + b) : 0;
    
    const resultString = [
      'Total de Clientes: ' + deliveriesLenght,
      'Peso Total: ' + totalWeigth + ' kg',
      'Ticket Médio*: ' + (totalWeigth / deliveriesLenght || 0),
    ];

    setTotalsPharagraph(resultString.join('; '));
  }, [points]);

  return (
    <>
      <div>
          <p className="totals">{ totalsPharagraph }</p>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Rua</th>
                <th>Cidade</th>
                <th>País</th>
                <th>Peso</th>
                <th>Lat</th>
                <th>Lng</th>
              </tr>
            </thead>
            <tbody>
            { 
              points.length == 0 ? 
              <tr>
                <td colSpan={7} className='no-data' >Não há registros</td>
              </tr> :
              points.map((delivery: IDelivery) =>                 
                <tr key={delivery.name + delivery.weight}>
                  <td>{ delivery.name }</td>
                  <td>{ delivery.publicArea }</td>
                  <td>{ delivery.city }</td>
                  <td>{ delivery.country }</td>
                  <td>{ delivery.weight }</td>
                  <td>{ delivery.latitude }</td>
                  <td>{ delivery.longitude }</td>
                </tr>
              )                
            }
            </tbody>
          </table>
        </div>          
        <p className='p-reference'>*Peso Total/Total de Clientes</p>
    </>
  );
}

export default BaseTable;