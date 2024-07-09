import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UseEffectPrac from "./pages/UseEffectPrac";
import PracOne from "./components/useEffectPrac/PracOne";

function App() { 
  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/use-effect-prac' element={ <UseEffectPrac /> }>
          <Route index element={ <PracOne/> }></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
