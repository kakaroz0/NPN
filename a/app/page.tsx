// app/login/page.tsx
import React from 'react';
import LoginForm from './login/Loginform';

const LoginPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <LoginForm />
        </div>
    );
};

export default LoginPage;
