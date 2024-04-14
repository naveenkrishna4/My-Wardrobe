// UploadForm.js

import React, { useState } from 'react';
import { storage, firestore } from '../../firebaseConfig'; // Import storage and firestore from your firebaseConfig file
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

function UploadForm() {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      await addDoc(collection(firestore, 'wardrobe'), {
        imageUrl,
        title,
        description,
        category,
        date: new Date(),
      });

      setImage(null);
      setTitle('');
      setDescription('');
      setCategory('');
      alert('Wardrobe item uploaded successfully!');
    } catch (error) {
      console.error('Error uploading wardrobe item:', error);
      alert('An error occurred while uploading the wardrobe item. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Upload Wardrobe Item</h2>
      <form onSubmit={handleSubmit}>
        <label>Image:</label>
        <input type="file" onChange={handleImageChange} required />
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        <label>Category:</label>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default UploadForm;
