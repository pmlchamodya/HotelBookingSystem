import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔄 AdminFacilities component mounted");
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      console.log("📡 Fetching facilities...");
      const response = await axios.get("http://localhost:5000/api/facilities");
      console.log("✅ Data received:", response.data);
      setFacilities(response.data);
    } catch (error) {
      console.error("❌ Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTestFacility = async () => {
    try {
      await axios.post("http://localhost:5000/api/facilities", {
        name: "Swimming Pool",
        description: "Outdoor heated swimming pool with lifeguard",
        category: "Recreation",
        features: ["Heated pool", "Towels provided", "Lifeguard on duty"],
        timings: "6:00 AM - 10:00 PM",
        icon: "fas fa-swimming-pool"
      });
      fetchFacilities();
      alert("Test facility added!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteFacility = async (id) => {
    if (window.confirm("Delete this facility?")) {
      try {
        await axios.delete(`http://localhost:5000/api/facilities/${id}`);
        fetchFacilities();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  // If loading, show loading message
  if (loading) {
    return (
      <div style={{
        padding: "50px",
        textAlign: "center",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh"
      }}>
        <h2>Loading facilities...</h2>
        <p>Please wait while we fetch the data</p>
      </div>
    );
  }

  // If no facilities
  if (facilities.length === 0) {
    return (
      <div style={{
        padding: "50px",
        textAlign: "center",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh"
      }}>
        <h1>Facilities Management</h1>
        <div style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          maxWidth: "500px",
          margin: "0 auto"
        }}>
          <h3>No Facilities Found</h3>
          <p>Add your first facility to get started</p>
          <button
            onClick={addTestFacility}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "20px"
            }}
          >
            Add Test Facility
          </button>
        </div>
      </div>
    );
  }

  // Show facilities list
  return (
    <div style={{
      padding: "20px",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
      }}>
        <h1 style={{ color: "#333", margin: 0 }}>Facilities Management</h1>
        <button
          onClick={addTestFacility}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          + Add Test Facility
        </button>
      </div>

      <div style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        marginBottom: "20px"
      }}>
        <h3 style={{ marginTop: 0 }}>Summary</h3>
        <p>Total Facilities: <strong>{facilities.length}</strong></p>
        <p>Active: <strong>{facilities.filter(f => f.isActive).length}</strong></p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px"
      }}>
        {facilities.map((facility) => (
          <div
            key={facility._id}
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              borderLeft: "4px solid #007bff"
            }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "15px"
            }}>
              <h3 style={{ margin: 0, color: "#333" }}>{facility.name}</h3>
              <button
                onClick={() => deleteFacility(facility._id)}
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                Delete
              </button>
            </div>

            <p style={{ color: "#666", marginBottom: "15px" }}>
              {facility.description}
            </p>

            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <span style={{
                backgroundColor: "#e9ecef",
                color: "#495057",
                padding: "3px 10px",
                borderRadius: "20px",
                fontSize: "12px"
              }}>
                {facility.category}
              </span>
              <span style={{
                backgroundColor: facility.isActive ? "#d4edda" : "#f8d7da",
                color: facility.isActive ? "#155724" : "#721c24",
                padding: "3px 10px",
                borderRadius: "20px",
                fontSize: "12px"
              }}>
                {facility.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "15px",
              borderTop: "1px solid #eee",
              color: "#888",
              fontSize: "14px"
            }}>
              <span>⏰ {facility.timings}</span>
              <span style={{ fontSize: "12px" }}>
                Added: {new Date(facility.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFacilities;