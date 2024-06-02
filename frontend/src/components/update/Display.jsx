import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import addicon from "../../Images/add-icon.png";
import View from "./View";
import "./Display.css";
import { firestore } from "../../firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";

const Display = () => {
  const [allProd, setAllProd] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const dataRef = collection(firestore, "Data");
      const snapshot = await getDocs(dataRef);
      const fetchedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllProd(fetchedData);
    };

    fetchData();
  }, []);

  const handleDelete = (id) => {
    setAllProd(allProd.filter((item) => item.id !== id));
  };

  return (
    <div className="main">
      {allProd.map((item) => (
        <View
          id={item.id}
          title={item.title}
          description={item.description}
          fav={item.fav}
          image={item.image}
          category={item.category}
          onDelete={handleDelete}
        />
      ))}

      <div className="add-dis">
        <Link to={"/addproduct"} style={{ textDecoration: "none" }}>
          <img className="img-add" src={addicon} alt="" />
          <h3 className="desc-add">Add Costumes</h3>
        </Link>
      </div>
    </div>
  );
};
export default Display;
