import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaUserShield
} from "react-icons/fa";

import API from "../utils/api";
import "./RegisterPage.css";

function RegisterPage() {

  const navigate = useNavigate();

  const [showPassword,setShowPassword]=useState(false);
  const [showConfirm,setShowConfirm]=useState(false);

  const [user,setUser]=useState({

    name:"",
    email:"",
    phone:"",
    address:"",
    password:"",
    confirmPassword:"",
    role:"User"

  });

  const handleChange=(e)=>{

    setUser({

      ...user,
      [e.target.name]:e.target.value

    });

  };

  const handleSubmit=async(e)=>{

    e.preventDefault();

    if(user.password!==user.confirmPassword){

      alert("Passwords do not match");
      return;

    }

    try{

      const {confirmPassword,...userData}=user;

      const res=await API.post("/auth/register",userData);

      alert(res.data.message || "Registration Successful");

      navigate("/login");

    }
    catch(err){

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Registration Failed"
      );

    }

  };

  return(

<div className="register-page">

<div className="register-left">

<div className="overlay">

<div className="hero-content">

<span className="small-title">

🪷 DarshanEase

</span>

<h1>

Begin Your
<br/>

<span>Spiritual Journey</span>

</h1>

<p>

Create your account and enjoy
secure temple darshan booking
with ease.

</p>

<div className="quote-box">

<p>

"Every temple visit begins with
a pure heart and peaceful mind."

</p>

</div>

</div>

</div>

</div>

<div className="register-right">

<div className="register-card">

<div className="icon-circle">

🪷

</div>

<h2>Create Account</h2>

<p className="subtitle">

Join thousands of devotees today

</p>

<form onSubmit={handleSubmit}>

<label>Full Name</label>

<div className="input-box">

<FaUser className="input-icon"/>

<input

type="text"
name="name"
placeholder="Enter your full name"
value={user.name}
onChange={handleChange}
required

/>

</div>

<label>Email Address</label>

<div className="input-box">

<FaEnvelope className="input-icon"/>

<input

type="email"
name="email"
placeholder="Enter email"
value={user.email}
onChange={handleChange}
required

/>

</div>

<label>Phone Number</label>

<div className="input-box">

<FaPhone className="input-icon"/>

<input

type="text"
name="phone"
placeholder="Enter phone number"
value={user.phone}
onChange={handleChange}
required

/>

</div>

<label>Select Role</label>

<div className="input-box">

<FaUserShield className="input-icon"/>

<select

name="role"
value={user.role}
onChange={handleChange}

>

<option value="User">

Devotee

</option>

<option value="Organizer">

Organizer

</option>

</select>

</div>

<input

type="hidden"
name="address"
value="Not Specified"

/>

<label>Password</label>

<div className="input-box">

<FaLock className="input-icon"/>

<input

type={showPassword?"text":"password"}

name="password"

placeholder="Create password"

value={user.password}

onChange={handleChange}

required

/>

<div

className="eye"

onClick={()=>setShowPassword(!showPassword)}

>

{showPassword?<FaEyeSlash/>:<FaEye/>}

</div>

</div>

<label>Confirm Password</label>

<div className="input-box">

<FaLock className="input-icon"/>

<input

type={showConfirm?"text":"password"}

name="confirmPassword"

placeholder="Confirm password"

value={user.confirmPassword}

onChange={handleChange}

required

/>

<div

className="eye"

onClick={()=>setShowConfirm(!showConfirm)}

>

{showConfirm?<FaEyeSlash/>:<FaEye/>}

</div>

</div>

<div className="remember">

<label>

<input type="checkbox" required/>

I agree to Terms &
Privacy Policy

</label>

</div>

<button className="register-btn">

<FaArrowRight/>

Register

</button>

</form>

<p className="bottom">

Already have an account?

<Link to="/login">

Login

</Link>

</p>

</div>

</div>

</div>

);

}

export default RegisterPage;