// import Link from "next/link";
// import FormControl from "react-bootstrap/esm/FormControl";

// export default function SignUp() {
//   return (
//     <div id="wd-signup-screen">
//       <h1>Signup</h1>
//       <FormControl id="wd-username"
//              placeholder="username"
//              className="mb-2"/>
//       <FormControl id="wd-password"
//              placeholder="password" type="password"
//              className="mb-2"/>
//       <Link id="wd-signup-btn"
//             href="/Account/Profile"
//             className="btn btn-primary w-100 mb-2">
//             Signup </Link>
//       <Link id="wd-signin-link" href="/Account/Signin">Signin</Link>
//     </div> 
//     );
//   }

"use client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { FormControl, Button } from "react-bootstrap";
import * as client from "../client";

export default function Signup() {
  const [user, setUser] = useState<any>({});
  const dispatch = useDispatch();
  const signup = async () => {
    try {
      const currentUser = await client.signup(user);
      dispatch(setCurrentUser(currentUser));
      redirect("/Account/Profile");
    } catch (e) {
      console.error(e);
      alert("Username is already taken");
    }
  };
  return (
    <div className="wd-signup-screen">
      <h1>Sign up</h1>
      <FormControl value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })}
             className="wd-username b-2" placeholder="username" />
      <FormControl value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })}
             className="wd-password mb-2" placeholder="password" type="password"/>
      <button onClick={signup} className="wd-signup-btn btn btn-primary mb-2 w-100"> Sign up </button><br />
      <Link href="/Account/Signin" className="wd-signin-link">Sign in</Link>
    </div>
);}

