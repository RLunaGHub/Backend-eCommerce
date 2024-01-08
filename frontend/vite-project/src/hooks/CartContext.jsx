import React, { createContext, useContext, useState, useEffect } from "react";

//User Context
import { useUser } from "../hooks/UserContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useUser();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        if (!token || !user) {
          return;
        }
        const response = await fetch(
          `http://localhost:8080/api/carts/${user.cart}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const cartData = await response.json();
          setCart(cartData.message.products);
        } else {
        }
      } catch (error) {}
    };

    fetchCartData();
  }, [token, user]);

  const getCart = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/carts/${user.cart}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData.message.products);
      } else {
      }
    } catch (error) {}
  };

  const putCartWithProdsArray = async (modifiedCart) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/carts/${user.cart}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(modifiedCart),
        }
      );

      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart);
      } else {
      }
    } catch (error) {}
  };

  const emptyCart = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/carts/${user.cart}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setCart([]);
      } else {
        // Handle error emptying cart
      }
    } catch (error) {
      // Handle empty cart error
    }
  };

  const addProductCart = async (productId, quantity) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/carts/${user.cart}/product/${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity }),
        }
      );

      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart.message.products);
        getCart();
      } else {
        console.log("ERROR", response);
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const putProdQty = async (productId, quantity) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/carts/${user.cart}/product/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity }),
        }
      );

      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart.message.products);
      } else {
        // Handle error modifying product quantity
      }
    } catch (error) {
      // Handle modify product quantity error
    }
  };

  const deleteProdOnCart = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/carts/${user.cart}/product/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart.message.products);
      } else {
        // Handle error removing product from cart
      }
    } catch (error) {
      // Handle remove product from cart error
    }
  };

  const purchase = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/carts/${user.cart}/checkout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setCart([]);
      } else {
      }
    } catch (error) {}
  };

  const totalQuantity = cart.reduce(
    (acc, product) => acc + product.quantity,
    0
  );
  const totalAmount = cart.reduce(
    (acc, product) => acc + product.quantity * product.id_prod.price,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        putCartWithProdsArray,
        emptyCart,
        addProductCart,
        putProdQty,
        deleteProdOnCart,
        purchase,
        totalQuantity,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
