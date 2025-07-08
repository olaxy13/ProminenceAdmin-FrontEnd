import React from "react";
import { useParams, useNavigate } from "react-router";

const items = [
  {
    id: 1,
    name: "Item One",
    price: "$19.99",
    description: "This is a short description of item one.",
    image: "https://via.placeholder.com/120x80?text=Item+1",
  },
  {
    id: 2,
    name: "Item Two",
    price: "$24.99",
    description: "This is a short description of item two.",
    image: "https://via.placeholder.com/120x80?text=Item+2",
  },
  {
    id: 3,
    name: "Item Three",
    price: "$15.00",
    description: "This is a short description of item three.",
    image: "https://via.placeholder.com/120x80?text=Item+3",
  },
  {
    id: 4,
    name: "Item Four",
    price: "$29.99",
    description: "This is a short description of item four.",
    image: "https://via.placeholder.com/120x80?text=Item+4",
  },
  {
    id: 5,
    name: "Item Five",
    price: "$9.99",
    description: "This is a short description of item five.",
    image: "https://via.placeholder.com/120x80?text=Item+5",
  },
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = items.find((item) => item.id === Number(id));

  if (!product) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 xl:p-20 min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-lg flex flex-col items-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-48 h-32 object-cover rounded mb-6"
        />
        <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
        <span className="text-blue-600 font-bold text-xl mb-2">
          {product.price}
        </span>
        <p className="text-gray-600 text-center mb-6">{product.description}</p>
        <button
          className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium text-base shadow-md hover:bg-blue-700 transition-colors"
          onClick={() => navigate(-1)}
        >
          Back to Products
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
