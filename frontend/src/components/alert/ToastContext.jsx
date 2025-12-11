import toast from "react-hot-toast";

// Success notification (Green)
export const notifySuccess = (message) => {
  toast.success(message, {
    style: {
      border: "1px solid #10B981",
      padding: "16px",
      color: "#10B981",
    },
    iconTheme: {
      primary: "#10B981",
      secondary: "#FFFAEE",
    },
  });
};

// Error notification (Red)
export const notifyError = (message) => {
  toast.error(message, {
    style: {
      border: "1px solid #EF4444",
      padding: "16px",
      color: "#EF4444",
    },
    iconTheme: {
      primary: "#EF4444",
      secondary: "#FFFAEE",
    },
  });
};

// Info notification
export const notifyInfo = (message) => {
  toast(message);
};
