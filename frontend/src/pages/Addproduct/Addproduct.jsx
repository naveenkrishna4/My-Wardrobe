import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import upload from "../../Images/upload_area.svg";
import "./Addproduct.css";
import { firestore, storage } from "../../firebaseConfig.js";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Addproduct = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    fav: false,
    date: new Date(),
    category: "Formal",
    image: "",
  });
  const history = useNavigate();

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const addProduct = async () => {
    if (!image) {
      alert("Please upload an image.");
      return;
    }

    setLoading(true);

    try {
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      const productData = { ...data, image: imageUrl, date: new Date() };
      await addDoc(collection(firestore, "Data"), productData);
      alert("Product added successfully");
      history("/upload"); // Replace with your update page route
    } catch (error) {
      console.error("Error uploading product:", error);
      alert(
        "An error occurred while uploading the product. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addprod">
      <div className="addprod-item-field">
        <p>Product title</p>
        <input
          type="text"
          name="title"
          value={data.title}
          placeholder="Type Here"
          onChange={change}
        />
      </div>
      <div className="addprod-desc">
        <div className="addprod-item-field">
          <p>Description</p>
          <input
            type="text"
            name="description"
            value={data.description}
            style={{ width: "590px", height: "40px" }}
            onChange={change}
            placeholder="Type Here"
          />
        </div>
        <div className="addprod-item-field">
          <p>Favourite?</p>
          <input
            type="checkbox"
            name="fav"
            checked={data.fav}
            style={{ width: "50px", height: "35px" }}
            onChange={change}
          />
        </div>
      </div>
      <div className="addprod-item-field">
        <p>Product Category</p>
        <select
          name="category"
          value={data.category}
          onChange={change}
          className="addprod-selector"
        >
          <option value="Formal">Formal</option>
          <option value="Casual">Casual</option>
          <option value="Gen-Z">Gen-Z</option>
          <option value="Traditional">Traditional</option>
        </select>
      </div>
      <div className="addprod-item-field">
        <label htmlFor="fileInput">
          <img
            src={image ? URL.createObjectURL(image) : upload}
            className="addprod-thumbnail"
            alt=""
          />
        </label>
        <input
          type="file"
          id="fileInput"
          onChange={imageHandler}
          style={{ display: "none" }}
        />
      </div>
      <button
        onClick={addProduct}
        className="addprod-button"
        disabled={loading}
      >
        {loading ? "Adding..." : "ADD"}
      </button>
    </div>
  );
};

export default Addproduct;
