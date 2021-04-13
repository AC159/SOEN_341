const cloudHelpers = require('../cloudStorage/helpers');
const request = require('request');
const { router, createUser } = require('../routes/users');

require('dotenv').config({ path: '../frontend/.env' });
require('firebase/auth');
const firebase = require('firebase/app');

const app = firebase.initializeApp(
    {
        apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
        appId: process.env.REACT_APP_FIREBASE_APPID,
        measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID
    }
);
const auth = app.auth();

describe("UPLOAD  an image", () => {

    it('should upload the logo image', async () => {

        const bucketName = 'soen-341-instagram-pictures';
        const gcsFileName = 'test_image';
        const baseUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;
        let file = null;

        let url = '../frontend/src/assets/images/wallStreetBets.jpg';
        request({ url, encoding: null }, (err, resp, buffer) => {
            // Use the buffer
            // buffer contains the image data
            // typeof buffer === 'object'
            file = buffer;
        });

        // Upload the image to google cloud and returns a public image url
        const avatarUrl = await cloudHelpers.uploadImage(file, true);
        expect(avatarUrl).toBe(baseUrl);

    });
});


describe("DELETE  an image", () => {

    it('should delete the logo image', async () => {

        const bucketName = 'soen-341-instagram-pictures';
        const gcsFileName = 'test_image';
        const baseUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;

        // Delete the image that was inserted:
        const response = await cloudHelpers.deleteImage(baseUrl, true);

        expect(response).toBe("Image deleted successfully");
    });
});


describe("CREATE a user object", async () => {

    it('should create a user in the db', async () => {

        const req = {
            body: {
                uid: 'some_uid',
                name: 'some_name',
                email: 'some_email'
            }
        }

        let res = await createUser(req);

        expect(res.message).toBe('Everything is clear!');
    });
});


test('signin should use the auth firebase method to verify the credentials entered by the user, valid password', () => {
    const authentication = async () => auth.signInWithEmailAndPassword("ryanmesservey1@gmail.com", "RyanDev1234$")
    authentication().then(() =>{
        expect(firebase.auth().currentUser).not.toBeNull()
    })
    auth.signOut()
}) //testing signing with an existing user's credentials

test('signin should use the auth firebase method to verify the credentials entered by the user, invalid password', () => {
    const authentication = async () => auth.signInWithEmailAndPassword("ryanmesservey1@gmail.com", "RyanDev1234$")
    authentication().then(() =>{
        expect(firebase.auth().currentUser).toBeNull()
    })
}) //testing signing with invalid credentials

test('signout should use the auth firebase method to revert the authenticated user to an signed out state', () => {
    const signIn = async () => auth.signOutauth.signInWithEmailAndPassword("ryanmesservey1@gmail.com", "RyanDev1234$")
    const signOut = async () => auth.signOut
    signIn().then(() =>{
        signOut().then(() =>{
            expect(firebase.auth().currentUser).toBeNull()
        })
    })
})

// test('Uploading a new image', () => {
//     return request(posts)
//     .post('/new')
//     .then((response) => {
//         expect(response.message).toBe("Upload was successful!");
//     });
// });

// test('Commenting', () => {
//     return request(posts)
//     .post('/comment')
//     .then((response) => {
//         expect(image.comments).toContain({person: req.body.name, content: req.body.comment, uid: req.body.uid}),
//         expect(response.image).toBe(image);
//     });
// });

// test('Liking', () => {
//     return request(posts)
//     .post('/like')
//     .then((response) => {
//         expect(post).toBe(Post.findOneAndUpdate({ _id: req.body.postID },
//                             { "$addToSet": { likes: req.body.name } }, { new: true })),
//         expect(respose.post).toBe(post);
//     });
// });

// test('Setting Avatar', () => {
//     return request(users)
//     .post('/avatar')
//     .then((response) => {
//         expect(response.message).toBe("Upload was successful!")
//     });
// });
//
// describe("POST /follow ", () => {
//     test('test expected status code for follow route', () => {
//         return request(app)
//         .post('/follow')
//         .then((response) => {
//             expect(response.statusCode).toBe(200);
//         });
//     });
// });
//
// describe("GET /search/:filter ", () => {
//     test('test expected status code for search route', () => {
//         return request(app)
//         .get('/search/:filter')
//         .then((response) => {
//             expect(response.statusCode).toBe(200);
//         });
//     });
// });
//
// describe("GET /profile/:id ", () => {
//     test('This route should lead to the profile page', () => {
//         return request(app)
//         .get('/profile/:id')
//         .then((response) => {
//             expect(response.statusCode).toBe(401);
//         });
//     });
// });
//
// describe("POST /avatar ", () => {
//     test('test expected status code for sign up route', () => {
//         return request(app)
//         .post('/avatar')
//         .then((response) => {
//             expect(response.statusCode).toBe(200);
//         });
//     });
// });
//
// describe("POST /signup ", () => {
//     test('test expected status code for sign up route', () => {
//         return request(app)
//         .post('/signin')
//         .then((response) => {
//             expect(response.statusCode).toBe(201);
//         });
//     });
// });
//
// describe("GET /signout ", () => {
//     test('This route should lead to the sign out page', () => {
//         return request(app)
//         .get('/signout')
//         .then((response) => {
//             expect(response.statusCode).toBe(401);
//         });
//     });
// });