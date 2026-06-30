import { Routes, Route, BrowserRouter } from 'react-router-dom';
import DashboardLayout from './pages/DashboadLayout';
import Dashboard from './pages/Dashboard';
import SubjectList from './pages/subjects/SubjectList';
import Subjectcreate from './pages/subjects/Subjectcreate';
import Assets from './pages/Assets';
import Maintenance from './pages/Maintenance';
import Reports from './pages/Reports';
import AuditLogs from './pages/AuditLogs';
import Documents from './pages/Documents';
import Calendar from './pages/Calendar';
import Users from './pages/Users';
import NewAsset from './pages/NewAsset';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="assets" element={<Assets />} />
          <Route path="assets/new" element={<NewAsset />} />
          <Route path="assets/:assetId" element={<Assets />} />
          <Route path="documents" element={<Documents />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<Users />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="subjects" element={<SubjectList />} />
          <Route path="subjects/create" element={<Subjectcreate />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
