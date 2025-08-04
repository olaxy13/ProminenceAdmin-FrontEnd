import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { addItemSchema } from "./addItemSchema";
import {
  categories,
  laptopBrands,
  laptopAccessories,
  phoneBrands,
  phoneAccessories,
  colors,
} from "../constants/constant";
import { useNavigate } from "react-router";
import { addProduct } from "../services/data";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const AddItem = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [token, setToken] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      category: "",
      specifications: "",
      color: "",
      name: "",
      model: "",
      brand: "",
      price: "",
      description: "",
      photos: [],
      isAvailable: "true",
    },
    validationSchema: addItemSchema,
    onSubmit: (values) => {
      setIsLoading(true);
      // Convert values to FormData
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "photos") {
          value.forEach((file) => {
            formData.append("photos", file);
          });
        } else if (key === "isAvailable") {
          formData.append("isAvailable", value === "true");
        } else {
          formData.append(key, value);
        }
      });
      addProduct(formData, token)
        .then((res) => {
          if (res.status === 201) {
            toast.success("Product created successfully");
            // Invalidate productsList query so Home fetches latest data
            queryClient.invalidateQueries(["productsList"]);
            setTimeout(() => {
              navigate("/");
            }, 2000);
          }
        })
        .catch((err) => {
          // console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
      // Handle form submission logic here
    },
  });
  useEffect(() => {
    const token = Cookies.get("adminToken");
    if (token) {
      setToken(token);
    }
  }, []);
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Add new files to the existing photos array
    formik.setFieldValue("photos", [...formik.values.photos, ...files]);
  };

  // Helper to get brand/accessory options based on category
  const getBrandOptions = () => {
    switch (formik.values.category) {
      case "laptop":
        return laptopBrands || [];
      case "laptop_accessory":
        return laptopAccessories || [];
      case "phone":
        return phoneBrands || [];
      case "phone_accessory":
        return phoneAccessories || [];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white sm:bg-gray-50">
      <ToastContainer />
      <div className="w-full max-w-2xl mx-auto p-6 bg-white sm:rounded-xl sm:shadow">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-semibold mb-6">Add New Item</h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
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
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.name}
              </div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">
              {formik.touched.category && formik.errors.category ? (
                <span className="text-red-500">{formik.errors.category}</span>
              ) : (
                "Category"
              )}
            </label>
            <select
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.value}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">
              {formik.touched.brand && formik.errors.brand ? (
                <span className="text-red-500">{formik.errors.brand}</span>
              ) : formik.values.category === "Laptop accessories" ||
                formik.values.category === "Phone accessories" ? (
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
              disabled={!formik.values.category}
            >
              <option value="">
                {formik.values.category
                  ? `Select ${
                      formik.values.category === "Laptop accessories" ||
                      formik.values.category === "Phone accessories"
                        ? "an accessory"
                        : "a brand"
                    }`
                  : "Select a category first"}
              </option>
              {getBrandOptions().map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border rounded px-3 py-2"
              min="0"
              // step="0.01"
            />
            {formik.touched.price && formik.errors.price && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.price}
              </div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Model</label>
            <input
              type="text"
              name="model"
              value={formik.values.model}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border rounded px-3 py-2"
            />
            {formik.touched.model && formik.errors.model && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.model}
              </div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Available</label>
            <select
              name="isAvailable"
              value={formik.values.isAvailable}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border rounded px-3 py-2"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Color</label>
            <select
              name="color"
              value={formik.values.color}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select a color</option>
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
            {formik.touched.color && formik.errors.color && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.color}
              </div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border rounded px-3 py-2 min-h-[100px]"
              placeholder="Enter a detailed description..."
            />
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.description}
              </div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Specifications</label>
            <textarea
              name="specifications"
              value={formik.values.specifications}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border rounded px-3 py-2 min-h-[80px]"
              placeholder="Enter product specifications..."
            />
            {formik.touched.specifications && formik.errors.specifications && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.specifications}
              </div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">
              {formik.touched.photos && formik.errors.photos ? (
                <span className="text-red-500">{formik.errors.photos}</span>
              ) : (
                "Images"
              )}
            </label>
            <label className="w-full">
              <span className="inline-block w-[150px] px-4 py-2 bg-blue-500 text-white text-center rounded cursor-pointer hover:bg-blue-600 transition-colors">
                Choose files
              </span>
              <input
                type="file"
                name="photos"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {formik.values.photos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formik.values.photos.map((img, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-gray-100 px-2 py-1 rounded"
                  >
                    {img.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
