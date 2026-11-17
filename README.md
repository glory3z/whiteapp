# TapAxis

[Открыть TapAxis](https://glory3z.github.io/whiteapp/)

Каталог приложений для iPhone с поиском по названиям и псевдонимам, категориями, галереями App Store и подсказками по установке. Статическая версия работает в браузере и внутри Telegram.

## Запуск в Telegram

1. Откройте [бота настройки Telegram](https://t.me/BotFather) и отправьте `/setmenubutton`.
2. Выберите бота, в котором будет открываться каталог.
3. Вставьте адрес каталога и укажите название кнопки `TapAxis`. [Адрес каталога](https://glory3z.github.io/whiteapp/)
4. Откройте своего бота на iPhone и проверьте кнопку меню.

Ссылки для связи находятся в `docs/app.js`. [Документация Telegram Mini Apps](https://core.telegram.org/bots/webapps#launching-mini-apps-from-the-menu-button)

## Где менять каталог

- `docs/catalog.js` содержит карточки, категории, поисковые псевдонимы и ссылки. У платных приложений поле `store` содержит сведения и скриншоты App Store США. Цены и наличие могут меняться в зависимости от страны.
- `docs/styles.css` задаёт оформление. `docs/app.js` отвечает за экраны и взаимодействия.
- `docs/media/` содержит иконки, шрифт Rubik и видео о загрузке из официальных источников.
- Форма отзыва показывает введённый текст внутри текущей карточки. Комментарии с пометкой «Пример» написаны для демонстрации.

## Публикация

GitHub Pages обслуживает папку `/docs` ветки `main`. В настройках репозитория откройте **Pages**, выберите **Deploy from a branch**, затем **main** и **/docs**. Код можно править и коммитить через GitHub. Сборка не нужна.

Для локальной проверки запустите `python3 -m http.server 8000 --directory docs` и откройте `http://localhost:8000/`.

Данные о приложениях и скриншоты предоставлены App Store. Иконки российских сервисов получены с их официальных сайтов или из карточек App Store. Rubik распространяется на условиях OFL, текст лицензии в `docs/media/rubik-license.txt`. [Сведения об Apple Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html)
