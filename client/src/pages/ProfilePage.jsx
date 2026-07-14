import { useEffect, useState } from "react";
import API from "../utils/api";
import "./ProfilePage.css";

function ProfilePage() {

    const [user, setUser] = useState({
        _id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        role: ""
    });

    useEffect(() => {

        fetchProfile();

    }, []);

    const fetchProfile = async () => {

        try {

            const res = await API.get("/auth/profile");

            setUser(res.data);

        }

        catch (error) {

            console.log(error);

            const currentUser = JSON.parse(localStorage.getItem("user"));

            if (currentUser) {

                setUser(currentUser);

            }

        }

    };

    const changeHandler = (e) => {

        setUser({

            ...user,

            [e.target.name]: e.target.value

        });

    };

    const updateProfile = async () => {

        try {

            const res = await API.put(

                `/auth/profile/${user._id}`,

                {

                    name: user.name,
                    phone: user.phone,
                    address: user.address

                }

            );

            localStorage.setItem(

                "user",

                JSON.stringify(res.data)

            );

            setUser(res.data);

            alert("Profile Updated Successfully");

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Unable to Update Profile"

            );

        }

    };

    return (

        <div className="profile-page">

            <div className="profile-card">

                <h1>My Profile</h1>

                <label>Name</label>

                <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={changeHandler}
                />

                <label>Email</label>

                <input
                    type="email"
                    value={user.email}
                    disabled
                />

                <label>Phone</label>

                <input
                    type="text"
                    name="phone"
                    value={user.phone}
                    onChange={changeHandler}
                />

                <label>Address</label>

                <textarea
                    rows="4"
                    name="address"
                    value={user.address}
                    onChange={changeHandler}
                />

                <label>Role</label>

                <input
                    value={user.role}
                    disabled
                />

                <button
                    onClick={updateProfile}
                >

                    Update Profile

                </button>

            </div>

        </div>

    );

}

export default ProfilePage;