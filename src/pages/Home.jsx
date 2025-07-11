import React from "react";
import { useNavigate } from "react-router";
import Loader from '../assets/loader.gif'
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../services/data";


const Home = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
      queryKey: ["productsList"],
      queryFn: fetchProducts,
      staleTime: 10 * 60 * 1000, // cache for 10 minutes
    });
    const productsList = data?.data?.data || []
    console.log(productsList[0])
  if (isLoading) {
      return (
        <div className="flex justify-center items-center gap-8 p-4 md:p-8 bg-gray-50 min-h-screen">
          <img src={Loader} alt="loader gif" className="w-10 h-10"/>
        </div>
      );
    }
  
    if (isError) {
      return (
        <div className="flex justify-center items-center gap-8 p-4 md:p-8 bg-gray-50 min-h-screen">
          <p>Failed to fetch products. Please try again later.</p>
        </div>
      );
    }
  return (
    <div className="p-6 xl:p-20 bg-gray-50">
      <section className="flex items-center justify-between  rounded-xl mb-8">
        <h2 className="m-0 font-semibold text-2xl">Admin </h2>
        <button
          className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium text-base shadow-md hover:bg-blue-700 transition-colors"
          onClick={() => navigate("/add-item")}
        >
          Add Item
        </button>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productsList && productsList.length > 0 ? (
          productsList.map((productList) => (
            <div
              key={productList.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/product/${productList.id}`)}
            >
              <img
                src={productList?.photos && productList.photos.length > 0 ? productList.photos[0] : null}
                alt={productList.name}
                className="w-full h-20 object-cover rounded mb-3"
              />
              <h3 className="font-semibold text-lg mb-1">{productList.name}</h3>
              <p className="text-gray-500 text-sm text-center  mb-1">
                {productList.brand}
              </p>
              <span className="text-blue-600 font-bold">₦{Number(productList.price).toLocaleString()}</span>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">No products found.</div>
        )}
      </section>
    </div>
  );
};

export default Home;
