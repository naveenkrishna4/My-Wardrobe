import React, { useState } from 'react'
import './View.css'
import edit from '../../Images/edit.png'
import star_icon from '../../Images/star_icon.png'
import nostar_icon from '../../Images/star_dull_icon.png'
import cross_icon from '../../Images/cross_icon.png'
import { firestore } from '../../firebaseConfig';
import { doc , updateDoc ,  deleteDoc } from "firebase/firestore";

const View = (props) => {
  let val;
  let updater=props.fav;
  if(props.fav) val=star_icon;
  else val=nostar_icon;
  const[image, setImage] = useState(val);
  const change = async ()=>{
    updater=!props.fav;
    try {

      const docRef = doc(firestore, 'Data', props.id);
      await updateDoc(docRef, {
        fav : updater
      } )
    
      if(image===star_icon) setImage(nostar_icon);
      else setImage(star_icon);

    } catch (error) {
      console.error('Error updating document: ', error);
    }
  }
  const removeFun = async (id)=>{
      await deleteDoc(doc(firestore, 'Data', id));
      alert('Document successfully deleted!');
      props.onDelete(props.id);
  }
  const [isEditing,setIsEditing] = useState(false);
  const [des,setDes] = useState(props.description);

  const handleEdit = (e)=>{
    setDes(e.target.value);
  }

  const saveChange = async () => {
    try {
      const docRef = doc(firestore, 'Data', props.id);
      await updateDoc(docRef, {
        description : des
      } ).then(setIsEditing(false))
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  }


  return (
      <div className='item'>
        <div className='intro'>
        <img className="banner" src={props.image} alt="" />
        <img className="cross" onClick={()=>removeFun(props.id)} src={cross_icon} alt="" />
        </div>
        <div className='group'>
        <p className='item-category'>{props.title}</p>
        <img className='star' src={image} onClick={change} alt="" />
        </div>
        <br/>
        <div className='group'>
          {isEditing ? (
            <input type="text" id="edit-val" name="edit-val" placeholder={props.description} onChange={handleEdit}/>
           ) : ( <h3 id="h33" name="h33" className="item-desc">{des}</h3>  )}
          {!isEditing ? 
          (<img className='edit' src={edit} onClick={()=>{setIsEditing(!isEditing)}}  alt="" />)
          :(<button onClick={saveChange}>Edit</button>)
          }
        </div>
      </div>
  )
}

export default View;
