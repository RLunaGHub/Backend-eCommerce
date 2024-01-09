import React, { useState } from "react";
import { initMercadoPago } from "@mercadopago/sdk-react";
import Payment from "./Payment";
import Checkout from "./Checkout";
import Footer from "./Footer";
import InternalProvider from "./ContextProvider";
import { SpinnerCircular } from "spinners-react";

// REPLACE WITH YOUR PUBLIC KEY AVAILABLE IN: https://developers.mercadopago.com/panel
initMercadoPago("TEST-cf91b67a-026c-4326-aad7-e92da09f1218");

const MercadoPago = () => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    quantity: "1",
    price: "10",
    amount: 10,
    description: "Some book",
  });

  const handleClick = () => {
    setIsLoading(true);
    fetch("http://localhost:8080/create_preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then((response) => {
        return response.json();
      })
      .then((preference) => {
        setPreferenceId(preference.id);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const renderSpinner = () => {
    if (isLoading) {
      return (
        <div className="spinner-wrapper">
          <SpinnerCircular сolor="#009EE3" />
        </div>
      );
    }
  };

  return (
    <InternalProvider
      context={{ preferenceId, isLoading, orderData, setOrderData }}
    >
      <main>
        {renderSpinner()}
        <Checkout onClick={handleClick} description />
        <Payment />
      </main>
      <Footer />
    </InternalProvider>
  );
};

export default MercadoPago;
