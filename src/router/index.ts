import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import App from "../App.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: App,
    redirect: "/login",
    children: [],
  },

  {
    path: "/login",
    name: "login",
    component: () => import("../view/login.vue"),
  },
  {
    path: "/main/:id",
    name: "main",
    component: () => import("../view/main.vue"),
  },
]

export default createRouter({
  routes,
  history: createWebHistory(),
})
