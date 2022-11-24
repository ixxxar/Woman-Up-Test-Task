import { Route, Routes } from "react-router-dom";
import Auth from "./app/layouts/auth";
import React from "react";
import LogOut from "./app/layouts/logOut";
import AuthRequired from "./app/layouts/authRequired";

function App() {
    return (
        <>
            <Routes>
                <Route path="/auth/:type" element={<Auth />} />
                <Route path="" element={<AuthRequired />} />
                <Route path="/logout" element={<LogOut />} />
            </Routes>
        </>
    );
}

export default App;
