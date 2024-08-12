import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UseEffectPrac from "./pages/UseEffectPrac";
import PracOne from "./components/useEffectPrac/PracOne";
import PracTwo from "./components/useEffectPrac/PracTwo";
import PracThree from "./components/useEffectPrac/PracThree";
import PracFour from "./components/useEffectPrac/PracFour";
import PracFive from "./components/useEffectPrac/PracFive";

function App() { 
  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/use-effect-prac' element={ <UseEffectPrac /> }>
          <Route path='prac-one' element={ <PracOne/> }></Route>
          <Route path='prac-two' element={ <PracTwo/> }></Route>
          <Route path='prac-three' element={ <PracThree/> }></Route>
          <Route path='prac-four' element={ <PracFour/> }></Route>
          <Route index element={ <PracFive/> }></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
