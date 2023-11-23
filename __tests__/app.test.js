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
    });

    test('GET: 200 article objects are sorted by date in descending order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy('created_at', {descending: true})
        })
    });

    // test('GET: 200 article objects can be filtered with topic query', () => {
    //     return request(app)
    //     .get('/api/articles?topic=')
    //     .expect(200)
    //     .then(({ body }) => {
    //         expect(body.articles).toBeSortedBy('created_at', {descending: true})
    //     })
    // });

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
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                    comment_count: "0"
                })
            })
        });

        test('GET:200 sends an article object to the user with the correct article_id and sums comment_count', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toMatchObject({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 100,
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                    comment_count: "11"
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

        test('PATCH:200 updates an article.votes by 1 given an article_id', () => {
            const newVotes = {
                inc_votes: 1
            }
            
            return request(app)
            .patch('/api/articles/3')
            .send(newVotes)
            .expect(200)
            .then(({ body }) => {
                expect(body.article.votes).toBe(1)
            })
        })

        test('PATCH:200 updates an article.votes by 5 given an article_id', () => {
            const newVotes = {
                inc_votes: 5
            }
            
            return request(app)
            .patch('/api/articles/3')
            .send(newVotes)
            .expect(200)
            .then(({ body }) => {
                expect(body.article.votes).toBe(5)
            })
        })

        test('PATCH:400 sends an appropriate status and error message when given an invalid article_id', () => {
            const newVotes = {
                inc_votes: 5
            }

            return request(app)
              .patch('/api/articles/banana')
              .send(newVotes)
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
              });
        });

        test('PATCH:404 sends an appropriate status and error message when given a non-existent article_id', () => {
            const newVotes = {
                inc_votes: 5
            }
            
            return request(app)
              .patch('/api/articles/88999')
              .send(newVotes)
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe('Article does not exist');
              });
        });

        test('PATCH:400 sends an appropriate status and error message when given an incomplete body', () => {
            const newVotes = {
                inc_votes: "banana"
            }
            
            return request(app)
              .patch('/api/articles/2')
              .send(newVotes)
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
              });
        });

        describe('/api/articles/:article_id/comments', () => {
            test('GET:200 sends an array of comment objects to the client', () => {
                return request(app)
                .get('/api/articles/5/comments')
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments.length).toBe(2);
                    expect(body.comments).toEqual([
                        {
                            comment_id: 15,
                            body: "I am 100% sure that we're not completely sure.",
                            article_id: 5,
                            author: 'butter_bridge',
                            votes: 1,
                            created_at: '2020-11-24T00:08:00.000Z'
                          },
                          {
                            comment_id: 14,
                            body: 'What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.',
                            article_id: 5,
                            author: 'icellusedkars',
                            votes: 16,
                            created_at: '2020-06-09T05:00:00.000Z'
                          }
                    ])
                })
            })

            test('GET:200 sends an array which are sorted by date posted in descending order', () => {
                return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments).toBeSortedBy('created_at', {descending: true})
                })
            })

            test('GET:200 sends an empty array when given an existing article_id but there are no comments', () => {
                return request(app)
                .get('/api/articles/2/comments')
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments).toEqual([]);
                })
            })

            test('GET:400 sends an appropriate status and error message when given an invalid article_id', () => {
                return request(app)
                  .get('/api/articles/banana/comments')
                  .expect(400)
                  .then(({ body }) => {
                    expect(body.msg).toBe('Bad request');
                  });
            });
    
            test('GET:404 sends an appropriate status and error message when given a non-existent article_id', () => {
                return request(app)
                  .get('/api/articles/88999/comments')
                  .expect(404)
                  .then(({ body }) => {
                    expect(body.msg).toBe('Article does not exist');
                  });
            });

            test('POST:201 inserts a new comment into the db and sends the new comment to the client', () => {
                const newComment = {
                    username: "rogersop",
                    body: "Hello, I am a comment!"
                };

                return request(app)
                .post('/api/articles/3/comments')
                .send(newComment)
                .expect(201)
                .then(({ body }) => {
                    expect(body.comment).toMatchObject({
                        comment_id: 19,
                        body: "Hello, I am a comment!",
                        article_id: 3,
                        author: 'rogersop',
                        votes: 0,
                        created_at: expect.any(String)
                      })
                })
            });

            test('POST:400 responds with an appropriate status and error message when provided with a bad comment (no body)', () => {
                const newComment = {
                    username: "rogersop"
                }

                return request(app)
                .post('/api/articles/3/comments')
                .send(newComment)
                .expect(400)
                .then((response) => {
                    expect(response.body.msg).toBe("Bad request")
                })
            });

            test('POST:400 sends an appropriate status and error message when given an invalid article_id', () => {
                const newComment = {
                    username: "rogersop",
                    body: "Hello, I am a comment!"
                };

                return request(app)
                  .post('/api/articles/banana/comments')
                  .send(newComment)
                  .expect(400)
                  .then(({ body }) => {
                    expect(body.msg).toBe('Bad request');
                  });
            });

            test('POST:404 sends an appropriate status and error message when given an non-existent article_id', () => {
                const newComment = {
                    username: "rogersop",
                    body: "Hello, I am a comment!"
                };

                return request(app)
                  .post('/api/articles/99988/comments')
                  .send(newComment)
                  .expect(404)
                  .then(({ body }) => {
                    expect(body.msg).toBe('Article does not exist');
                  });
            });

            test('POST:404 sends an appropriate status and error message when given an non-existent username', () => {
                const newComment = {
                    username: "harry",
                    body: "Hello, I am a comment!"
                };

                return request(app)
                  .post('/api/articles/3/comments')
                  .send(newComment)
                  .expect(404)
                  .then(({ body }) => {
                    expect(body.msg).toBe('User does not exist');
                  });
            });
        })
    });
})

describe('/api/users', () => {
    test('GET:200 sends an array of user objects to the client', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
            expect(body.users.length).toBe(4)
            body.users.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })
    })
})

describe('/api/comments/:comment_id', () => {
    test('DELETE:204 deletes a comment and sends no body back', () => {
        return request(app)
        .delete('/api/comments/2')
        .expect(204)
    });

    test('POST:400 sends an appropriate status and error message when given an invalid comment_id', () => {
        return request(app)
          .delete('/api/comments/banana')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
    });

    test('POST:404 sends an appropriate status and error message when given an non-existent comment_id', () => {
        return request(app)
          .delete('/api/comments/99988')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Comment does not exist');
          });
    });
})