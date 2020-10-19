import React from 'react';
import BaseMap from '../components/BaseMap';
import './App.css';
import { BaseForm } from '../components/BaseForm';
import BaseTable from '../components/BaseTable';

export default function App() {
  return (
    <div className="app">
      <div className="container">
        <div className="left-col">
          <BaseForm />
        </div>
        <div className="right-col">
          <BaseMap />
          <BaseTable />
        </div>
      </div>
    </div>
  );
}