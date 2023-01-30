import * as http from "http";

const routes = {

    '/contact:get': (request, response) => {
        response.write('contact us page');
        return response.end();
    },

    default: (request, response) => {
        response.write('Hello World!');
        return response.end();
    }
}

const handler = function(request, response) {
    const { url, method } = request;
    const routeKey = `${url}:${method.toLowerCase()}`;
    const chosen = routes[routeKey] || routes.default;
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    return chosen(request, response);
}


export const app = http.createServer(handler)
                .listen(3000, () => console.log("app running at", 3000));
