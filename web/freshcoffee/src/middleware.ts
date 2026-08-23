import { defineMiddleware } from "astro:middleware";
import { verifySession } from "./auth/dal";

export const onRequest = defineMiddleware(async (ctx, next) => {

    const { pathname } = ctx.url;

    const isAdminRoute =
        pathname.startsWith("/admin");

    // /order y las Actions de pedidos son públicas.
    // La propia Action comprobará el token al crear el pedido.
    const isProtected =
        isAdminRoute;

    if (!isProtected) {
        return next();
    }

    const token =
        ctx.cookies.get("FRESHCOFFEE_TOKEN")?.value ?? "";

    const { user } = await verifySession(token);

    if (!user) {
        return Response.redirect(
            new URL("/auth/login", ctx.url),
            302
        );
    }

    ctx.locals.user = user;

    if (isAdminRoute) {

        const allowedRoles = [
            "superadmin",
            "admin",
            "editor"
        ];

        if (!allowedRoles.includes(user.role)) {
            return Response.redirect(
                new URL("/", ctx.url),
                302
            );
        }
    }

    return next();
});