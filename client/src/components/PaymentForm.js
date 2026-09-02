import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#000",
      fontWeight: 500,
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" }
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee"
    }
  }
};

const PaymentForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      setError("Stripe has not loaded yet. Please try again in a moment.");
      return;
    }

    setLoading(true);
    setError(null); // Reset error state

    fetch("http://localhost:3001/payment/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: amount }), // Amount in cents
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        return response.json();
      }
    })
    .then(data => {
      if (data.clientSecret) {
        // Confirm the payment with the clientSecret
        return stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {},
          },
        });
      } else {
        throw new Error("PaymentIntent clientSecret is missing.");
      }
    })
    .then(result => {
      if (result.error) {
        throw result.error;
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        onSuccess(); // Payment succeeded
      }
    })
    .catch(error => {
      console.error(error);
      setError(error.message);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={CARD_OPTIONS} />
      <button type="submit" disabled={!stripe || !amount || loading}>
        {loading ? "Processing…" : `Pay $${amount/100}`}
      </button>
      {error && <div className="error" style={{color: 'red', marginTop: '10px'}}>{error}</div>}
    </form>
  );
};

export default PaymentForm;
