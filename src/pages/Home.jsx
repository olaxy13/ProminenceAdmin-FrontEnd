import React, { useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import Loader from "../assets/loader.gif";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProducts } from "../services/data";

const Home = () => {
  const navigate = useNavigate();
  const observerRef = useRef();

  // Infinite query for products
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["productsList"],
    queryFn: ({ pageParam = 1 }) => fetchProducts(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      // lastPage.data.data: array of products
      // lastPage.data.meta: { currentPage, totalPages }
      const meta = lastPage?.data;
      if (meta && meta.currentPage < meta.totalPages) {
        return meta.currentPage + 1;
      }
      return undefined;
    },
    staleTime: 10 * 60 * 1000,
  });
  // Combine all products from all pages
  const productsList =
    data?.pages?.flatMap((page) => page?.data?.data || []) || [];

  // Intersection Observer for infinite scroll
  const loaderRef = useCallback(
    (node) => {
      if (isLoading || isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center gap-8 p-4 md:p-8 bg-gray-50 min-h-screen">
        <img src={Loader} alt="loader gif" className="w-10 h-10" />
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
          productsList.map((productList, idx) => (
            <div
              key={productList.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/product/${productList.id}`)}
            >
              <img
                src={
                  productList?.photos && productList.photos.length > 0
                    ? productList.photos[0]
                    : null
                }
                alt={productList.name}
                className="w-full h-20 object-cover rounded mb-3"
              />
              <h3 className="font-semibold text-lg mb-1">{productList.name}</h3>
              <p className="text-gray-500 text-sm text-center  mb-1">
                {productList.brand}
              </p>
              <span className="text-blue-600 font-bold">
                ₦{Number(productList.price).toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No products found.
          </div>
        )}
      </section>
      {/* Loader for infinite scroll */}
      <div ref={loaderRef} className="flex justify-center mt-6 min-h-[40px]">
        {isFetchingNextPage && (
          <img src={Loader} alt="Loading more..." className="w-8 h-8" />
        )}
        {!hasNextPage && productsList.length > 0 && (
          <span className="text-gray-400 text-sm">No more products.</span>
        )}
      </div>
    </div>
  );
};

export default Home;
