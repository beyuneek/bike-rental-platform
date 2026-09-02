import "../styles/CreateEbikeListing.scss";
import Navbar from "../components/Navbar";

import React, { useState } from "react";
import QRCodeComponent from "../components/QRCodeComponent";
import URLInputForm from "../components/URLInputForm";

const QRCodeGenerator = () => {
  const [url, setUrl] = useState("");

  const handleURLSubmit = (url) => {
    setUrl(url);
  };

  // return (
  //   <div>
  //     <URLInputForm onSubmit={handleURLSubmit} />
  //     {url && <QRCodeComponent url={url} />}
  //   </div>
  // );

  return (
    <>
      <Navbar />

      <div className="create-ebike-listing">
          <div className="create-ebike-listing_step1">
            <h2>Generate QR Code</h2>
            <hr />

            <h3>Enter The Url Of The Bike You Want To Generate The QR For</h3>
            <URLInputForm onSubmit={handleURLSubmit} />
            <h3> </h3>
            <h3>QR Code Below: </h3>
            {url && <QRCodeComponent url={url} />}
          </div>

      
      </div>
    </>
  );
};

export default QRCodeGenerator;
