import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import styles from "./Login.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";
import { Navigate } from "react-router-dom";

export const Registration = () => {
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
      fullName: "",
      email: "",
      password: "",
    },
    // валидируем только при условии, что поля заполнены
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    // получаем данные пользователя в формате action{type: ... , payload: ...}
    const data = await dispatch(fetchRegister(values));

    // если не удалось получить данные о пользователе (action{type: 'auth/fetchAuth/fulfilled', payload: undefined})
    if (!data.payload) {
      alert("Не удалось зарегистрироваться");
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
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register("fullName", { required: "Укажите полное имя" })}
          fullWidth
          label="Полное имя"
        />
        <TextField
          className={styles.field}
          error={Boolean(errors.email?.message)}
          type="email"
          helperText={errors.email?.message}
          {...register("email", { required: "Укажите почту" })}
          fullWidth
          label="E-Mail"
        />
        <TextField
          className={styles.field}
          error={Boolean(errors.password?.message)}
          type="password"
          helperText={errors.password?.message}
          {...register("password", { required: "Укажите пароль" })}
          fullWidth
          label="Пароль"
        />
        <Button
          type="submit"
          disabled={!isValid}
          size="large"
          variant="contained"
          fullWidth
        >
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
