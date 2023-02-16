import { lazy } from "react";
import PropTypes from 'prop-types';
import { Navigate, Route, Routes } from "react-router-dom"

const Login = lazy(() => import("./Login"));

const AccountRouter = () => (
    <Routes>
        <Route path={"/login"} element={<Login />}/>
        <Route path='/' element={<Navigate replace to='/login' />} />
    </Routes>
)

AccountRouter.propTypes = {
    match: PropTypes.object,
  };
export default AccountRouter;