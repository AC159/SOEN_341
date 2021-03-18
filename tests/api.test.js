
function sum(a, b) {
    return a + b;
}


test('random test case', () => {
    expect(sum(1,1)).toBe(2);
})

describe("GET / ", () => {
    test('This route should lead to the home page', () => {
        return request(app)
        .get('/')
        .then((response) => {
            expect(response.statusCode).toBe(401);
        });
    });
});

describe("GET /signup ", () => {
    test('This route should lead to the sign up page', () => {
        return request(app)
        .get('/signup')
        .then((response) => {
            expect(response.statusCode).toBe(401);
        });
    });
});

describe("GET /signin ", () => {
    test('This route should lead to the sign in page', () => {
        return request(app)
        .get('/signin')
        .then((response) => {
            expect(response.statusCode).toBe(401);
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

describe("GET /profile/:id ", () => {
    test('This route should lead to the profile page', () => {
        return request(app)
        .get('/profile/:id')
        .then((response) => {
            expect(response.statusCode).toBe(401);
        });
    });
});