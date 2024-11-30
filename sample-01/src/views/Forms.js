import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import UserInfoForm from "../components/UserInfoForm";

const Forms = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/get-user-info?email=${user.email}`);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setUserData(null);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, user]);

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleFormSubmit = () => {
    setIsEditMode(false);
    fetchData(); // Refresh data after update
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container mt-4">
      {!userData && !isEditMode && (
        <UserInfoForm onSubmit={handleFormSubmit} />
      )}

      {userData && !isEditMode && (
        <div className="dashboard">
          <h2>My Health Profile</h2>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{`${userData.firstname} ${userData.lastname}`}</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Age:</strong> {userData.age} years
                </li>
                <li className="list-group-item">
                  <strong>Weight:</strong> {userData.poids} kg
                </li>
                <li className="list-group-item">
                  <strong>Height:</strong> {userData.taille} cm
                </li>
                <li className="list-group-item">
                  <strong>Blood Type:</strong> {userData.rhesus}
                </li>
                <li className="list-group-item">
                  <strong>Allergies:</strong> {userData.allergies || 'None'}
                </li>
              </ul>
              <button 
                className="btn btn-primary mt-3" 
                onClick={handleEditClick}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}
     {isEditMode && (
        <UserInfoForm 
          initialData={userData}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default Forms;