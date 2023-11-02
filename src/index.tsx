import React, { useEffect, useState } from "react";
import { getloyaltyMiles } from "./api/get-loyaltyMiles";
import { BasicUserInfo, useAuthContext } from "@asgardeo/auth-react";

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [responseMsg, setResponseMsg] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleGetButtonClick = async () => {
    if (signedIn) {
      setIsLoading(true);
      const accessToken = await getAccessToken();
      getloyaltyMiles(accessToken, inputValue)
        .then((res) => {
          console.log(res);
          setResponseMsg(res.data);
          setIsLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  async function getUser() {
    setIsLoading(true);
    const userResponse = await getBasicUserInfo();
    setUser(userResponse);
    setIsLoading(false);
  }

  const {
    signIn,
    signOut,
    getAccessToken,
    isAuthenticated,
    getBasicUserInfo,
    state,
  } = useAuthContext();

  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState<BasicUserInfo | null>(null);
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  useEffect(() => {
    async function signInCheck() {
      setIsAuthLoading(true);
      await sleep(2000);
      const isSignedIn = await isAuthenticated();
      setSignedIn(isSignedIn);
      setIsAuthLoading(false);
      return isSignedIn;
    }

    signInCheck().then((res) => {
      if (res) {
        getUser();
      } else {
        console.log("User has not signed in");
      }
    });
  }, []);

  const handleSignIn = async () => {
    signIn()
      .then(() => {
        setSignedIn(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  if (isAuthLoading) {
    return <div className="animate-spin h-5 w-5 text-white">.</div>;
  }

  if (!signedIn) {
    return (
      <button
        className="float-right bg-black bg-opacity-20 p-2 rounded-md text-sm my-3 font-medium text-white"
        onClick={handleSignIn}
      >
        Login
      </button>
    );
  }

  return (
    <div className="header-2 w-screen h-screen overflow-hidden">
      <nav className="bg-white py-2 md:py-2">
        <div className="container px-4 mx-auto md:flex md:items-center">
          <div className="flex justify-between items-center">
            {user && (
              <a href="#" className="font-bold text-xl text-[#36d1dc]">
                {user?.orgName}
              </a>
            )}
            <button
              className="border border-solid border-gray-600 px-3 py-1 rounded text-gray-600 opacity-50 hover:opacity-75 md:hidden"
              id="navbar-toggle"
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>

          <div
            className="hidden md:flex flex-col md:flex-row md:ml-auto mt-3 md:mt-0"
            id="navbar-collapse"
          >
            <button
              className="float-right bg-[#5b86e5] p-2 rounded-md text-sm my-3 font-medium text-white"
              onClick={() => signOut()}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="py-3 md:py-6">
        <div className="container px-4 mx-auto flex justify-center">
          <div className="w-full max-w-lg px-2 py-16 sm:px-0 mb-20">
            <div>
              <input
                type="text"
                placeholder="Enter a number"
                value={inputValue}
                onChange={handleInputChange}
              />
              <button onClick={handleGetButtonClick}>Get</button>
            </div>
            <div>
              <h2>Response:</h2>
              <p>{responseMsg}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
