import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import {
  deleteProduct,
  fetchProductById,
  updateProductById,
} from "../services/data";
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
import Loader from "../assets/loader.gif";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["productFetch", id],
    queryFn: () => fetchProductById(id),
    staleTime: 10 * 60 * 1000,
  });
  const product = data?.data?.data;

  const [editData, setEditData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [token, setToken] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const token = Cookies.get("adminToken");
    setToken(token);
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

  const handleDelete = () => {
    setLoading(true);
    deleteProduct(id, {}, token)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          // Invalidate productsList query so Home fetches latest data
          queryClient.invalidateQueries(["productsList"]);
          setLoading(false);
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      })
      .catch((err) => {
        // console.log(err);
        setLoading(false);
        toast.error(err.response.data.message);
      });
  };

  // Validation schema for edit form (allows both File objects and image URLs for photos)
  const editItemSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    // category: Yup.string().required("Category is required"),
    brand: Yup.string().required("Brand is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .min(0, "Price must be at least 0")
      .required("Price is required"),
    model: Yup.string().required("Model is required"),
    color: Yup.string().required("Color is required"),
    description: Yup.string().required("Description is required"),
    specifications: Yup.string().required("Specifications are required"),
    photos: Yup.array()
      .of(
        Yup.mixed().test(
          "fileType",
          "Only image files or URLs are allowed",
          (value) => {
            if (!value) return true;
            if (typeof value === "string") {
              // Accept if it's a valid image URL (http/https and ends with image extension)
              return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(
                value
              );
            }
            return value.type && value.type.startsWith("image/");
          }
        )
      )
      .min(1, "At least one image is required"),
    isAvailable: Yup.string()
      .oneOf(["true", "false"])
      .required("Availability is required"),
  });

  // Helper to strip HTML tags
  const stripHtml = (html) =>
    typeof html === "string"
      ? html
          .replace(/<[^>]+>/g, "")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
      : html;

  const formik = useFormik({
    initialValues: {
      // category: editData?.category || "",
      specifications: stripHtml(editData?.specifications) || "",
      color: editData?.color || "",
      name: editData?.name || "",
      model: editData?.model || "",
      brand: editData?.brand || "",
      price: editData?.price || "",
      description: stripHtml(editData?.description) || "",
      photos: editData?.photos || [],
      isAvailable:
        typeof editData?.isAvailable === "boolean"
          ? String(editData.isAvailable)
          : "true",
    },
    validationSchema: editItemSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      setSuccess("");
      // Convert values to FormData
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        // if (key === "photos") {
        if (key === "photos" && Array.isArray(value)) {
          value.forEach((fileOrUrl) => {
            // Only append File objects, skip URLs (they are already on server)
            // if (typeof fileOrUrl !== "string") {
            formData.append("photos", fileOrUrl);
            // }
          });
        } else if (key === "isAvailable") {
          // formData.append("isAvailable", value === "true");
          formData.append("isAvailable", value === "true" ? "true" : "false");
        } else {
          formData.append(key, value);
        }
      });
      try {
        await updateProductById(id, formData, token).then((res) => {
          // Invalidate both productFetch and productsList queries
          queryClient.invalidateQueries(["productFetch", id]);
          queryClient.invalidateQueries(["productsList"]);
          setSuccess("Product updated successfully!");
          setEditMode(false);
          toast.success("Product updated successfully");
        });
      } catch (err) {
        // console.log(err);
        setError("Failed to update product.");
        toast.error("Failed to update");
      } finally {
        setLoading(false);
      }
    },
  });

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
  const handleImageRemove = (imgToRemove) => {
    const updatedPhotos = formik.values.photos.filter(
      (img) => img !== imgToRemove
    );
    formik.setFieldValue("photos", updatedPhotos);
    // If the removed image was selected, select another or null
    if (selectedImage === imgToRemove) {
      setSelectedImage(updatedPhotos[0] || null);
    }
  };

  const handleImageInput = (e) => {
    const files = Array.from(e.target.files);
    // Add File objects to formik.values.photos
    const updatedPhotos = [...(formik.values.photos || []), ...files];
    formik.setFieldValue("photos", updatedPhotos);
    if (!selectedImage && files.length > 0) {
      setSelectedImage(files[0]);
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center gap-8 p-4 md:p-8 bg-gray-50 min-h-screen">
        <img src={Loader} alt="loader gif" className="w-10 h-10" />
      </div>
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
      <ToastContainer />
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm flex flex-col items-center border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Are you sure you want to delete this product?
            </h2>
            <div className="flex gap-4 mt-2">
              <button
                className="px-5 py-2 rounded-full bg-red-600 text-white font-medium shadow hover:bg-red-700 transition-colors"
                onClick={() => {
                  setShowDeleteModal(false);
                  handleDelete();
                }}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                className="px-5 py-2 rounded-full bg-gray-300 text-gray-700 font-medium shadow hover:bg-gray-400 transition-colors"
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl sm:shadow sm:p-8 w-full max-w-[700px] flex flex-col items-center">
        <button
          className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors self-start"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        {/* {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>} */}

        {editMode ? (
          <form
            onSubmit={formik.handleSubmit}
            className="w-full flex flex-col gap-4 items-center"
          >
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
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.name}
                </div>
              )}
            </div>
            <div className="w-full">
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
            {/* <div className="w-full">
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
            </div> */}
            {/* <div className="w-full">
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
            </div> */}
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
              />
              {formik.touched.price && formik.errors.price && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.price}
                </div>
              )}
            </div>
            <div className="w-full">
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
            <div className="w-full">
              <label className="block font-medium mb-1">Color</label>
              <input
                type="text"
                name="color"
                value={formik.values.color}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border rounded px-3 py-2"
              />
              {formik.touched.color && formik.errors.color && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.color}
                </div>
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
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.description}
                </div>
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
              {formik.touched.specifications &&
                formik.errors.specifications && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.specifications}
                  </div>
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
              <label
                htmlFor="image-upload"
                className="inline-block px-4 py-2 mb-3 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow"
              >
                Add Images
              </label>
              <div className="flex gap-2 flex-wrap">
                {Array.isArray(formik.values.photos) &&
                formik.values.photos.length > 0 ? (
                  formik.values.photos.map((img, idx) => {
                    let src =
                      typeof img === "string" ? img : URL.createObjectURL(img);
                    return (
                      <div key={idx} className="relative group">
                        <img
                          src={src}
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
                    );
                  })
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
            {Object.entries(product).map(([key, value]) => {
              if (key === "id") return null;
              if (key === "createdAt") return null;
              if (key === "price")
                return (
                  <div key={key} className="w-full mb-2">
                    <span className="font-medium capitalize">{key}: </span>
                    <p>{Number(value).toLocaleString()}</p>
                  </div>
                );
              if (key === "photos") {
                return (
                  <div key={key} className="w-full mb-2">
                    <span className="font-medium capitalize">Photos: </span>
                    {selectedImage && (
                      <div className="flex items-start justify-start mb-4 gap-4">
                        {Array.isArray(product.photos) &&
                          product.photos.length > 0 && (
                            <div className="flex flex-col gap-2 justify-start mt-1">
                              {product.photos.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt={`Thumbnail ${idx + 1}`}
                                  className={`w-8 h-8 sm:w-10 sm:h-8 object-cover rounded cursor-pointer border-2 ${
                                    selectedImage === img
                                      ? "border-blue-500"
                                      : "border-gray-200"
                                  } transition-all`}
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
              if (key === "description" || key === "specifications") {
                return (
                  <div key={key} className="w-full mb-2">
                    <span className="font-medium capitalize">{key}: </span>
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: value }}
                    />
                  </div>
                );
              }
              return (
                <div key={key} className="w-full mb-2">
                  <span className="font-medium capitalize">{key}: </span>
                  <p>{String(value)}</p>
                </div>
              );
            })}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mt-6">
              <button
                className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium text-base shadow-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
              <button
                className="px-6 py-2 rounded-full bg-red-600 text-white font-medium text-base shadow-md hover:bg-red-700 transition-colors w-full sm:w-auto"
                onClick={() => setShowDeleteModal(true)}
                disabled={loading}
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
