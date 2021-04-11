import { useAuth } from '../../../AuthProvider';
import { SignOut } from 'frontend/src/components/Authentication/SignOut/SignOut.js';
import { signup } from 'frontend/src/AuthProvider.js'
import { signin } from 'frontend/src/AuthProvider.js'
import { signout } from 'frontend/src/AuthProvider.js'
import { auth } from './firebase';

//const app = require("../app");

function sum(a, b) {
    return a + b;
}


test('random test case', () => {
    expect(sum(1,1)).toBe(2);
})

test('SignOut() should return null if it does not catch an exception', () => {
    expect(SignOut()).toBeNull();
})

test('signup should use the auth firebase method to create a new authorized user', () => {
    expect(signup("ryanmesservey@gmail.com", "RyanDev1234$")).toBe(auth.createUserWithEmailAndPassword("ryanmesservey@gmail.com", "RyanDev1234$"));
}) //testing signup with credentials that are not already attributed to a user

test('signin should use the auth firebase method to verify the credentials entered by the user', () => {
    expect(signin("ryanmesservey1@gmail.com", "RyanDev1234$")).toBe(auth.signInWithEmailAndPassword("ryanmesservey1@gmail.com", "RyanDev1234$"));
}) //testing signing with an existing user's credentials

test('signin should use the auth firebase method to verify the credentials entered by the user', () => {
    expect(signin("ryanmesservey2@gmail.com", "RyanDev1234$")).toBe(auth.signInWithEmailAndPassword("ryanmesservey2@gmail.com", "RyanDev1234$"));
}) //testing signing with invalid credentials

test('signout should use the auth firebase method to revert the authenticated user to an signed out state', () => {
    expect(signout()).toBe(auth.signOut());
})

/*
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
*/