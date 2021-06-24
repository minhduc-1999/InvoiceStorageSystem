import React, { createContext, useState } from "react";
const axios = require("axios");

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userAcc, setUserAcc] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        userAcc,
        setUserAcc,
        login: async (username, password) => {
          try {
            let tempAcc = {
              username: username,
              password: password,
            };
            axios
              .post(process.env.REACT_APP_BASE_URL + "users/login", tempAcc, {
                headers: {
                  "Content-Type": "application/json",
                },
              })
              .then((response) => {
                return response.data;
              })
              .then((data) => {
                console.log(data);
                setUserAcc(data);
                localStorage.setItem("UserId", data.userId);
                localStorage.setItem("LoginToken", data.accessToken);
              })
              .catch((error) => {
                console.log(error);
              });
          } catch (error) {
            console.error(error);
          }
        },
        signup: async (
          username,
          password,
          address,
          phoneNumber,
          email,
          company,
          name
        ) => {
          try {
            let tempAcc = {
              username: username,
              password: password,
              claims: {
                address: address,
                phoneNumber: phoneNumber,
                email: email,
                company: company,
                name: name,
              },
            };
            axios
              .post(
                process.env.REACT_APP_BASE_URL + "users/register",
                tempAcc,
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              )
              .then((response) => {
                console.log(response);
              })
              .catch((error) => {
                console.log(error);
              });
          } catch (error) {
            console.error(error);
          }
        },
        logout: async () => {
          try {
            await setUserAcc(null);
            localStorage.removeItem("UserId");
            localStorage.removeItem("LoginToken");
          } catch (error) {
            console.log(error);
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
