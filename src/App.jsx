import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UseEffectPrac from "./pages/UseEffectPrac";
import PracOne from "./components/useEffectPrac/PracOne";
import PracTwo from "./components/useEffectPrac/PracTwo";
import PracThree from "./components/useEffectPrac/PracThree";

function App() { 
  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/use-effect-prac' element={ <UseEffectPrac /> }>
          <Route path='prac-one' element={ <PracOne/> }></Route>
          <Route path='prac-two' element={ <PracTwo/> }></Route>
          <Route index element={ <PracThree/> }></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
