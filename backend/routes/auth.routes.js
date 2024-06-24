import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";

const router=express.Router();
//al lado de la funcion se pone el controlador
router.post("/signup", signup
);

router.post("/login", login)
;

router.post("/logout", logout);

export default router