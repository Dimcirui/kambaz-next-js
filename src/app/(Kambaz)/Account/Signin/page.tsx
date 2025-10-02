// import Link from "next/link";
// export default function Signin() {
//  return (
//    <div id="wd-signin-screen">
//      <h3>Sign in</h3>
//      <input placeholder="username" className="wd-username" defaultValue={"Alice"} /> <br />
//      <input placeholder="password" type="password" className="wd-password" defaultValue={"Wonderland"}/> <br />
//      <Link href="/Dashboard" id="wd-signin-btn"> Sign in </Link> <br />
//      <Link href="Signup" id="wd-signup-link"> Sign up </Link>
//    </div>
// );}
import Link from "next/link";
import FormControl from "react-bootstrap/esm/FormControl";

export default function Signin() {
  return (
    <div id="wd-signin-screen">
      <h1>Signin</h1>
      <FormControl id="wd-username"
             placeholder="username"
             className="mb-2"/>
      <FormControl id="wd-password"
             placeholder="password" type="password"
             className="mb-2"/>
      <Link id="wd-signin-btn"
            href="/Account/Profile"
            className="btn btn-primary w-100 mb-2">
            Signin </Link>
      <Link id="wd-signup-link" href="/Account/Signup">Signup</Link>
    </div> 
    );
  }