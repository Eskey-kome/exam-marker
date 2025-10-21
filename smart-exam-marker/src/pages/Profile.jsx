import React, { useState, useEffect } from "react";
import "../styles/Profile.css";

export default function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "Examiner",
    institution: "",
    avatar: "",
  });
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    // Fetch user data from backend (placeholder)
    fetch("http://localhost:5000/api/user/profile")
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => console.log("Using default user data"));
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const res = await fetch("http://localhost:5000/api/user/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (res.ok) {
      setEditing(false);
      alert("Profile updated successfully!");
    }
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <div className="profile-card">
        <div className="profile-avatar">
          <img
            src={preview || user.avatar || "/images/default-avatar.png"}
            alt="User avatar"
          />
          {editing && <input type="file" onChange={handleFileChange} />}
        </div>

        <div className="profile-info">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              disabled={!editing}
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              disabled={!editing}
            />
          </label>

          <label>
            Institution:
            <input
              type="text"
              name="institution"
              value={user.institution}
              onChange={handleChange}
              disabled={!editing}
            />
          </label>

          <label>
            Role:
            <input type="text" value={user.role} disabled />
          </label>

          <div className="profile-actions">
            {editing ? (
              <>
                <button className="btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="btn-outline" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn-primary" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
