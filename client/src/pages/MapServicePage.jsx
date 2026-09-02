import React from 'react'
import Navbar from "../components/Navbar"
import MapComponent from '../components/MapComponent'


const MapService = () => {
  return (
    <>
      <Navbar />
      
      <div style=  {{margin: '20px',padding:'20px'}}>
      <MapComponent/>
      </div>
     
    </>
 
    
     
  )
}

export default MapService