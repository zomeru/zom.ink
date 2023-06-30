import { withAuth } from "next-auth/middleware";

const superAdminRoutes: string[] = []; // Super admin routes
const adminRoutes: string[] = []; // Admin routes
const protectedUserRoutes = ["/dashboard"]; // Protected user routes

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
  matcher: [...protectedUserRoutes, ...adminRoutes, ...superAdminRoutes],
};
