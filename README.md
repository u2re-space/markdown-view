# markdown-view

Markdown **viewer** для оболочек. Кастомный элемент `CwViewViewer` (алиас `ViewerView`). Оконные id: **`viewer`**, также `markdown` / `markdown-view`.

Синоним пути: `modules/views/viewer-view` → этот пакет. Не путать с [`editor-view`](../editor-view/) (правка исходника).

Просмотр, тема, прогрев движка (`warmViewerMarkdownEngine`), привязка картинок (`data-md-rel` / OPFS / FSA). Печать и DOCX — в приложении (`CWSP-document`) и `subsystem/other/document`.

## Запуск

HTTPS на 443 или порт 8434:

```bash
cd modules/views/markdown-view
npm run ssl:localhost    # certs/ для Vite
npm run dev
npm run dev:8434
npm run build
```

```ts
import CwViewViewer, { warmViewerMarkdownEngine } from "markdown-view/src";
```

Default export — конструктор CE: `new CwViewViewer(options)` + `.render()`.
