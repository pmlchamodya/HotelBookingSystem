import toast from "react-hot-toast";

// --- SUCCESS NOTIFICATION ---
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

// --- ERROR NOTIFICATION ---
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

// --- INFO NOTIFICATION ---
export const notifyInfo = (message) => {
  toast(message);
};

// --- CONFIRMATION NOTIFICATION (SMART DELETE) ---

export const notifyConfirm = (message, onConfirm) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-3 items-center p-2 min-w-[250px]">
        {/* Message Text */}
        <div className="font-semibold text-gray-800 text-center">
          ⚠️ {message}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-1">
          {/* Cancel Button */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition"
          >
            Cancel
          </button>

          {/* Confirm/Delete Button */}
          <button
            onClick={() => {
              onConfirm();
              toast.dismiss(t.id);
            }}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    ),
    {
      duration: 5000,
      position: "top-center",
      style: {
        background: "#fff",
        border: "1px solid #f3f4f6",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        padding: "16px",
        borderRadius: "12px",
      },
    }
  );
};
