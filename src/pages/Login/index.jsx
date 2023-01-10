import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import styles from "./Login.module.scss";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";

export const Login = () => {
  // понимаем, авторизованы мы или нет
  const isAuth = useSelector(selectIsAuth);

  const dispatch = useDispatch();

  // достаем все что нужно из хука useForm для отправки данных на бэк
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    // валидируем только при условии, что поля заполнены
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    // получаем данные пользователя в формате action{type: ... , payload: ...}
    const data = await dispatch(fetchAuth(values));

    // если не удалось получить данные о пользователе (action{type: 'auth/fetchAuth/fulfilled', payload: undefined})
    if (!data.payload) {
      alert("Не удалось авторизоваться");
    }

    // если есть ключ token (не пустое значение) в action.payload, заносим его в localStorage
    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    }
  };

  // если мы авторизованы - переходим на главную страницу
  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography classes={{ root: styles.title }} variant="h5">
          Вход в аккаунт
        </Typography>
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          type="email"
          helperText={errors.email?.message}
          {...register("email", { required: "Укажите почту" })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("password", { required: "Укажите пароль" })}
          fullWidth
        />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Paper>
  );
};
