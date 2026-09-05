import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { customerAuth } from '../services/portal.service';
export const CustomerAuthGuard = ({ children }) => {
    const token = customerAuth.getToken();
    const location = useLocation();
    if (!token) {
        return _jsx(Navigate, { to: "/customer/login", state: { from: location }, replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
//# sourceMappingURL=CustomerAuthGuard.js.map