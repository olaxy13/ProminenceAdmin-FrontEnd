import React from "react";
import { useFormik } from "formik";
import { addItemSchema } from "./addItemSchema";
import {
  categories,
  laptopBrands,
  laptopAccessories,
  phoneBrands,
  phoneAccessories,
} from "../constants/constant";
import { useNavigate } from "react-router";

const AddItem = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      category: "",
      product: "",
      name: "",
      brand: "",
      price: "",
      description: "",
      images: [],
    },
    validationSchema: addItemSchema,
    onSubmit: (values) => {
      console.log(values);
      // Handle form submission logic here
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Add new files to the existing images array
    formik.setFieldValue("images", [...formik.values.images, ...files]);
  };

  // Helper to get brand/accessory options based on category
  const getBrandOptions = () => {
    switch (formik.values.category) {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-white sm:bg-gray-50">
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
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.product}
              </div>
            )}
          </div>
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
              step="0.01"
            />
            {formik.touched.price && formik.errors.price && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.price}
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
            <label className="block font-medium mb-1">
              {formik.touched.images && formik.errors.images ? (
                <span className="text-red-500">{formik.errors.images}</span>
              ) : (
                "Images"
              )}
            </label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full"
            />
            {formik.values.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formik.values.images.map((img, idx) => (
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
            className="w-full py-2 px-4 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-colors"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
