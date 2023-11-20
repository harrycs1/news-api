const seed = require('../db/seeds/seed');
const request = require('supertest');
const testData = require('../db/data/test-data/index');
const db = require('../db/connection');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("ANY /notapath", () => {
	test("404: respond with an error message if path not found", () => {
		return request(app)
		.get("/notapath")
		.expect(404)
		.then(({ body }) => {
			expect(body.msg).toBe("path not found")
		})
	})
})

describe('/api/topics', () => {
    test('GET: 200 sends an array of topics to the client', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
            expect(body.topics.length).toBe(3);
            body.topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    description: expect.any(String),
                    slug: expect.any(String)
                })
            })
        })
    })
})

describe('/api', () => {
    test('GET: 200 sends an object describing all available endpoints to the user', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
            for (let endpoint in body) {
                expect(body[endpoint]).toMatchObject({
                    description: expect.any(String),
                    queries: expect.any(Object),
                    requestFormat: expect.any(Object),
                    exampleResponse: expect.any(Object)
                })
            }
        })
    })
})

describe('/api/articles', () => {
    describe('api/articles/:article_id', () => {
        test('GET:200 sends an article object to the user with the correct article_id', () => {
            return request(app)
            .get('/api/articles/2')
            .expect(200)
            .then(({ body }) => {
                expect(body.article.article_id).toBe(2);
                expect(body.article).toMatchObject({
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    article_img_url: expect.any(String)
                })
            })
        })

        test('GET:400 sends an appropriate status and error message when given an invalid article_id', () => {
            return request(app)
              .get('/api/articles/banana')
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
              });
        });

        test('GET:404 sends an appropriate status and error message when given a non-existent article_id', () => {
            return request(app)
              .get('/api/articles/88999')
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe('Article does not exist');
              });
        });
    })
})