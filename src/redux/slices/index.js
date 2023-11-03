import { combineReducers } from "@reduxjs/toolkit";
import { authSlice } from "./auth";

export const mainReducer = combineReducers({
    auth: authSlice.reducer,
})