import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartData);
    calculateTotalPrice(cartData);
  }, []);

  const handleIncrement = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += 1;
    setCart(updatedCart);
    calculateTotalPrice(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleDecrement = (index) => {
    const updatedCart = [...cart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setCart(updatedCart);
      calculateTotalPrice(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const calculateTotalPrice = (cartData) => {
    const total = cartData.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const handleRemove = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1); // Remove the item from the array
    setCart(updatedCart);
    calculateTotalPrice(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice, currency: "INR", cart }),
      });

      const order = await response.json();

      if (order && order.id) {
        const options = {
          key: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay Key ID
          amount: order.amount, // Amount in paise
          currency: order.currency,
          name: "Your Company Name",
          description: "Test Transaction",
          image: "https://your-logo-url.com", // Replace with your logo
          order_id: order.id, // Razorpay order ID from the backend
          handler: async function (response) {
            const paymentData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verifyResponse = await fetch(
              "http://localhost:5000/api/payments/verify",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentData),
              }
            );

            const verificationResult = await verifyResponse.json();

            if (verifyResponse.ok) {
              // Save order details to the backend for admin viewing
              await fetch("http://localhost:5000/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cart, totalPrice, paymentData }),
              });

              // Clear the cart after successful payment
              setCart([]);
              localStorage.removeItem("cart");
              alert("Payment Successful!");
              navigate("/orders"); // Navigate to orders page or dashboard
            } else {
              alert("Payment verification failed. Please try again.");
            }
          },
          prefill: {
            name: "Customer Name",
            email: "customer@example.com",
            contact: "9999999999",
          },
          notes: {
            address: "Corporate Office",
          },
          theme: {
            color: "#F37254",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert("Order creation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  if (cart.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div className="container mx-auto p-5 mt-24">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      <div className="grid gap-5">
        {cart.map((item, index) => (
          <div key={item.id} className="flex justify-between items-center p-4 border-b">
            <div className="flex gap-4">
              <img src={item.image} alt={item.name} className="w-20 h-20" />
              <div>
                <h2 className="font-bold">{item.name}</h2>
                <p>Price: ₹{item.price}</p>
                <p>Size: {item.size}</p> {/* Display selected size */}
                <p>Category: {item.category || "N/A"}</p> {/* Display category */}
                <p>Collection: {item.collection || "N/A"}</p> {/* Display collection */}
                <p>Description: {item.description}</p> {/* Display description */}
                <div className="flex items-center">
                  <button
                    className="px-4 py-2 bg-gray-200"
                    onClick={() => handleDecrement(index)}
                  >
                    -
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    className="px-4 py-2 bg-gray-200"
                    onClick={() => handleIncrement(index)}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemove(index)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
            <div>
              <p>Total: ₹{item.price * item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-semibold">Total Price: ₹{totalPrice}</h2>
        <button
          onClick={handleCheckout}
          className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300 mt-4"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
