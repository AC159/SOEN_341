//const AuthProvider = require('frontend/src/AuthProvider'); 
/*
import { useAuth } from '../../../AuthProvider';
import { SignOut } from 'frontend/src/components/Authentication/SignOut/SignOut';
import { signup } from 'frontend/src/AuthProvider'
import { signin } from 'frontend/src/AuthProvider'
import { signout } from 'frontend/src/AuthProvider'
import { auth } from './firebase';
*/
//const app = require("../app");
const posts = require('../routes/posts');
const Post = require('../Database/Models/Post');
const users = require('../routes/users')
const User = require('../Database/Models/User.js');

function sum(a, b) {
    return a + b;
}


test('random test case', () => {
    expect(sum(1,1)).toBe(2);
});

test('SignOut() should return null if it does not catch an exception', () => {
    expect(SignOut()).toBeNull();
});

test('registering new use', () => {
    expect(AuthProvider.signup("ryanmesservey3@gmail.com", "RyanDev1234$").statusText).toBe("Created");
}); //testing the result of registering a new user with signup()

test('registering new user with an email already in use', () => {
    expect(AuthProvider.signup("ryanmesservey1@gmail.com", "RyanDev1234$")).toBe("The email address is already in use by another account.");
}); //testing the result of registering a new user with signup() using an email already in use

test('signing in a registered user', () => {
    expect(AuthProvider.signin("ryanmesservey1@gmail.com", "RyanDev1234$")).toBe(auth.signInWithEmailAndPassword("ryanmesservey1@gmail.com", "RyanDev1234$"));
}); //testing the result of signing in an already registerd user using signin, which calles the auth fire base method

test('signing in with an invalid email', () => {
    expect(AuthProvider.signin("ryanmesservey2@gmail.com", "RyanDev1234$")).toBe("The email address is badly formatted.");
}); //testing the result of signing with an invalid email but valid password

test('signing in with an invalid password', () => {
    expect(AuthProvider.signin("ryanmesservey1@gmail.com", "RyanDev1234$$")).toBe("The password is invalid or the user does not have a password.");
}); //testing signing with an valid email but an invalid password

/*
test('signing out', () => {
    expect(AuthProvider.signout()).toBe(auth.signOut());
}); //testing that the signout() method correctly signs out the user
*/

//the following tests do not pass yet

test('Uploading a new image', () => {
    return request(posts)
    .post('/new')
    .then((response) => {
        expect(response.message).toBe("Upload was successful!");
    });
});

test('Commenting', () => {
    return request(posts)
    .post('/comment')
    .then((response) => {
        expect(image.comments).toContain({person: req.body.name, content: req.body.comment, uid: req.body.uid}),
        expect(response.image).toBe(image);  
    });
});

test('Liking', () => {
    return request(posts)
    .post('/like')
    .then((response) => {
        expect(post).toBe(Post.findOneAndUpdate({ _id: req.body.postID },
                            { "$addToSet": { likes: req.body.name } }, { new: true })),
        expect(respose.post).toBe(post);
    });
});

test('Setting Avatar', () => {
    return request(users)
    .post('/avatar')
    .then((response) => {
        expect(response.message).toBe("Upload was successful!")
    });
});

test('Following', () => {
    return request(users)
    .post('/follow')
    .then((response) => {
        expect(user).toBe(User.findOne({ _id: req.body.uid }).populate('followers', '_id name avatar').populate('following', '_id name avatar')),
        expect(followedUser).toBe(User.findOne({ _id: req.body.following_uid }).populate('followers', '_id name avatar').populate('following', '_id name avatar')),
        expect(response.user).toBe(user),
        expect(response.followedUser).toBe(followedUser);
    });
});

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
}); */
