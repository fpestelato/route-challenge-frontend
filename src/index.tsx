import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App/App';
import { LayerContextProvider } from './providers/LayerContext';

ReactDOM.render(
  <React.StrictMode>
    <LayerContextProvider>
      <App />
    </LayerContextProvider> 
  </React.StrictMode>,
  document.getElementById('root')
);
