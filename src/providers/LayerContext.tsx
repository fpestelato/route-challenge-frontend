import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import IDelivery from '../interfaces/IDelivery';

const LayerContext = createContext<any>({});

const LayerContextProvider = ({ children }: any) => {
    const [ points, setPoints ] = useState<Array<IDelivery>>([]);
    const [ center, setCenter ] = useState<[number, number]>([0,0]);
    const [ zoom, setZoom ] = useState<number>(16);

    useEffect(() => {
        axios.get<IDelivery[]>('http://localhost:3000/deliveries').then(res => setPoints(res.data));
    });

    const defaultProps = {
        points,
        setPoints,
        center,
        setCenter,
        zoom,
        setZoom,
    }

    return (    
        <LayerContext.Provider value={defaultProps}>
            { children }
        </LayerContext.Provider>
    );
}

export { LayerContext, LayerContextProvider };