import { lazy } from "react";
import PropTypes from 'prop-types';
import { Route, Routes } from "react-router-dom"

const Login = lazy(() => import("./Login"));

const AccountRouter = () => {
    <Routes>
        <Route path={"/login"} element={<Login />}/>
    </Routes>
}

AccountRouter.propTypes = {
    match: PropTypes.object,
  };
export default AccountRouter;