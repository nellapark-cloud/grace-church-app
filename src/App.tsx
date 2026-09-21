import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { MembersPage } from './pages/MembersPage'
import { MemberFormPage } from './pages/MemberFormPage'
import { MemberDetailPage } from './pages/MemberDetailPage'
import { ApprovalsPage } from './pages/ApprovalsPage'
import { SettingsPage } from './pages/SettingsPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<MembersPage />} />
                  <Route path="/members/new" element={<MemberFormPage />} />
                  <Route path="/members/:id" element={<MemberDetailPage />} />
                  <Route
                    path="/members/:id/edit"
                    element={<MemberFormPage />}
                  />
                  <Route path="/approvals" element={<ApprovalsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
