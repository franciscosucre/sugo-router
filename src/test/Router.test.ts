import * as assert from 'assert';
import * as chai from 'chai';
import * as http from 'http';
import * as supertest from 'supertest';
import Router from '..';
const AssertionError = assert.AssertionError;
let router: Router;
const OPTIONS = 'OPTIONS';
const HEAD = 'HEAD';
const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const PATCH = 'PATCH';
const DELETE = 'DELETE';

const PATH = '/foo';
const PATH_WITH_ARGUMENTS = '/:foo/:fighters';
const headers = { 'Content-Type': 'application/json' };
const SIMPLE_HANDLER = (req: any, res: http.ServerResponse) => {
  res.writeHead(200, headers);
  res.end(
    JSON.stringify({
      params: req.params,
    }),
  );
};
const SIMPLE_MIDDLEWARE = (req: any, res: http.ServerResponse) => {
  req.middlwarePassed = true;
};
chai.should();

// Our parent block
describe('Simple NodeJS Router', () => {
  beforeEach(async () => {
    router = new Router();
  });

  after(() => {
    process.exit(0);
  });

  describe(`Constructor`, () => {
    it('It should create a router without arguments', async () => {
      const fn = () => new Router();
      fn.should.not.throw(Error);
    });
  });

  describe(`addRoute`, () => {
    it('It should create a route with two handlers if try to add a duplicate route', async () => {
      router.addRoute(GET, PATH, SIMPLE_HANDLER);
      router.addRoute(GET, PATH, SIMPLE_HANDLER);
      router.routes.length.should.be.eql(1);
      router.routes[0].handlers.length.should.be.eql(2);
    });

    it('It create a route', async () => {
      router.addRoute(GET, PATH, SIMPLE_HANDLER);
      const routes = router.routes;
      routes.length.should.be.eql(1);
      const [createdRoute] = routes;
      createdRoute.method.should.be.eql(GET);
      createdRoute.path.should.be.eql(PATH);
      createdRoute.handlers[0].should.be.eql(SIMPLE_HANDLER);
    });

    it('It create a route with keys if given a path with arguments', async () => {
      router.addRoute(GET, PATH_WITH_ARGUMENTS, SIMPLE_HANDLER);
      const routes = router.routes;
      routes.length.should.be.eql(1);
      const [createdRoute] = routes;
      createdRoute.method.should.be.eql(GET);
      createdRoute.path.should.be.eql(PATH_WITH_ARGUMENTS);
      createdRoute.handlers[0].should.be.eql(SIMPLE_HANDLER);
      const keyStrings = createdRoute.keys.map(k => k.name);
      keyStrings.should.be.eql(['foo', 'fighters']);
    });

    describe(`addRoute Aliases`, () => {
      describe(`OPTIONS`, () => {
        it('It should add a route with a OPTIONS method', async () => {
          router.options(PATH, SIMPLE_HANDLER);
          const routes = router.routes;
          routes.length.should.be.eql(1);
          const [createdRoute] = routes;
          createdRoute.method.should.be.eql(OPTIONS);
          createdRoute.path.should.be.eql(PATH);
          createdRoute.handlers[0].should.be.eql(SIMPLE_HANDLER);
        });
      });

      describe(`HEAD`, () => {
        it('It should add a route with a HEAD method', async () => {
          router.head(PATH, SIMPLE_HANDLER);
          const routes = router.routes;
          routes.length.should.be.eql(1);
          const [createdRoute] = routes;
          createdRoute.method.should.be.eql(HEAD);
          createdRoute.path.should.be.eql(PATH);
          createdRoute.handlers[0].should.be.eql(SIMPLE_HANDLER);
        });
      });

      describe(`GET`, () => {
        it('It should add a route with a GET method', async () => {
          router.get(PATH, SIMPLE_HANDLER);
          const routes = router.routes;
          routes.length.should.be.eql(1);
          const [createdRoute] = routes;
          createdRoute.method.should.be.eql(GET);
          createdRoute.path.should.be.eql(PATH);
          createdRoute.handlers[0].should.be.eql(SIMPLE_HANDLER);
        });
      });

      describe(`POST`, () => {
        it('It should add a route with a POST method', async () => {
          router.post(PATH, SIMPLE_HANDLER);
          const routes = router.routes;
          routes.length.should.be.eql(1);
          const [createdRoute] = routes;
          createdRoute.method.should.be.eql(POST);
          createdRoute.path.should.be.eql(PATH);
          createdRoute.handlers[0].should.be.eql(SIMPLE_HANDLER);
        });
      });

      describe(`PUT`, () => {
        it('It should add a route with a PUT method', async () => {
          router.put(PATH, SIMPLE_HANDLER);
          const routes = router.routes;
          routes.length.should.be.eql(1);
          const [createdRoute] = routes;
          createdRoute.method.should.be.eql(PUT);
          createdRoute.path.should.be.eql(PATH);
          createdRoute.handlers[0].should.be.eql(SIMPLE_HANDLER);
        });
      });

      describe(`PATCH`, () => {
        it('It should add a route with a PATCH method', async () => {
          router.patch(PATH, SIMPLE_HANDLER);
          const routes = router.routes;
          routes.length.should.be.eql(1);
          const [createdRoute] = routes;
          createdRoute.method.should.be.eql(PATCH);
          createdRoute.path.should.be.eql(PATH);
          createdRoute.handlers[0].should.be.eql(SIMPLE_HANDLER);
        });
      });

      describe(`DELETE`, () => {
        it('It should add a route with a DELETE method', async () => {
          router.delete(PATH, SIMPLE_HANDLER);
          const routes = router.routes;
          routes.length.should.be.eql(1);
          const [createdRoute] = routes;
          createdRoute.method.should.be.eql(DELETE);
          createdRoute.path.should.be.eql(PATH);
          createdRoute.handlers[0].should.be.eql(SIMPLE_HANDLER);
        });
      });

      describe(`ALL`, () => {
        it('It should add a route for several methods method', async () => {
          router.all(PATH, SIMPLE_HANDLER);
          const routes = router.routes;
          routes.length.should.be.eql(7);
        });
      });
    });
  });

  describe(`match`, () => {
    it('It should return the route if it exists', async () => {
      router.get(PATH, SIMPLE_HANDLER);
      const route = router.match(GET, PATH);
      if (!route) {
        throw new Error('Test gone wrong!');
      }
      route.should.have.property('method');
      route.should.have.property('path');
      route.should.have.property('handlers');
      route.should.have.property('keys');
      route.should.have.property('regex');
    });

    it('It should return null if the route does not exist', async () => {
      const exists = router.match(GET, PATH) !== null;
      exists.should.be.eql(false);
    });
  });

  describe(`useMiddleware`, () => {
    it('It should throw an exception if no handlers are given', async () => {
      const fn = () => router.useMiddleware();
      fn.should.throw(AssertionError);
    });

    it('It should add the middleware before the router handler', async () => {
      router.useMiddleware(SIMPLE_MIDDLEWARE);
      router.get('/foo', SIMPLE_HANDLER);
      router.post('/fighter', SIMPLE_HANDLER);
      router.routes.length.should.be.eql(2);
      const [get, post] = router.routes;
      get.handlers.length.should.be.eql(2);
      get.handlers[0].should.be.eql(SIMPLE_MIDDLEWARE);
      get.handlers[1].should.be.eql(SIMPLE_HANDLER);
      post.handlers.length.should.be.eql(2);
      post.handlers[0].should.be.eql(SIMPLE_MIDDLEWARE);
      post.handlers[1].should.be.eql(SIMPLE_HANDLER);
    });
  });

  describe(`useSubrouter`, () => {
    it('It should append all the secondRouter routes to the main router', async () => {
      const secondRouter = new Router();
      secondRouter.get('/foo', SIMPLE_HANDLER);
      secondRouter.get('/fighter', SIMPLE_HANDLER);
      router.useSubrouter('/second', secondRouter);
      router.routes.length.should.be.eql(2);
      router.routes[0].path.should.be.eql('/second/foo');
      router.routes[1].path.should.be.eql('/second/fighter');
    });

    it('It should append all the secondRouter routes to the main router with the main router middleware', async () => {
      router.useMiddleware(SIMPLE_MIDDLEWARE);
      const secondRouter = new Router();
      secondRouter.get('/foo', SIMPLE_HANDLER);
      secondRouter.get('/fighter', SIMPLE_HANDLER);
      router.useSubrouter('/second', secondRouter);
      router.routes.length.should.be.eql(2);
      router.routes[0].handlers[0].should.be.eql(SIMPLE_MIDDLEWARE);
      router.routes[1].handlers[0].should.be.eql(SIMPLE_MIDDLEWARE);
    });

    it(
      'It should append all the secondRouter routes to the main router with ' +
        'the second router middleware, without affecting the main route old routes',
      async () => {
        router.get('/first', SIMPLE_HANDLER);
        const secondRouter = new Router();
        secondRouter.useMiddleware(SIMPLE_MIDDLEWARE);
        secondRouter.get('/foo', SIMPLE_HANDLER);
        secondRouter.get('/fighter', SIMPLE_HANDLER);
        router.useSubrouter('/second', secondRouter);
        router.routes.length.should.be.eql(3);
        router.routes[0].handlers.length.should.be.eql(1);
        router.routes[1].handlers.length.should.be.eql(2);
        router.routes[2].handlers.length.should.be.eql(2);
      },
    );
  });

  describe(`handle`, () => {
    const server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
      try {
        if (!router.match(req.method || '', req.url || '')) {
          throw { name: 'ResourceNotFound', message: 'Resource not found', status: 404 };
        }
        await router.handle(req as any, res);
      } catch (error) {
        const status = error.status || 500;
        res.writeHead(status, headers);
        res.end(
          JSON.stringify({
            code: error.code || error.name || 'Error',
            message: error.message || 'An unexpected error has ocurred',
            status,
          }),
        );
      }
    });

    before(async () => {
      server.listen(3000);
    });

    after(async () => {
      server.close();
    });

    it('It should run the handlers', async () => {
      router.get(PATH, SIMPLE_HANDLER);
      const response = await supertest(server).get(PATH);
      response.status.should.be.eql(200);
    });

    it('It should run the middleware first and then the handlers', async () => {
      router.useMiddleware((req, res) => {
        req.middleware = true;
      });
      router.get(PATH, (req, res) => {
        res.writeHead(200, headers);
        res.end(JSON.stringify({ middleware: req.middleware }));
      });
      const response = await supertest(server).get(PATH);
      response.status.should.be.eql(200);
      response.status.should.be.eql(200);
    });

    it('It should run the handlers and store the arguments if a route with arguments was given', async () => {
      router.get(PATH_WITH_ARGUMENTS, SIMPLE_HANDLER);
      const response = await supertest(server).get('/hello/world');
      response.status.should.be.eql(200);
      response.body.should.have.property('params');
      response.body.params.should.have.property('foo');
      response.body.params.should.have.property('fighters');
      response.body.params.foo.should.be.eql('hello');
      response.body.params.fighters.should.be.eql('world');
    });
  });
});
