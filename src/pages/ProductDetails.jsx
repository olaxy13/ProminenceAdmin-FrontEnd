import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams, useNavigate } from "react-router";
import { fetchProductById, updateProductById } from "../services/data";
import { FaTrash } from "react-icons/fa";
import { useFormik } from "formik";
import { addItemSchema } from "./addItemSchema";
import {
  categories,
  laptopBrands,
  laptopAccessories,
  phoneBrands,
  phoneAccessories,
} from "../constants/constant";
import Cookies from "js-cookie";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["productFetch", id],
    queryFn: () => fetchProductById(id),
    staleTime: 10 * 60 * 1000,
  });
  const product = data?.data?.data;
  console.log('productDetails', product)

  const [editData, setEditData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [token, setToken] = useState()

  useEffect(() => {
    const token = Cookies.get("adminToken");
    setToken(token)
    if (product) {
      setEditData(product);
      // Set default selected image
      if (product.photos && product.photos.length > 0) {
        setSelectedImage(product.photos[0]);
      } else if (product.image) {
        setSelectedImage(product.image);
      } else {
        setSelectedImage(null);
      }
    }
  }, [product]);

  const formik = useFormik({
    initialValues: {
      product: editData?.product || "",
      name: editData?.name || "",
      brand: editData?.brand || "",
      price: editData?.price || "",
      description: editData?.description || "",
      specifications: editData?.specifications || "",
      photos: editData?.photos || [],
      type: editData?.type || "",
    },
    validationSchema: addItemSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      setSuccess("");
      try {
        await updateProductById(id, values, token)
        .then(res => {
          console.log(res)
          setSuccess("Product updated successfully!");
          setEditMode(false);
          toast.success('Product updated successfully')
        })
      } catch (err) {
        setError("Failed to update product.");
        toast.error('Failed to update')
      } finally {
        setLoading(false);
      }
    },
  });

  // Helper to get brand/accessory options based on category
  const getBrandOptions = () => {
    switch (formik.values.type) {
      case "laptop":
        return laptopBrands || [];
      case "laptopAccessory":
        return laptopAccessories || [];
      case "phone":
        return phoneBrands || [];
      case "phoneAccessory":
        return phoneAccessories || [];
      default:
        return [];
    }
  };

  const handleImageRemove = (imgToRemove) => {
    setEditData((prev) => ({
      ...prev,
      photos: prev.photos.filter((img) => img !== imgToRemove),
    }));
    // If the removed image was selected, select another or null
    if (selectedImage === imgToRemove) {
      const newPhotos = editData.photos.filter((img) => img !== imgToRemove);
      setSelectedImage(newPhotos[0] || null);
    }
  };

  const handleImageInput = (e) => {
    const files = Array.from(e.target.files);
    // Assume backend expects URLs or you handle upload elsewhere
    // Here, just add the file names for demo
    const newImages = files.map((file) => URL.createObjectURL(file));
    setEditData((prev) => ({
      ...prev,
      photos: [...(prev.photos || []), ...newImages],
    }));
    if (!selectedImage && newImages.length > 0) {
      setSelectedImage(newImages[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center">Loading...</div>
    );
  }
  if (isError || !product) {
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
    <div className="p-6 xl:p-20 min-h-screen sm:bg-gray-50 flex flex-col items-center">
      <div className="bg-white rounded-xl sm:shadow sm:p-8 w-full max-w-[700px] flex flex-col items-center">
        <button
          className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors self-start"
          onClick={() => navigate(-1)}
        >
          ← Back 
        </button>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        
        {editMode ? (
          <form
            onSubmit={formik.handleSubmit}
            className="w-full flex flex-col gap-4 items-center"
          >
            <div className="w-full">
              <label className="block font-medium mb-1">Product</label>
              <input
                type="text"
                name="product"
                value={formik.values.product}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border rounded px-3 py-2"
              />
              {formik.touched.product && formik.errors.product && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.product}</div>
              )}
            </div>
            <div className="w-full">
              <label className="block font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border rounded px-3 py-2"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
              )}
            </div>
            <div className="w-full">
              <label className="block font-medium mb-1">Category</label>
              <select
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.value}>{cat.name}</option>
                ))}
              </select>
              {formik.touched.type && formik.errors.type && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.type}</div>
              )}
            </div>
            <div className="w-full">
              <label className="block font-medium mb-1">
                {formik.touched.brand && formik.errors.brand ? (
                  <span className="text-red-500">{formik.errors.brand}</span>
                ) : formik.values.type === "Laptop accessories" ||
                  formik.values.type === "Phone accessories" ? (
                  "Accessory"
                ) : (
                  "Brand"
                )}
              </label>
              <select
                name="brand"
                value={formik.values.brand}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border rounded px-3 py-2"
                disabled={!formik.values.type}
              >
                <option value="">
                  {formik.values.type
                    ? `Select ${formik.values.type === "Laptop accessories" ||
                        formik.values.type === "Phone accessories"
                        ? "an accessory"
                        : "a brand"}`
                    : "Select a category first"}
                </option>
                {getBrandOptions().map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <label className="block font-medium mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border rounded px-3 py-2"
                min="0"
                step="0.01"
              />
              {formik.touched.price && formik.errors.price && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.price}</div>
              )}
            </div>
            <div className="w-full">
              <label className="block font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border rounded px-3 py-2 min-h-[80px]"
              />
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.description}</div>
              )}
            </div>
            <div className="w-full">
              <label className="block font-medium mb-1">Specifications</label>
              <textarea
                name="specifications"
                value={formik.values.specifications}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border rounded px-3 py-2 min-h-[80px]"
              />
              {formik.touched.specifications && formik.errors.specifications && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.specifications}</div>
              )}
            </div>
            <div className="w-full">
              <label className="block font-medium mb-1">Photos</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageInput}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="inline-block px-4 py-2 mb-3 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow">
                Add Images
              </label>
              <div className="flex gap-2 flex-wrap">
                {Array.isArray(editData.photos) && editData.photos.length > 0 ? (
                  editData.photos.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-16 h-12 object-cover rounded border-2 border-gray-200 shadow"
                      />
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-80 group-hover:opacity-100 hover:bg-red-600 transition-all shadow"
                        onClick={() => handleImageRemove(img)}
                        title="Remove image"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No images</span>
                )}
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium text-base shadow-md hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="px-6 py-2 rounded-full bg-gray-300 text-gray-700 font-medium text-base shadow-md hover:bg-gray-400 transition-colors"
                onClick={() => {
                  setEditMode(false);
                  setEditData(product);
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            {Object.entries(product).map(
              ([key, value]) => {
                if (key === "id") return null;
                if (key === "createdAt") return null;
                if (key === "photos") {
                  return (
                    <div key={key} className="w-full mb-2">
                      <span className="font-medium capitalize">Photos: </span>
                      {selectedImage && (
                        <div className="flex items-start justify-start mb-4 gap-4">
                          {Array.isArray(product.photos) && product.photos.length > 0 && (
                            <div className="flex flex-col gap-2 justify-start mt-1">
                              {product.photos.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt={`Thumbnail ${idx + 1}`}
                                  className={`w-8 h-8 sm:w-10 sm:h-8 object-cover rounded cursor-pointer border-2 ${selectedImage === img ? 'border-blue-500' : 'border-gray-200'} transition-all`}
                                  onClick={() => setSelectedImage(img)}
                                />
                              ))}
                            </div>
                          )}
                          <img
                            src={selectedImage}
                            alt="Selected"
                            className="w-64 h-44 object-cover rounded border-2 border-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <div key={key} className="w-full mb-2">
                    <span className="font-medium capitalize">{key}: </span>
                    <p>{String(value)}</p>
                  </div>
                );
              }
            )}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mt-6">
              <button
                className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium text-base shadow-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
              <button
                className="px-6 py-2 rounded-full bg-red-600 text-white font-medium text-base shadow-md hover:bg-red-700 transition-colors w-full sm:w-auto"
                onClick={() => {/* TODO: Implement delete logic here */}}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
