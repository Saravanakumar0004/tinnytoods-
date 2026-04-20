export const endpoints = {
    admin: {
        login:    "/admin/login/",
        refresh:  "/admin/refresh/",
        logout:   "/admin/logout/",
        password: "/admin/changepassword/",
        profile:  "/admin/profile/",
    },
    gallery: {
        list:          "/categories/",
        slug:          "/categories/:slug/",
        list_photos:   "/photos/",
        list_id:       "/photos/:id/",
        CategoryPhotos: (slug: string) =>
            `/categories/${encodeURIComponent(slug.trim())}/photos/`,
    },
    about: {
        list:    "/about/",
        list_id: (id: number) => `/about/${id}/`,
    },
    home: {
        list:    "/homestats/",
        list_id: (id: number) => `/homestats/${id}/`,
    },
    ques: {
        list:    "/question/",
        list_id: (id: number) => `/question/${id}/`,
    },
    services: {
        list:    "/services/",
        list_id: (id: number) => `/services/${id}/`,   // ← was a static string, now a function
    },
    autism: {
        list:    "/autism/",
        list_id: (id: number) => `/autism/${id}/`,
    },
    branches: {
        list: "/branches/",
    },
    book: {
        create:  "/book/",
        list_id: (id: number) => `/book/${id}/`,
    },
    contact: {
        create:  "/contact/",
        list_id: (id: number) => `/contact/${id}/`,
        call:    "/callcount/",
    },
    youtube: {
        list: "/youtube/",
    },
    visitors: {
        get_and_post: "/visitors/count/",
    },
} as const;