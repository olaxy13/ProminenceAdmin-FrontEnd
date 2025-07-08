import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      // Handle login logic here
      alert(`Email: ${values.email}\nPassword: ${values.password}`);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center sm:bg-gray-100 ">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded-xl sm:shadow-md w-full max-w-sm flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-center mb-2">Login</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoComplete="email"
          />
          {formik.touched.email && formik.errors.email && (
            <span className="text-red-500 text-xs">{formik.errors.email}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoComplete="current-password"
          />
          {formik.touched.password && formik.errors.password && (
            <span className="text-red-500 text-xs">
              {formik.errors.password}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-full bg-blue-600 text-white font-medium text-base shadow-md hover:bg-blue-700 transition-colors mt-2"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
