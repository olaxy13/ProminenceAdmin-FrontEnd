import React from "react";
import { useNavigate } from "react-router";

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

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6 xl:p-20 bg-gray-50">
      <section className="flex items-center justify-between  rounded-xl mb-8">
        <h2 className="m-0 font-semibold text-2xl">Title</h2>
        <button className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium text-base shadow-md hover:bg-blue-700 transition-colors">
          Add Item
        </button>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/product/${item.id}`)}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-28 h-20 object-cover rounded mb-3"
            />
            <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
            <span className="text-blue-600 font-bold mb-1">{item.price}</span>
            <p className="text-gray-500 text-sm text-center">
              {item.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
