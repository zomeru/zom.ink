import { withAuth } from "next-auth/middleware";

const superAdminRoutes: string[] = ["/superadmin"]; // Super admin routes
const adminRoutes: string[] = ["/admin"]; // Admin routes

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname;

      if (superAdminRoutes.includes(pathname)) {
        return token?.role === "superadmin";
      }

      if (adminRoutes.includes(pathname)) {
        return token?.role === "admin" || token?.role === "superadmin";
      }

      return token !== undefined;
    },
  },
});

export const config = {
  matcher: ["/dashboard"], // Add other protected, admin, and super admin routes here
};
