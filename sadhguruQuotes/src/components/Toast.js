import React from "react";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const commonStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  fontSize: "calc(8px + 1vmin)",
  fontFamily: "Sadhguru Thin",
  padding: "6px",
  backgroundColor: "rgb(138, 70, 6)",
};

const successStyle = { ...commonStyle };

const errorStyle = {
  ...commonStyle,
};

const notify = (type, message, style) =>
  toast[type](message, {
    position: "bottom-center",
    style: style,
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

export const notifySuccess = (message) =>
  notify("success", message, successStyle);

export const notifyError = (message) => notify("error", message, errorStyle);

export const Toast = () => (
  <ToastContainer
    transition={Slide}
    position="bottom-center"
    hideProgressBar
    newestOnTop={false}
    closeButton={false}
    closeOnClick
    rtl={false}
    draggable
  />
);
