import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Прокрутка страницы к началу при изменении маршрута
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollTop;
