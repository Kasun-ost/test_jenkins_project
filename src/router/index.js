import {
  createRouter,
  createWebHistory
}                from "vue-router";
import HomeView  from "../views/Bounds.vue";
import NotFound  from "../views/404.vue";
import AbiLayout from "../layouts/AbiLayout";

const routes = [
  {
    path: "",
    component: AbiLayout,
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "home",
        component: HomeView
      }, {
        path: "/info",
        name: "info",
        component: () => import("@/views/Info.vue"),
        props: true,
      }, {
        path: "/me",
        name: "me",
        component: () => import("@/views/me.vue"),
      }, {
        path: "/404",
        name: "404",
        component: NotFound,
      }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
