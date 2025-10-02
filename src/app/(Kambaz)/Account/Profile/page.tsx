// import Link from "next/link";
// export default function Profile() {
//   return (
//     <div id="wd-profile-screen">
//       <h3>Profile</h3>
//       <input defaultValue="alice" placeholder="username" className="wd-username"/><br/>
//       <input defaultValue="123"   placeholder="password" type="password"
//              className="wd-password" /><br/>
//       <input defaultValue="Alice" placeholder="First Name" id="wd-firstname" /><br/>
//       <input defaultValue="Wonderland" placeholder="Last Name" id="wd-lastname" /><br/>
//       <input defaultValue="2000-01-01" type="date" id="wd-dob" /><br/>
//       <input defaultValue="alice@wonderland" type="email" id="wd-email" /><br/>
//       <select defaultValue="FACULTY" id="wd-role">
//         <option value="USER">User</option>       <option value="ADMIN">Admin</option>
//         <option value="FACULTY">Faculty</option> <option value="STUDENT">Student</option>
//       </select><br/>
//       <Link href="Signin" > Sign out </Link>
//     </div>
// );}

import Link from "next/link";
import FormControl from "react-bootstrap/esm/FormControl";

export default function Profile() {
  return (
    <div id="wd-profile-screen">
      <h1>Profile</h1>
      <FormControl id="wd-username"
             placeholder="Username"
             defaultValue="alice"
             className="mb-2"/>
      <FormControl id="wd-password"
             placeholder="Password"
             defaultValue="123"
             className="mb-2"/>
      <FormControl id="wd-firstname"
             placeholder="First Name"
             defaultValue="Alice"
             className="mb-2"/>
      <FormControl id="wd-lastname"
             placeholder="Last Name"
             defaultValue="Wonderland"
             className="mb-2"/>
      <FormControl id="wd-dob"
             type="date"
             defaultValue="yyyy-mm-dd"
             className="mb-2"/>
      <FormControl id="wd-email"
             type="email"
             placeholder="alice@wonderland.com"
             defaultValue="alice@wonderland.com"
             className="mb-2"/>
      <FormControl id="wd-user"
             placeholder="User"
             defaultValue="User"
             className="mb-2"/>
      <Link id="wd-signup-btn"
            href="/Account/Profile"
            className="btn btn-danger w-100 mb-2">
            Signout </Link>
    </div> 
    );
  }
