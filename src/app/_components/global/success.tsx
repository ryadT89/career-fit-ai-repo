import React from 'react';
import { HiCheckCircle } from 'react-icons/hi';

interface ErrorAlertProps {
    message: string;
}

export const Success: React.FC<ErrorAlertProps> = ({ message }) => (
    <div className="alert alert-success text-base-100 my-4">
        <HiCheckCircle className="text-2xl mr-2" />
        <span>{message}</span>
    </div>
);
