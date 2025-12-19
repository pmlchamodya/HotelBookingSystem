import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import {
  notifySuccess,
  notifyError,
  notifyConfirm,
} from "../../../components/alert/ToastContext";

const AdminInquiry = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Fetch all inquiries
  const fetchInquiries = async () => {
    try {
      const res = await api.get("/inquiries");
      setInquiries(res.data);
    } catch (err) {
      console.error("Failed to load inquiries", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Update inquiry status
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/inquiries/${id}/status`, { status: newStatus });
      notifySuccess(`Marked as ${newStatus}`);
      fetchInquiries();
      if (selectedInquiry && selectedInquiry._id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    } catch (err) {
      console.error(err);
      notifyError("Failed to update status");
    }
  };

  // Open email client for reply
  const handleReply = (email, subject) => {
    const mailtoLink = `mailto:${email}?subject=Re: ${subject}&body=Dear Customer,%0D%0A%0D%0AThank you for contacting King of Asia.%0D%0A%0D%0A`;
    window.location.href = mailtoLink;
  };

  // Delete inquiry
  const handleDelete = async (id) => {
    notifyConfirm("Are you sure you want to delete this message?", async () => {
      try {
        await api.delete(`/inquiries/${id}`);
        notifySuccess("Message deleted successfully");
        setInquiries(inquiries.filter((item) => item._id !== id));
        setSelectedInquiry(null);
      } catch (err) {
        console.error(err);
        notifyError("Failed to delete message");
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-red-100 text-red-600 border-red-200";
      case "read":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "replied":
        return "bg-green-100 text-green-600 border-green-200";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading)
    return <div className="text-center p-10">Loading Messages...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-fade-in relative">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span>📩</span> Inquiry Inbox (Admin)
        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500">
          Total: {inquiries.length}
        </span>
      </h3>

      {inquiries.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          No new messages found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                <th className="p-4">Status</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {inquiries.map((inq) => (
                <tr key={inq._id} className="hover:bg-blue-50/50 transition">
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                        inq.status
                      )} uppercase`}
                    >
                      {inq.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-gray-800">{inq.name}</p>
                    <p className="text-xs text-gray-500">{inq.email}</p>
                  </td>
                  <td
                    className="p-4 cursor-pointer"
                    onClick={() => setSelectedInquiry(inq)}
                  >
                    <p className="font-medium text-gray-700 hover:text-blue-600">
                      {inq.subject}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-xs">
                      {inq.message}
                    </p>
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    {/* View Button */}
                    <button
                      onClick={() => setSelectedInquiry(inq)}
                      className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 rounded text-xs font-bold transition"
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleReply(inq.email, inq.subject)}
                      className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1 rounded text-xs font-bold transition"
                    >
                      Reply
                    </button>
                    {inq.status !== "replied" && (
                      <button
                        onClick={() => handleStatusUpdate(inq._id, "replied")}
                        className="bg-green-100 text-green-600 hover:bg-green-200 px-3 py-1 rounded text-xs font-bold transition"
                      >
                        Done
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(inq._id)}
                      className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded text-xs font-bold transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MESSAGE VIEW MODAL --- */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                Message Details
              </h3>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-gray-400 hover:text-red-500 transition text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {selectedInquiry.subject}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">
                      {selectedInquiry.name}
                    </span>
                    <span>&lt;{selectedInquiry.email}&gt;</span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                      selectedInquiry.status
                    )} uppercase block mb-1`}
                  >
                    {selectedInquiry.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-200 transition"
              >
                Close
              </button>
              <button
                onClick={() =>
                  handleReply(selectedInquiry.email, selectedInquiry.subject)
                }
                className="px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md transition"
              >
                Reply via Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInquiry;
