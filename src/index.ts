import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { logger } from 'hono/logger'

declare type Bindings = {
  ENVIRONMENT: "dev" | "production";
};

declare type Env = {
  Bindings: Bindings;
};

const todo_object = z.object({
  "todo-id": z.string().openapi({
    param: { name: 'todo-id', in: 'path', },
    examples: [
    'asdf',
  ]}),
})

const routeTodo = createRoute({
  method: "get",
  path: "/api/v1.0.0/weather/{todo-id}/current",
  request: {
    params: todo_object,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({})
        },
      },
      description: "Fetch weather data from the Cayman Weather site.",
    },
    404: {
      description: "Unable to fetch the weather data",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string().optional(),
          }),
        },
      },
    },
    500: {
      description: "Unexpected internal server error.",
      content: {
        "application/json": {
          schema: z.object({
            status_code: z.number().optional().openapi({ example: 504, description: "Original error code." }),
            message: z.string().optional(),
          }),
        },
      },
    },
  },
});

const app = new OpenAPIHono<Env>()

app.use('*', logger())

app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Cayman Weather API (unofficial)',
  },
  tags: [
    {
      name: 'language',
      description: 'en'
    }
  ]
})

app.get('/docs/', (c) => {
  return c.html(`<!doctype html>
<html lang="en">
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <title>API Docs</title>
      <meta name="author" content="ai.moda">
      <meta name="title" content="API Docs" />
      <script async src="https://stoplight-elements.ai.moda/web-components.min.js"></script>
      <link rel="stylesheet" href="https://stoplight-elements.ai.moda/styles.min.css">
      </head>
    <body>

    <div style="height: 100vh;">
        <elements-api
            apiDescriptionUrl="/openapi.json"
            router="hash"
            layout="sidebar"
            tryItCredentialsPolicy="include"
            withCredentials="true"
        />
    </div>
  </body>
</html>
`)
})

class ElementHandler {
  // lang: string;

  // constructor() {
    // this.lang = lang;
  // }

  element(element: Element) {
    console.log(element)
    // element.setAttribute("lang", this.lang);
  }

  comments(comment: Comment) {
    console.log(comment)
    // An incoming comment
  }

  text(text: Text) {
    console.log(text)
    // An incoming piece of text
  }

  doctype(doctype: Doctype) {
    console.log(doctype)
    // An incoming doctype, such as <!DOCTYPE html>
  }
}

app.openapi(routeTodo, async (c) => {
  const { "todo-id": todo_id } = c.req.valid('param')
  console.log(`todo-id: ${todo_id}`);
  const fetch_result = await fetch(`https://www.weather.gov.ky/`, {
    // cf: {
    //   cacheEverything: true,
    //   cacheTtl: 24 * 60 * 60 // cache for 1 day
    // }
  });

  if (fetch_result.status == 404) {
    return c.jsonT({message: "TODO"}, 404);
  }

  if(!fetch_result.ok) {
    return c.jsonT({message: "Unknown error.", status_code: fetch_result.status}, 500);
  }

  // console.debug(`fetch_result_text: ${await fetch_result.text()}`)
  // return c.jsonT({});

  const rewriter = new HTMLRewriter()

  //new HTMLRewriter().on('*', new ElementHandler()).onDocument(new DocumentHandler());

  
  
  rewriter.on('*', new ElementHandler()); // div or * or head or div.sm-text?

  await rewriter.transform(fetch_result).text(); // we don't give a crap about the return.

  return c.jsonT({});
})

export default app
