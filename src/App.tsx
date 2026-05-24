import {  Routes, Route, BrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboad';

function App() {
 
  

  return (
    <>
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
    </>
  )
}

export default App
