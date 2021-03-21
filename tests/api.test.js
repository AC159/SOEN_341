
const app = require("../app");

function sum(a, b) {
    return a + b;
}


test('random test case', () => {
    expect(sum(1,1)).toBe(2);
})

describe("POST /like ", () => {
    test('test expected status code for like route', () => {
        return request(app)
        .post('/like')
        .then((response) => {
            expect(response.statusCode).toBe(200);
        });
    });
});

describe("POST /follow ", () => {
    test('test expected status code for follow route', () => {
        return request(app)
        .post('/follow')
        .then((response) => {
            expect(response.statusCode).toBe(200);
        });
    });
});

describe("GET /search/:filter ", () => {
    test('test expected status code for search route', () => {
        return request(app)
        .get('/search/:filter')
        .then((response) => {
            expect(response.statusCode).toBe(200);
        });
    });
});

describe("GET /profile/:id ", () => {
    test('This route should lead to the profile page', () => {
        return request(app)
        .get('/profile/:id')
        .then((response) => {
            expect(response.statusCode).toBe(401);
        });
    });
});

describe("POST /avatar ", () => {
    test('test expected status code for sign up route', () => {
        return request(app)
        .post('/avatar')
        .then((response) => {
            expect(response.statusCode).toBe(200);
        });
    });
});

describe("POST /signup ", () => {
    test('test expected status code for sign up route', () => {
        return request(app)
        .post('/signin')
        .then((response) => {
            expect(response.statusCode).toBe(201);
        });
    });
});

describe("GET /signout ", () => {
    test('This route should lead to the sign out page', () => {
        return request(app)
        .get('/signout')
        .then((response) => {
            expect(response.statusCode).toBe(401);
        });
    });
});