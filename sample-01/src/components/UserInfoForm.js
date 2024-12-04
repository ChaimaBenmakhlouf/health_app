import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const UserInfoForm = ({ initialData, onSubmit }) => {
  const { user } = useAuth0();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    age: "",
    poids: "",
    taille: "",
    rhesus: "",
    allergies: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstname: initialData.firstname,
        lastname: initialData.lastname,
        age: initialData.age.toString(),
        poids: initialData.poids.toString(),
        taille: initialData.taille.toString(),
        rhesus: initialData.rhesus,
        allergies: initialData.allergies || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      email: user.email,
    };

    const url = initialData 
      ? "http://localhost:3001/update-user-info" 
      : "http://localhost:3001/save-user-info";

    const method = initialData ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          alert(initialData ? "Data updated successfully!" : "Data submitted successfully!");
          onSubmit(); // Callback to parent component
        } else {
          throw new Error("Submission failed.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Styles en ligne pour le formulaire
  const styles = {
    container: {
      maxWidth: "600px",
      margin: "auto",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
    header: {
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "1.8rem",
      color: "#333",
    },
    formGroup: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      fontWeight: "bold",
      marginBottom: "5px",
      color: "#555",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      fontSize: "1rem",
      color: "#333",
    },
    select: {
      width: "100%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      fontSize: "1rem",
      color: "#333",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#4CAF50",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "1.2rem",
      marginTop: "20px",
      width: "100%",
    },
    buttonDisabled: {
      padding: "10px 20px",
      backgroundColor: "#ccc",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "not-allowed",
      fontSize: "1.2rem",
      marginTop: "20px",
      width: "100%",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>
        {initialData ? "Edit Personal Information" : "Personal Information Form"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>First Name:</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Last Name:</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Weight (kg):</label>
          <input
            type="number"
            name="poids"
            value={formData.poids}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Height (cm):</label>
          <input
            type="number"
            name="taille"
            value={formData.taille}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Rhesus:</label>
          <select
            name="rhesus"
            value={formData.rhesus}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="">Select...</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Allergies (comma-separated):</label>
          <input
            type="text"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          {initialData ? "Update Profile" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default UserInfoForm;
