import { lazy, Suspense } from "react";

// Lazy load all page components for better performance
export const LazyIndex = lazy(() => import("@/pages/Index"));
export const LazyLogin = lazy(() => import("@/pages/Login"));
export const LazyStudentLogin = lazy(() => import("@/pages/StudentLogin"));
export const LazyStudentRegister = lazy(
  () => import("@/pages/StudentRegister")
);
export const LazyDriverLogin = lazy(() => import("@/pages/DriverLogin"));
export const LazyCoordinatorLogin = lazy(
  () => import("@/pages/CoordinatorLogin")
);
export const LazyAdminLogin = lazy(() => import("@/pages/AdminLogin"));

// Student pages
export const LazyStudentDashboard = lazy(
  () => import("@/pages/student/Dashboard")
);
export const LazyStudentProfile = lazy(() => import("@/pages/student/Profile"));
export const LazyStudentBuses = lazy(() => import("@/pages/student/Buses"));
export const LazyStudentComplaints = lazy(
  () => import("@/pages/student/Complaints")
);
export const LazyStudentAnnouncements = lazy(
  () => import("@/pages/student/Announcements")
);
export const LazyStudentVoting = lazy(() => import("@/pages/student/Voting"));

// Driver pages
export const LazyDriverDashboard = lazy(
  () => import("@/pages/driver/Dashboard")
);
export const LazyDriverProfile = lazy(() => import("@/pages/driver/Profile"));

// Coordinator pages
export const LazyCoordinatorDashboard = lazy(
  () => import("@/pages/coordinator/Dashboard")
);
export const LazyCoordinatorManageBuses = lazy(
  () => import("@/pages/coordinator/ManageBuses")
);
export const LazyCoordinatorDrivers = lazy(
  () => import("@/pages/coordinator/Drivers")
);
export const LazyCoordinatorRoutes = lazy(
  () => import("@/pages/coordinator/Routes")
);
export const LazyCoordinatorVoting = lazy(
  () => import("@/pages/coordinator/Voting")
);
export const LazyCoordinatorComplaints = lazy(
  () => import("@/pages/coordinator/Complaints")
);
export const LazyCoordinatorAnnouncements = lazy(
  () => import("@/pages/coordinator/Announcements")
);
export const LazyCoordinatorEditDriver = lazy(
  () => import("@/pages/coordinator/EditDriver")
);

// Admin pages
export const LazyAdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
export const LazyAdminUsers = lazy(() => import("@/pages/admin/Users"));
export const LazyAdminReports = lazy(() => import("@/pages/admin/Reports"));
