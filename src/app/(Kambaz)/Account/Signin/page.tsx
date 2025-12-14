"use client";
import Link from "next/link";
// import { redirect } from "next/dist/client/components/navigation";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
// import * as db from "../../Database";
import * as client from "../client";
import { FormControl, Button } from "react-bootstrap";

export default function Signin() {
 const [credentials, setCredentials] = useState<any>({});
 const dispatch = useDispatch();
 const router = useRouter();

  const signin = async () => {
    const user = await client.signin(credentials);
    if (user) {
      dispatch(setCurrentUser(user));
      router.push("/Dashboard");
    } else {
      alert("Invalid username or password");
    }
  };

  // Quick-fill for testing
  const testAccounts = [
    { username: "iron_man",    password: "stark123",    role: "FACULTY", description: "Teacher (Tony)" },
    { username: "thor_odinson", password: "mjolnir123",    role: "STUDENT", description: "Student (Bruce)" },
    { username: "black_widow", password: "romanoff123", role: "TA",      description: "TA (Natasha)" },
    { username: "ada",         password: "123",         role: "ADMIN",   description: "Admin (Ada)" }
  ];

  const handleQuickFill = (account: any) => {
    setCredentials({ 
      username: account.username, 
      password: account.password 
    });
  };

  return (
        <div id="wd-signin-screen">
      <h1>Sign in</h1>
      <FormControl
        defaultValue={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        className="mb-2"
        placeholder="username"
        id="wd-username"
      />
      <FormControl
        defaultValue={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        className="mb-2"
        placeholder="password"
        type="password"
        id="wd-password"
      />
      <Button onClick={signin} id="wd-signin-btn" className="w-100" >
        Sign in
      </Button>
      <Link id="wd-signup-link" href="/Account/Signup">
        Sign up
      </Link>

    </div>
    );
  }