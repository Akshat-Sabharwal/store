import { useFirebase } from "@/hooks";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
} from "firebase/auth";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

const { auth } = useFirebase();

const signUpGoogle = async () => {
  const google = new GoogleAuthProvider();
  await signInWithRedirect(auth, google);
};

const signUpGithub = async () => {
  const github = new GithubAuthProvider();
  await signInWithRedirect(auth, github);
};

const Login = () => {
  return (
    <div className="w-full flex flex-col justify-start items-center p-4 gap-3 rounded-lg shadow-lg">
      <button
        className="border-2 border-zinc-300 rounded-lg p-2 px-6 sm:px-10 flex justify-start items-center hover:bg-zinc-100"
        onClick={async () => await signUpGoogle()}
      >
        <span className="flex justify-start items-center gap-3">
          <FcGoogle size="1.5rem" />
          <p className="text-md text-zinc-500 pt-0.5">Sign in with Google</p>
        </span>
      </button>
      <button
        className="border-2 border-zinc-300 rounded-lg p-2 px-6 sm:px-10 flex justify-start items-center hover:bg-zinc-100"
        onClick={async () => await signUpGithub()}
      >
        <span className="flex justify-start items-center gap-3">
          <FaGithub size="1.5rem" />
          <p className="text-md text-zinc-500 pt-0.5">Sign in with Github</p>
        </span>
      </button>
    </div>
  );
};

const Signup = () => {
  return (
    <div className="w-full flex flex-col justify-start items-center p-4 gap-3 rounded-lg shadow-lg">
      <button
        className="border-2 border-zinc-300 rounded-lg p-2 px-6 sm:px-10 flex justify-start items-center hover:bg-zinc-100"
        onClick={async () => await signUpGoogle()}
      >
        <span className="flex justify-start items-center gap-3">
          <FcGoogle size="1.5rem" />
          <p className="text-md text-zinc-500 pt-0.5">Sign up with Google</p>
        </span>
      </button>
      <button
        className="border-2 border-zinc-300 rounded-lg p-2 px-6 sm:px-10 flex justify-start items-center hover:bg-zinc-100"
        onClick={async () => await signUpGithub()}
      >
        <span className="flex justify-start items-center gap-3">
          <FaGithub size="1.5rem" />
          <p className="text-md text-zinc-500 pt-0.5">Sign up with Github</p>
        </span>
      </button>
    </div>
  );
};

export const Auth = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const { auth } = useFirebase();
  const navigate = useNavigate();

  const toggleTab = (tab: "login" | "signup") => {
    const login = document.getElementsByClassName("login-tab").item(0);
    const signup = document.getElementsByClassName("signup-tab").item(0);

    switch (tab) {
      case "login":
        setActiveTab("login");

        signup?.classList.remove("bg-accent-400");
        login?.classList.add("bg-accent-400");

        break;

      case "signup":
        setActiveTab("signup");

        login?.classList.remove("bg-accent-400");
        signup?.classList.add("bg-accent-400");

        break;
    }
  };

  onAuthStateChanged(auth, () => {
    if (auth.currentUser) {
      navigate("/dashboard/");
    }
  });

  return (
    <div className="size-full flex flex-col justify-center items-center h-full">
      <div className="flex flex-col justify-start items-center size-full pt-24 sm:pt-32 shadow-sm rounded-lg bg-white">
        <div className="max-w-[30rem] flex flex-col justify-start items-center gap-6">
          <h1 className="text-accent-800 text-5xl md:text-6xl mb-4">store</h1>
          <>
            {/* TAB */}
            <div className="w-[11rem] flex flex-row justify-evenly items-center gap-1 p-2 rounded-lg shadow-md">
              <button
                className="login-tab bg-accent-400 text-accent-800 w-full text-center px-3 py-2 pb-1.5 rounded-lg text-lg outline-none"
                onClick={() => toggleTab("login")}
              >
                Login
              </button>
              <button
                className="signup-tab text-accent-800 w-full text-center px-3 py-2 pb-1.5 rounded-lg text-lg outline-none"
                onClick={() => toggleTab("signup")}
              >
                Signup
              </button>
            </div>

            {activeTab === "login" ? <Login /> : <Signup />}
          </>
        </div>
      </div>
    </div>
  );
};
