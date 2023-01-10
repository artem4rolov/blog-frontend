import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

// проверка на наличие такого пользователя в БД MongoDB
export const fetchAuth = createAsyncThunk("auth/fetchAuth", async (params) => {
  // получаем данные с формы заполнения логина и пароля при входе
  const { data } = await axios.post("/auth/login", params);
  // возвращаем объект с информацией о пользователе
  return data;
});

// проверка авторизации пользователя при создании поста/комментария и тд
export const fetchAuthMe = createAsyncThunk("auth/fetchAuthMe", async () => {
  // получаем данные токена (поскольку при каждом запросе мы настроили постоянную проверку localStorage на наличие токена авторизации)
  const { data } = await axios.get("/auth/me");
  // возвращаем объект с информацией о пользователе
  return data;
});

// прегистрация
export const fetchRegister = createAsyncThunk(
  "auth/fetchRegister",
  async (params) => {
    // получаем данные пользователя при регистрации (аватарка, имя, почта и пароль)
    const { data } = await axios.post("/auth/register", params);
    // возвращаем объект с информацией о пользователе
    return data;
  }
);

const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // выход из аккаунта
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers: {
    // авторизация
    // в то время, когда происходит загрузка данных пользователя
    [fetchAuth.pending]: (state) => {
      // данных о пользователе пока нет
      state.data = null;
      // меняем текст сообщения
      state.status = "loading";
    },
    // в то время, когда всё загрузилось
    [fetchAuth.fulfilled]: (state, action) => {
      // данных о пользователе получены
      state.data = action.payload;
      // меняем текст сообщения
      state.status = "loaded";
    },
    // в то время, когда произошла ошибка
    [fetchAuth.rejected]: (state) => {
      // данных о пользователе нет
      state.data = null;
      // меняем текст сообщения
      state.status = "error";
    },
    //
    // проверка авторизации при создании постов, комментариев и тд
    [fetchAuthMe.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },

    [fetchAuthMe.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },

    [fetchAuthMe.rejected]: (state) => {
      state.data = null;
      state.status = "error";
    },
    //
    // регистрация
    [fetchRegister.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },

    [fetchRegister.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },

    [fetchRegister.rejected]: (state) => {
      state.data = null;
      state.status = "error";
    },
  },
});

// делаем обозначение наличия данных о пользователе в state
export const selectIsAuth = (state) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

// достаем функцию выхода из аккаунта
export const { logout } = authSlice.actions;
