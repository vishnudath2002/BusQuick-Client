import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {  useDispatch ,  useSelector} from "react-redux";
import { performLogout } from "../../redux/actions/authActions";
import ProfileForm from "../../components/auth/ProfileForm";
import { getUserProfile } from "../../api/userApi"; 
import toast from "react-hot-toast";
import { logout  } from "../../api/authApi";
import { updateUserName, updateUserPhone, updateUserPassword , uploadUserProfilePicture} from "../../api/userApi";



const ProfilePage: React.FC = () => {
  interface RootState {
    user: {
      email: string ;
    };
  }
  const navigate = useNavigate();
  const defaultProfileData = {
    id: "",
    name: "John Doe",
    phone: "1234567890",
    password: "********",
    photo: "",
  };


  const [editingField, setEditingField] = useState<string | null>(null);
  const [profileData, setProfileData] = useState(defaultProfileData);
  const dispatch = useDispatch();

  
  const email = useSelector((state: RootState) => state.user.email);

  useEffect(() => {
  
    const fetchProfile = async () => {
       try {
        const data = await getUserProfile();
      
        setProfileData({
          id: data.user.id,
          name: data.user.name,
          phone: data.user.phone,
          password: "********",
          photo: data.user.photo
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchProfile();
    
  },[]);

  const handleLogout = async () => {
    await logout();
    dispatch(performLogout());
    toast.success("You have successfully logged out.");
    navigate("/login");
  };

  const handleEditField = (field: string) => {
    setEditingField(field);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
  };

  const handleSaveField = async (field: string, value: string , oldPassword?: string ) => {
    try {
      if (field === "name") {
        await updateUserName(profileData.id, value);
        toast.success("Name updated successfully");
      } else if (field === "phone") {
        await updateUserPhone(profileData.id, value);
        toast.success("Phone updated successfully");
      } else if (field === "password" && oldPassword) {
        if (!email) {
          toast.error("Email is missing. Please log in again.");
          return;
        }
        await updateUserPassword(email, oldPassword, value);
        toast.success("Password updated successfully");
      } else if(field == "photo"){
        
      const uploadedPhotoUrl = await uploadUserProfilePicture(profileData.id, value);
      if (uploadedPhotoUrl) {
        setProfileData((prev) => ({ ...prev, photo: uploadedPhotoUrl }));
        toast.success("Profile picture updated successfully");
      } else {
        toast.error("Failed to upload profile picture");
      }
      return;
      }
  
      setProfileData((prev) => ({ ...prev, [field]: value }));
      setEditingField(null);
    } catch (error) {
      toast.error(`Failed to update ${field}`);
      console.error(`Error updating ${field}:`, error);
    }
  };

  const handleResetProfile = () => {
    setProfileData(defaultProfileData);
  };

  return (
    <ProfileForm
      profileData={profileData}
      editingField={editingField}
      onEditField={handleEditField}
      onCancelEdit={handleCancelEdit}
      onSaveField={handleSaveField}
      onLogout={handleLogout}
      onResetProfile={handleResetProfile}
    />
  );
};

export default ProfilePage;
