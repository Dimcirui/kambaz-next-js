// import Link from "next/link";
// export default function Signup() {
//   return (
//     <div id="wd-signup-screen">
//       <h3>Sign up</h3>
//       <input placeholder="username" className="wd-username" defaultValue={"Alice"}/><br/>
//       <input placeholder="password" type="password" className="wd-password" defaultValue={"Wonderland"}/><br/>
//       <input placeholder="verify password"
//              type="password" className="wd-password-verify" defaultValue={"Wonderland"}/><br/>
//       <Link  href="Profile" > Sign up </Link><br />
//       <Link  href="Signin" > Sign in </Link>
//     </div>
// );}

import Link from "next/link";
import FormControl from "react-bootstrap/esm/FormControl";

export default function SignUp() {
  return (
    <div id="wd-signup-screen">
      <h1>Signup</h1>
      <FormControl id="wd-username"
             placeholder="username"
             className="mb-2"/>
      <FormControl id="wd-password"
             placeholder="password" type="password"
             className="mb-2"/>
      <Link id="wd-signup-btn"
            href="/Account/Profile"
            className="btn btn-primary w-100 mb-2">
            Signup </Link>
      <Link id="wd-signin-link" href="/Account/Signin">Signin</Link>
    </div> 
    );
  }