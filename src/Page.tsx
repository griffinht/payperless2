import { FC } from "hono/jsx"

const Page: FC = (props) => {
  const debugUrl = `cursor://file/${props.filename}`;
  const filename = props.filename.split('/').pop();

  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
        <script src="https://unpkg.com/htmx.org@2.0.4/dist/htmx.min.js"></script>
        <title>PayPerLess</title>
      </head>
      <body className="bg-gray-100 min-h-screen">
        <a href={debugUrl}>click to debug {filename}</a>
        <div className="container mx-auto px-4 py-8">
          {props.children}
        </div>
      </body>
    </html>
  )
}

export default Page;