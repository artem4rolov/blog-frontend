import React from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { selectIsAuth } from "../../redux/slices/auth";
import { useSelector } from "react-redux";

import styles from "./Header.module.scss";
import Container from "@mui/material/Container";

export const Header = () => {
  // понимаем, авторизованы мы или нет
  const isAuth = useSelector(selectIsAuth);

  const onClickLogout = () => {};

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>ARCHAKOV BLOG</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/posts/create">
                  <Button variant="contained">Написать статью</Button>
                </Link>
                <Button
                  onClick={onClickLogout}
                  variant="contained"
                  color="error"
                >
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
