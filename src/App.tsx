import { Routes, Route, BrowserRouter } from 'react-router-dom';
import DashboardLayout from './pages/DashboadLayout';
import Dashboard from './pages/Dashboard';
import SubjectList from './pages/subjects/SubjectList';
import Subjectcreate from './pages/subjects/Subjectcreate';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="subjects" element={<SubjectList />} />
          <Route path="subjects/create" element={<Subjectcreate />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
