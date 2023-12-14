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
            expect(body.articles.length).toBe(10)
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

    test('GET:200 article objects are sorted by date in descending order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy('created_at', {descending: true})
        })
    });

    test('GET:200 article objects can be filtered with topic query', () => {
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toEqual([{
                article_id: 5,
                author: 'rogersop',
                title: 'UNCOVERED: catspiracy to bring down democracy',
                topic: 'cats',
                created_at: '2020-08-03T13:14:00.000Z',
                votes: 0,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '2'
              }])
        })
    });

    test('GET:404 responds with an appropriate error if the topic query does not exist', () => {
        return request(app)
          .get('/api/articles?topic=banana')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Topic does not exist");
          });
    });

    test('GET:200 responds with an appropriate message if the topic query exists but has no articles', () => {
        return request(app)
          .get('/api/articles?topic=paper')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toEqual([]);
          });
    });

    describe('articles can be sorted by any valid column using the sort_by query', () => {
        test('GET:200 articles can be sorted by title using the sort_by query', () => {
            return request(app)
            .get('/api/articles?sort_by=title')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy('title', {descending: true})
            })
        });

        test('GET:200 articles can be sorted by article_id using the sort_by query', () => {
            return request(app)
            .get('/api/articles?sort_by=article_id')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy('article_id', {descending: true})
            })
        });

        test('GET:200 articles can be sorted by author using the sort_by query', () => {
            return request(app)
            .get('/api/articles?sort_by=author')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy('author', {descending: true})
            })
        });

        test('GET:200 articles can be sorted by topic using the sort_by query', () => {
            return request(app)
            .get('/api/articles?sort_by=topic')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy('topic', {descending: true})
            })
        });

        test('GET:200 articles can be sorted by votes using the sort_by query', () => {
            return request(app)
            .get('/api/articles?sort_by=votes')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy('votes', {descending: true})
            })
        });

        test('GET:200 articles can be sorted by comment_count using the sort_by query', () => {
            return request(app)
            .get('/api/articles?sort_by=comment_count')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy(+'comment_count', {descending: true})
            })
        });
    });

    test('GET:200 articles can be sorted in ascending order with the order query', () => {
        return request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy('created_at', {ascending: true})
        })
    });

    test('GET:200 articles can be sorted in descending order with the order query', () => {
        return request(app)
        .get('/api/articles?order=desc')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy('created_at', {descending: true})
        })
    });

    test('GET:200 accepts a combination of queries', () => {
        return request(app)
        .get('/api/articles?order=asc&sort_by=title')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy('title', {ascending: true})
        })
    });

    test('GET:400 responds with an error if the sort_by query is invalid', () => {
        return request(app)
          .get('/api/articles?sort_by=banana')
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Invalid sort query");
          });
    });

    test('GET:400 responds with an error if the order query is invalid', () => {
        return request(app)
          .get('/api/articles?order=banana')
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Invalid order query");
          });
    });

    test('GET:200 the number of responses can be limited with the limit query', () => {
        return request(app)
        .get('/api/articles?limit=3')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles.length).toBe(3);
        })
    });

    test('GET:200 the number of responses is 10 by default if given no limit query', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles.length).toBe(10);
        })
    });

    test('GET:400 responds with an error if the limit query is invalid', () => {
        return request(app)
          .get('/api/articles?limit=banana')
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Invalid limit query");
          });
    });

    test('GET:200 response has a total_count property for the total number of articles returned, discounting the limit query', () => {
        return request(app)
        .get('/api/articles?limit=2')
        .expect(200)
        .then(({ body }) => {
            expect(body.total_count).toBe(13);
        })
    });

    test('GET:200 page number can be specified with the p query', () => {
        return request(app)
        .get('/api/articles?limit=2&p=2')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles.length).toBe(2);
            expect(body.articles).toMatchObject([{
                article_id: 12,
                author: 'butter_bridge',
                title: 'Moustache',
                topic: 'mitch',
                created_at: expect.any(String),
                votes: 0,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '0'
              },
              {
                article_id: 13,
                author: 'butter_bridge',
                title: 'Another article about Mitch',
                topic: 'mitch',
                created_at: expect.any(String),
                votes: 0,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '0'
              }])
        })
    });

    test('GET:400 responds with an error if the p query is invalid', () => {
        return request(app)
          .get('/api/articles?p=banana')
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Invalid page query");
          });
    });

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

        test('POST:201 inserts a new post into the db and sends the new post to the client', () => {
            const newPost = {
                author: "rogersop",
                title: "test post",
                body: "test body",
                topic: "mitch",
                article_img_url: "test.img"
            }
            
            return request(app)
            .post('/api/articles')
            .send(newPost)
            .expect(201)
            .then(({ body }) => {
                expect(body).toMatchObject({
                    author: "rogersop",
                    title: "test post",
                    body: "test body",
                    topic: "mitch",
                    article_img_url: "test.img",
                    created_at: expect.any(String),
                    article_id: 14,
                    votes: 0,
                    comment_count: "0"
                })
            })
        });

        test('POST:404 sends an appropriate status and error message when provided with a non-existent username', () => {
            const newPost = {
                author: "harry",
                title: "test post",
                body: "test body",
                topic: "mitch",
                article_img_url: "test.img"
            }
            
            return request(app)
            .post('/api/articles')
            .send(newPost)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Username does not exist")
            })
        });

        test('POST:404 sends an appropriate status and error message when provided with a non-existent topic', () => {
            const newPost = {
                author: "rogersop",
                title: "test post",
                body: "test body",
                topic: "test",
                article_img_url: "test.img"
            }
            
            return request(app)
            .post('/api/articles')
            .send(newPost)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Topic does not exist")
            })
        });

        test('POST:400 sends an appropriate status and error message when provided with an incomplete article (no body)', () => {
            const newPost = {
                author: "rogersop",
                title: "test post",
                topic: "mitch",
                article_img_url: "test.img"
            }
            
            return request(app)
            .post('/api/articles')
            .send(newPost)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request")
            })
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

    describe('/api/users/:username', () => {
        test('GET:200 sends a user object to the user with the correct username', () => {
            return request(app)
            .get('/api/users/butter_bridge')
            .expect(200)
            .then(({ body }) => {
                expect(body.user).toEqual(  {
                    username: 'butter_bridge',
                    name: 'jonny',
                    avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                  })
            })
        });

        test('GET:404 sends an appropriate status and error message when given a non-existent username', () => {
            return request(app)
              .get('/api/users/banana')
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe('Username does not exist');
              });
        });
    })
})

describe('/api/comments/:comment_id', () => {
    test('DELETE:204 deletes a comment and sends no body back', () => {
        return request(app)
        .delete('/api/comments/2')
        .expect(204)
    });

    test('DELETE:400 sends an appropriate status and error message when given an invalid comment_id', () => {
        return request(app)
          .delete('/api/comments/banana')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
    });

    test('DELETE:404 sends an appropriate status and error message when given an non-existent comment_id', () => {
        return request(app)
          .delete('/api/comments/99988')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Comment does not exist');
          });
    });

    test('PATCH:200 increases the comment votes given a comment_id', () =>{
        const inc_votes = {
            inc_votes: 1
        }
        
        return request(app)
        .patch('/api/comments/2')
        .send(inc_votes)
        .expect(200)
        .then(({ body }) => {
            expect(body.comment).toEqual({
                comment_id: 2,
                body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
                article_id: 1,
                author: 'butter_bridge',
                votes: 15,
                created_at: '2020-10-31T03:03:00.000Z'
              })
        })
    });

    test('PATCH:200 decreases the comment votes given a comment_id', () =>{
        const inc_votes = {
            inc_votes: -1
        }
        
        return request(app)
        .patch('/api/comments/2')
        .send(inc_votes)
        .expect(200)
        .then(({ body }) => {
            expect(body.comment).toEqual({
                comment_id: 2,
                body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
                article_id: 1,
                author: 'butter_bridge',
                votes: 13,
                created_at: '2020-10-31T03:03:00.000Z'
              })
        })
    });

    test('PATCH:400 sends an appropriate status and error message when given an invalid comment_id', () => {
        const inc_votes = {
            inc_votes: 1
        }

        return request(app)
          .patch('/api/comments/banana')
          .send(inc_votes)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
    });

    test('PATCH:404 sends an appropriate status and error message when given a non-existent comment_id', () => {
        const inc_votes = {
            inc_votes: 1
        }
        
        return request(app)
          .patch('/api/comments/88999')
          .send(inc_votes)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Comment does not exist');
          });
    });

    test('PATCH:400 sends an appropriate status and error message when given an incomplete body', () => {
        const inc_votes = {}
        
        return request(app)
          .patch('/api/comments/2')
          .send(inc_votes)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
    });
})