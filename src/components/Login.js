import { checkValidData } from "../utils/validate";
import Header from "./Header";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const navigate = useNavigate();
    const [isSignInForm, setIsSignInForm] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [successMessage, setSuccessMessage] = useState(null);

    const toggleSignInForm = () => {
        setIsSignInForm(!isSignInForm);
    };

    const email = useRef(null);
    const password = useRef(null);
    const name = useRef(null);

    const handleButtonClick = async () => {
        const message = checkValidData(email.current.value, password.current.value);
        setErrorMessage(message);

        if (message) return;

        const endpoint = isSignInForm ? "login" : "signup";
        const res = await fetch(
        `http://localhost:8000/api/auth/${endpoint}`,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(
                isSignInForm
                    ? {
                        email: email.current.value,
                        password: password.current.value,
                    }
                    : {
                        name: name.current.value,
                        email: email.current.value,
                        password: password.current.value,
                    }
            ),
        }
        );

        const data = await res.json();

        if (!res.ok) {
            setErrorMessage(data.message || "Something went wrong");
            return;
        }

        setSuccessMessage(data.message || "Successfully submitted!");

        navigate("/browse");

        localStorage.setItem("token", data.token);
    };


    return (
         <div>
            <Header />
            <div className="absolute">
                <img 
                src="https://assets.nflxext.com/ffe/siteui/vlv3/435e8bb8-7f1b-49cb-8da8-bff997124294/web/IN-en-20260511-TRIFECTA-perspective_ec39852e-0b48-4e8a-b415-dd8376cd83ce_large.jpg" 
                alt="Logo" />
            </div>
            <form 
                onSubmit = {(e) => e.preventDefault()} 
                className="w-3/12 absolute p-12 bg-black my-36 mx-auto right-0 left-0 text-white"
            >

                <h1 className="text-3xl font-bold  py-4">
                    {isSignInForm ? "Sign In" : "Sign Up"}
                </h1>
                {
                    (!isSignInForm && 
                        <input
                            id="name"
                            name="name"
                            ref={name}
                            type="text"
                            placeholder="full name"
                            autoComplete="name"
                            className="p-2 my-2 w-full text-black"
                        />
                    )
                }
                <input 
                    id="email"
                    name="email"
                    ref={email}
                    type="email" 
                    placeholder="Email or phone number" 
                    autoComplete="email"
                    className="p-2 my-2 w-full text-black" 
                />
                <input 
                    id="password"
                    name="password"
                    ref={password}
                    type="password" 
                    placeholder="Password" 
                    autoComplete="current-password"
                    className="p-2 my-2 w-full text-black" 
                />

                <p className="text-red-500">{errorMessage}</p>
                <p className="text-green-500">{successMessage}</p>

                <button className="p-4 my-4 bg-red-700 w-full" onClick={handleButtonClick}>
                    {isSignInForm ? "Sign In" : "Sign Up"}
                </button>
                <p className="py-4 cursor-pointer" onClick={toggleSignInForm}>
                    {isSignInForm? "New to Netflix? Sign Up Now" : "Already have an account? Sign In"}
                </p>
            </form>
        </div>
    )
}

export default Login;