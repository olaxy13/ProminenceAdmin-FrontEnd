import * as Yup from "yup";

export const addItemSchema = Yup.object().shape({
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
      Yup.mixed().test("fileType", "Only image files are allowed", (value) => {
        if (!value) return true;
        return value.type && value.type.startsWith("image/");
      })
    )
    .min(1, "At least one image is required"),
 
});
