import React from 'react'
import Navbar from "../components/Navbar"
import Slide from "../components/Slide"
import Categories from '../components/Categories'
import EbikeListings from '../components/EbikeListings'



const HomePage = () => {
  return (
    <>
      <Navbar />
      <Slide />
      <Categories />
      <EbikeListings />
    </>
 
    
     
  )
}

export default HomePage
