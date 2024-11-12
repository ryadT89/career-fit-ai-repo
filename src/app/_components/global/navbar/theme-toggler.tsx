import React, { useEffect, useState } from 'react';
import { TbMoonFilled, TbSunFilled } from "react-icons/tb";

export function ThemeToggler() {

    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark')
        setIsDarkMode(!isDarkMode);
    }

    return (
        <div className="cursor-pointer" onClick={toggleTheme}>
            {isDarkMode ? <TbMoonFilled /> : <TbSunFilled />}
        </div>
    );
};