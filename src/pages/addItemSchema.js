import * as Yup from "yup";

export const addItemSchema = Yup.object().shape({
  product: Yup.string().required("Product is required"),
  name: Yup.string().required("Name is required"),
  brand: Yup.string().required("Brand is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .min(0, "Price must be at least 0")
    .required("Price is required"),
  description: Yup.string().required("Description is required"),
  images: Yup.array()
    .of(
      Yup.mixed().test("fileType", "Only image files are allowed", (value) => {
        if (!value) return true;
        return value.type && value.type.startsWith("image/");
      })
    )
    .min(1, "At least one image is required"),
});
