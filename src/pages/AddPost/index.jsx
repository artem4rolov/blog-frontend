import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
// простой редактор для создания постов
import SimpleMDE from "react-simplemde-editor";
import { useSelector } from "react-redux";
import { useNavigate, Navigate, useParams } from "react-router-dom";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { selectIsAuth } from "../../redux/slices/auth";
import axios from "../../axios";

export const AddPost = () => {
  // достаем id статьи из url'а для редактирования конкретной статьи
  const { id } = useParams();
  //
  const navigate = useNavigate();

  // понимаем, авторизованы мы или нет
  const isAuth = useSelector(selectIsAuth);
  // отображаем загрузку
  const [isLoading, setIsLoading] = useState(false);
  // данные заголовка, тегов и контента в редакторе + превьюшка
  const [text, setText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const inputFileRef = React.useRef(null);

  // обозначаем редактировании статьи
  const [isEditing, setIsEditing] = useState(false);

  // функционал по загрузке изображения в хранилище на бэкенд
  const handleChangeFile = async (event) => {
    try {
      // специальный объект для хранения информации о файлах
      const formData = new FormData();
      // берем нашу картинку из того, что загрузил пользователь
      const file = event.target.files[0];
      // пихаем ее в formData
      formData.append("image", file);
      // затем пихаем ее в хранилище на бэк (/upload) и достаем новую ссылку на изображение уже из хранилища на бэкенде
      const { data } = await axios.post("/upload", formData);
      // кидаем ссылку в стейт
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert("Ошибка загрузки файла");
    }
  };

  // удаление изображения
  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);

      const fields = {
        title,
        imageUrl,
        tags,
        text,
      };

      // если это редактирование - patch, если создание - post
      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);

      // если это редактирование - перенаправляем пользователя по id поста, который отредактирован
      // если это создание - достаем из созданного только что поста новый id и перенаправляем по нему пользователя
      const _id = isEditing ? id : data._id;
      navigate(`/posts/${_id}`);
    } catch (err) {
      console.warn(err);
      alert("Ошибка при создании статьи");
    }
  };

  // useCallback енобходим для работы библиотеки редактора для создания постов
  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  // если получилось взять id статьи и мы нажали на кнопку редактирования статьи - попадаем в редактор, только все поля уже заполнены и редактируемы
  React.useEffect(() => {
    if (id) {
      setIsEditing(true);
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setImageUrl(data.imageUrl);
          setTags(data.tags.join(","));
        })
        .catch((err) => {
          console.log(err);
          alert("Ошибка при получении статьи");
        });
    }
  }, []);

  // useMemo енобходим для работы библиотеки редактора для создания постов
  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  // если мы авторизованы - переходим на главную страницу
  // чтобы не выкидывало со страницы создания поста - проверим дополнительно токен в localStorage
  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        // по клику на кнопку по сути кликаем на input для загрузки файлов
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`http://localhost:4444${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Сохранить" : "Опубликовать"}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
