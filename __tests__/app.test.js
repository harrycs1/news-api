const seed = require('../db/seeds/seed');
const request = require('supertest');
const testData = require('../db/data/test-data/index');
const db = require('../db/connection');
const app = require('../app');
const endpoints = require('../endpoints.json');

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
            expect(body).toEqual(endpoints)
        })
    })
})

describe('/api/articles', () => {
    test('GET:200 sends an array of article objects to the client', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles.length).toBe(5)
            body.articles.forEach((article) => {
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    comment_count: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                })
            })
        })
    })

    test('GET: 200 article objects are sorted by date in descending order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy('created_at', {descending: true})
        })
    })



    describe('api/articles/:article_id', () => {
        test('GET:200 sends an article object to the user with the correct article_id', () => {
            return request(app)
            .get('/api/articles/2')
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toMatchObject({
                    article_id: 2,
                    title: "Sony Vaio; or, The Laptop",
                    topic: "mitch",
                    author: "icellusedkars",
                    body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                    created_at: "2020-10-16T05:03:00.000Z",
                    votes: 0,
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
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