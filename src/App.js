import "./App.css";
import {
  useNavigate, useLocation, redirect, useLoaderData
} from "react-router-dom";
import { Grid, Button } from "@mui/material";

// hack to workaround the fact that react-router-dom doesn't support access to
// Location state inside loaders
export const globalInfo = { age: "", consent: false };

export function Index() {
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());
    console.log(value);
    globalInfo.age = value.age;
    globalInfo.consent = value.consent == "on";
    navigate("/eval", { replace: true, state: value }	);
  }

  return <form onSubmit={handleSubmit}>
    <Grid container>
      <Grid item xs={4}>
        <label>Age</label>
      </Grid>
      <Grid item xs={8}>
        <select>
          <option value="18-25">18-25</option>
          <option value="26-35">26-35</option>
          <option value="36-45">36-45</option>
          <option value="46-55">46-55</option>
          <option value="56-65">56-65</option>
          <option value="66-75">66-75</option>
          <option value="76-85">76-85</option>
          <option value="86+">86+</option>
        </select>
      </Grid>
      <Grid item xs={4}>
        <label>Income</label>
      </Grid>
      <Grid item xs={8}>
        <select>
          <option value="0-20k">0-20k</option>
          <option value="20k-40k">20k-40k</option>
          <option value="40k-60k">40k-60k</option>
          <option value="60k-80k">60k-80k</option>
          <option value="80k-100k">80k-100k</option>
          <option value="100k+">100k+</option>
        </select>
      </Grid>
      <Grid item xs={4}>
        <label>Postal code</label>
      </Grid>
      <Grid item xs={8}>
        <input type="text" />
      </Grid>
      <Grid item xs={12}>
        <input type="submit" value="Submit" />
      </Grid>
    </Grid>
    </form>

  return <form method="post" action="/eval" onSubmit={handleSubmit}>
    <h1>Survey</h1>
    <label>
     Age:
     <select name="age">
          <option value="18-25">18-25</option>
          <option value="26-35">26-35</option>
          <option value="36-45">36-45</option>
          <option value="46-55">46-55</option>
          <option value="56-65">56-65</option>
          <option value="66-75">66-75</option>
          <option value="76-85">76-85</option>
          <option value="86+">86+</option>
        </select>
    </label>
    <label>
      Consent for data collection:
      <input name="consent" type="checkbox" />
    </label>
    <br/>
    <input type="submit" value="Submit" />
  </form>
}

export async function evalLoader(globalInfo) {
  //const loc = useLocation();
  if (!globalInfo.consent) {
    return redirect("/");
  } else {
    return globalInfo;
  }
}

export function Eval() {
  const userInfo = useLoaderData();
  return <h2>This is the Eval page {userInfo.age}</h2>;
}


// function AppRouter() {
//   return (
//     <Router>
//       <div>
//         <nav>
//           <ul>
//             <li>
//               <Link to="/">Survey</Link>
//             </li>
//             <li>
//               <Link to="/eval">Eval</Link>
//             </li>
//             <li>
//               <Link to="/products/1">First Product</Link>
//             </li>
//             <li>
//               <Link to="/products/2">Second Product</Link>
//             </li>
//           </ul>
//         </nav>
//         <Routes>
//           <Route path="/" exact element={<Index />} />
//           <Route path="/products/:id" element={<Product />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Ok. Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

