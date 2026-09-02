import React, { useState} from "react";
import "../styles/CreateEbikeListing.scss";

const URLInputForm = ({ onSubmit }) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      const urlObject = new URL(url);
      const pathSegments = urlObject.pathname.split('/').filter(Boolean); // Filter out empty segments
      
      const hasEbikes = pathSegments.some(segment => segment.toLowerCase().includes('ebikes'));
      if (hasEbikes) {
        onSubmit(url);
      } else {
        // Handle the validation error (for example, by alerting the user)
        alert('Invalid URL: please enter correct path for the e-bike to be rented.');
      }
    } catch (error) {
      // Handle invalid URL error
      alert('Please enter a valid URL.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="full">
        <div className="location">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
            required
          />
          <button className="submit_btn" type="submit">Generate QR Code</button>
        </div>
      </div>
    </form>
  );
};

export default URLInputForm;
