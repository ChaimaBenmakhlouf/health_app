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
    // Populate form with initial data if provided (edit mode)
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
    console.log("Form Data Submitted:", formData);
    console.log("user email:", user.email);

    // Add the email field to the formData
    const payload = {
      ...formData,
      email: user.email
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

  return (
    <div>
      <h2>{initialData ? "Edit Personal Information" : "Personal Information Form"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Weight (kg):</label>
          <input
            type="number"
            name="poids"
            value={formData.poids}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Height (cm):</label>
          <input
            type="number"
            name="taille"
            value={formData.taille}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Rhesus:</label>
          <select
            name="rhesus"
            value={formData.rhesus}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
          </select>
        </div>
        <div>
          <label>Allergies (comma-separated):</label>
          <input
            type="text"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
          />
        </div>
        <button type="submit">
          {initialData ? "Update Profile" : "Submit"}
        </button>
      </form>
    </div>
  );
};


export default UserInfoForm;
