# Трекер привычек

Простое веб-приложение для отслеживания привычек с использованием Express на сервере и LocalStorage в качестве «базы данных».

## Основные возможности
	•	Добавление привычек.
	•	Фильтрация (все / активные / выполненные).
	•	Сохранение привычек в LocalStorage.
	•	Переключение состояния привычки по клику.
	•	Подсчёт выполненных привычек.

## Как работает
	1.	Express-сервер раздаёт статические файлы из папки public.
	2.	LocalStorage хранит массив привычек, а при обновлении пользовательского интерфейса данные подтягиваются и сохраняются из/в браузер.
	3.	Состояния (all, active, completed) переключаются нажатием кнопок фильтра.
