import "./App.css";

import LandingPage from "./components/LandingPage/LandingPage.js";
import { Routes, Route } from "react-router-dom";
import Services from "./components/LandingPage/Services.js";
import EmployeeSignIn from "./components/EmployeeDashboard/EmployeeSignIn/EmployeeSignIn.js";
import AdminLogin from "./components/AdminDashboard/AdminLogin/AdminLogin.js";
import AdminDashboardNavigation from "./components/AdminDashboard/AdminDashboardNavigation/AdminDashboardNavigation.js";
import AdminRequireAuth from "./components/RequireAuth/AdminRequireAuth.js";
import AdminCreateEmployee from "./components/AdminDashboard/AdminCreateEmployee/AdminCreateEmployee.js";
import EmployeeDashboardNavigation from "./components/EmployeeDashboard/EmployeeSignIn/EmployeeDashboardNavigation/EmployeeDashboardNavigation.js";
import EmployeeRequireAuth from "./components/RequireAuth/EmployeeRequireAuth.js";
import EmployeeCreateSlots from "./components/EmployeeDashboard/EmployeeCreateSlots/EmployeeCreateSlots.js";
import BookSession from "./components/BookSession/BookSession.js";
import UserCreate from "./components/EmployeeDashboard/UserCreate/UserCreate.js";
import PublicUserDashboardNavigation from "./components/PublicUserDashboard/PublicUserDashboardNavigation/PublicUserDashboardNavigation.js";
import PublicUserRequireAuth from "./components/RequireAuth/PublicUserRequireAuth.js";
import PublicUserSignIn from "./components/PublicUserDashboard/PublicUserSignIn/PublicUserSignIn.js";
import PublicUserUploadFile from "./components/PublicUserDashboard/PublicUserUploadFile/PublicUserUploadFile.js";
import Chat from "./components/Chat/Chat.js";
import ChatDashBoard from "./components/ChatDashboard/ChatDashBoard.js";
import ChatContextProvider from "./components/Contexts/ChatContext.js";
import ChatDashBoardEmployee from "./components/ChatDashboardEmployee/ChatDashboardEmployee.js";
import ChatEmployee from "./components/Chat/ChatEmployee.js";
import EmployeeSession from "./components/EmployeeDashboard/EmployeeSession/EmployeeSession.js";
import EmployeeSessionList from "./components/EmployeeDashboard/EmployeeSessionList/EmployeeSessionList.js";
import ListUsers from "./components/EmployeeDashboard/ListUsers/ListUsers.js";
import EditUsers from "./components/EmployeeDashboard/EditUsers/EditUsers.js";
import CreateCompany from "./components/EmployeeDashboard/CreateCompany/CreateCompany.js";
import CompanyList from "./components/EmployeeDashboard/CompanyList/CompanyList.js";
import AssignTask from "./components/AdminDashboard/AdminAssignTask/AssignTask.js";
import AssignedTask from "./components/EmployeeDashboard/AssignedTask/AssignedTask.js";
import AdminTaskStatus from "./components/AdminDashboard/AdminTaskStatus/AdminTaskStatus.js";
import AdminStatistics from "./components/AdminDashboard/AdminStatistics/AdminStatistics.js";
import PublicUserCompany from "./components/PublicUserDashboard/PublicUserCompany/PublicUserCompany.js";
function App() {
  return (
    <div>
      <Routes>
        {/* anonymous user */}
        <Route element={<LandingPage />} path="/" />
        <Route element={<Services />} path="/services" />
        <Route element={<BookSession />} path="/book-session" />
        {/* anonymous user end */}
        {/* employee */}
        <Route element={<EmployeeSignIn />} path="/employee-login" />
        <Route
          path="/employee-dashboard"
          element={
            <EmployeeRequireAuth>
              <EmployeeDashboardNavigation />
            </EmployeeRequireAuth>
          }
        >
          <Route
            path="create-slot"
            element={
              <EmployeeRequireAuth>
                <EmployeeCreateSlots />
              </EmployeeRequireAuth>
            }
          />
          <Route
            path="assigned-task"
            element={
              <EmployeeRequireAuth>
                <AssignedTask />
              </EmployeeRequireAuth>
            }
          />
          <Route
            path="create-company"
            element={
              <EmployeeRequireAuth>
                <CreateCompany />
              </EmployeeRequireAuth>
            }
          />
          <Route
            path="company-list"
            element={
              <EmployeeRequireAuth>
                <CompanyList />
              </EmployeeRequireAuth>
            }
          />
          <Route
            path="list-users"
            element={
              <EmployeeRequireAuth>
                <ListUsers />
              </EmployeeRequireAuth>
            }
          />
          <Route
            path="list-users/:uid"
            element={
              <EmployeeRequireAuth>
                <EditUsers />
              </EmployeeRequireAuth>
            }
          />

          <Route
            path="create-user"
            element={
              <EmployeeRequireAuth>
                <UserCreate />
              </EmployeeRequireAuth>
            }
          />
          <Route
            path="session"
            element={
              <EmployeeRequireAuth>
                <EmployeeSessionList />
              </EmployeeRequireAuth>
            }
          />
          <Route
            path="session/:id"
            element={
              <EmployeeRequireAuth>
                <EmployeeSession />
              </EmployeeRequireAuth>
            }
          />
          <Route
            path="chat"
            element={
              <EmployeeRequireAuth>
                <ChatDashBoardEmployee />
              </EmployeeRequireAuth>
            }
          />
          <Route
            path="chat/:id"
            element={
              <EmployeeRequireAuth>
                <ChatEmployee />
              </EmployeeRequireAuth>
            }
          />
        </Route>
        {/* employee end */}

        {/* user routes */}
        <Route path="/user-login" element={<PublicUserSignIn />} />
        <Route
          path="/user-dashboard"
          element={
            <PublicUserRequireAuth>
              <PublicUserDashboardNavigation />
            </PublicUserRequireAuth>
          }
        >
          <Route
            path="upload-file"
            element={
              <PublicUserRequireAuth>
                <PublicUserUploadFile />
              </PublicUserRequireAuth>
            }
          />
          <Route
            path="company-list"
            element={
              <PublicUserRequireAuth>
                <PublicUserCompany />
              </PublicUserRequireAuth>
            }
          />
          <Route
            path="chat"
            element={
              <PublicUserRequireAuth>
                <ChatDashBoard />
              </PublicUserRequireAuth>
            }
          />

          <Route
            path="chat/:id"
            element={
              <PublicUserRequireAuth>
                <Chat />
              </PublicUserRequireAuth>
            }
          />
        </Route>
        {/* user routes end */}

        {/* admin routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin-dashboard"
          element={
            <AdminRequireAuth>
              <AdminDashboardNavigation />
            </AdminRequireAuth>
          }
        >
          <Route
            path="create-employee"
            element={
              <AdminRequireAuth>
                <AdminCreateEmployee></AdminCreateEmployee>
              </AdminRequireAuth>
            }
          />
          <Route
            path="create-task"
            element={
              <AdminRequireAuth>
                <AssignTask />
              </AdminRequireAuth>
            }
          />
          <Route
            path="task-status"
            element={
              <AdminRequireAuth>
                <AdminTaskStatus />
              </AdminRequireAuth>
            }
          />
          <Route
            path="statistics"
            element={
              <AdminRequireAuth>
                <AdminStatistics />
              </AdminRequireAuth>
            }
          />
        </Route>
        {/* admin routes end */}

        {/* chat route */}

        {/* chat route ends */}
      </Routes>
    </div>
  );
}

export default App;
