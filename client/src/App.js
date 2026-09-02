import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import './App.css';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CreateEbikeListing from './pages/CreateEbikeListing';
import EbikeDetails from './pages/EbikeDetails';
import RentalList from './pages/RentalList';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import CreateReview from './pages/CreateReview';
import MyReviews from './pages/MyReviews';
import AllReviews from './pages/AllReviews';
import CreateTicket from './pages/CreateTicket';
import MyTickets from './pages/MyTickets';
import ManageTickets from './pages/ManageTickets';
import ViewTicket from './pages/ViewTicket';
import MapService from './pages/MapServicePage';
import TestQrCode from './pages/QRCodeGenerator.jsx';



// Make sure to replace with your Stripe public key
const stripePromise = loadStripe('pk_test_51OxfOGC20fmK7BCEp0Ms94a5GLG2kzyTsW50kLiuswF3tjwbb2Nl5LTXOpiCx7IgfwgHhHhymerkAXp1bR7u8fOc00d103shyr');

function App() {
  return (
    <div>
      <BrowserRouter>
        <Elements stripe={stripePromise}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-ebike-listing" element={<CreateEbikeListing />} />
            <Route path="/ebikes/:listingId" element={<EbikeDetails />} />
            <Route path="/:userId/rentals" element={<RentalList />} />
            <Route path="/:userId/profile" element={<Profile />} />
            <Route path="/:userId/editprofile" element={<EditProfile />} />
            <Route path="/createreview" element={<CreateReview />} />
            <Route path="/:userId/myreviews" element={<MyReviews />} />
            <Route path="/:userId/reviews" element={<AllReviews />} />
            <Route path="/:userId/createticket" element={<CreateTicket/>} />
            <Route path="/:userId/tickets" element={<MyTickets/>} />
            <Route path="/:userId/mapservice" element={<MapService />} />
            <Route path="/managetickets" element={<ManageTickets/>} />
            <Route path="/:ticketId/viewticket" element={<ViewTicket/>} />
            <Route path="/qr-code" element={<TestQrCode />} />

            
          </Routes>
        </Elements>
      </BrowserRouter>
    </div>
  );
}

export default App;
