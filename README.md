# WhiteApp

[Открыть WhiteApp](https://glory3z.github.io/whiteapp/)

Каталог приложений для iPhone с поиском по названиям и псевдонимам, категориями, галереями App Store и подсказками по установке. Статическая версия работает в браузере и внутри Telegram.

## Запуск в Telegram

1. Откройте [@BotFather](https://t.me/BotFather) и отправьте `/setmenubutton`.
2. Выберите бота. Если WhiteApp должен открываться из бота поддержки, выберите `@setupruappsbot` при наличии доступа к нему.
3. Укажите адрес `https://glory3z.github.io/whiteapp/` и название кнопки `WhiteApp`.
4. Откройте своего бота на iPhone и проверьте кнопку меню.

Поддержка открывается через `@setupruappsbot`. Ссылка на `@yupi_iri` находится в инструкции по установке. Оба адреса меняются в `docs/app.js`. [Документация Telegram Mini Apps](https://core.telegram.org/bots/webapps#launching-mini-apps-from-the-menu-button)

## Где менять каталог

- `docs/catalog.js` содержит карточки, категории, поисковые псевдонимы и ссылки. У платных приложений поле `store` содержит сведения и скриншоты App Store США. Цены и наличие могут меняться в зависимости от страны.
- `docs/styles.css` задаёт оформление. `docs/app.js` отвечает за экраны и взаимодействия.
- `docs/media/` содержит иконки, шрифт Inter и видео о загрузке из официальных источников.
- Форма отзыва показывает введённый текст внутри текущей карточки. Комментарии с пометкой «Пример» написаны для демонстрации.

## Публикация

GitHub Pages обслуживает папку `/docs` ветки `main`. В настройках репозитория откройте **Pages**, выберите **Deploy from a branch**, затем **main** и **/docs**. Код можно править и коммитить через GitHub. Сборка не нужна.

Для локальной проверки запустите `python3 -m http.server 8000 --directory docs` и откройте `http://localhost:8000/`.

Данные о приложениях и скриншоты предоставлены App Store. Иконки российских сервисов получены с их официальных сайтов или из карточек App Store. Inter распространяется на условиях OFL, текст лицензии в `docs/media/inter-license.txt`. [Сведения об Apple Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html)
