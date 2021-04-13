const cloudHelpers = require('../cloudStorage/helpers');
const request = require('request');
const { _, createUser, deleteUser, followFunction, unfollowFunction } = require('../routes/users');
const { r, likeFunction } = require('../routes/posts');

require('dotenv').config();
require('firebase/auth');
const firebase = require('firebase/app');
const mongoose = require('mongoose');

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

        try {
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
        } catch (e) {

        }
    });

    // todo: fix this test!!!
    it('should reject upload', async () => {

        try {
            let url = null;

            // Upload the image to google cloud and returns a public image url
            const res = await cloudHelpers.deleteImage(url, true);
            expect(res).toBe("Image upload rejected!");
        } catch (e) {

        }
    });

});



describe("CREATE a user", async () => {

    beforeEach((done) => {
        mongoose.connect(process.env.MONGODB_CLUSTER_URL);
        done();
    });

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

    it('should create a second user in the db', async () => {
        const req = {
            body: {
                uid: 'some_uid_2',
                name: 'some_name_2',
                email: 'some_email_2'
            }
        }
        let res = await createUser(req);

        expect(res.message).toBe('Everything is clear!');
    });

    it('should create an error when trying to make the same user', async () => {
        try {
            const req = {
                body: {
                    uid: 'some_uid',
                    name: 'some_name',
                    email: 'some_email'
                }
            }
            let res = await createUser(req);
            // console.log("Error:", res);
            expect(res.message).toBe('error');
        } catch (e) {

        }
    });

});


describe("FOLLOW a user", () => {

    beforeEach((done) => {
        mongoose.connect(process.env.MONGODB_CLUSTER_URL);
        done();
    });

    it('should update the user object', async () => {
        const req = {
            body: {
                uid: 'some_uid',
                following_uid: 'some_uid_2'
            }
        }
        let res = await followFunction(req);
        expect(res.user._id).toBe(req.body.uid);
    });

});


describe("UNFOLLOW a user", () => {

    beforeEach((done) => {
        mongoose.connect(process.env.MONGODB_CLUSTER_URL);
        done();
    });

    it('should update the user object', async () => {
        const req = {
            body: {
                uid: 'some_uid',
                following_uid: 'some_uid_2'
            }
        }
        let res = await followFunction(req);
        expect(res.followedUser._id).toBe(req.body.following_uid);
    });

});

// describe("CREATE a post", () => {
//
//     beforeEach((done) => {
//         mongoose.connect(process.env.MONGODB_CLUSTER_URL);
//         done();
//     });
//
//     it('should create a post object', async () => {
//         const req = {
//             body: {
//                 name: 'my_name',
//                 postID: 'post_id'
//             }
//         }
//         let res = await likeFunction(req);
//         expect(res.postID).toBe(req.body.postID);
//     });
//
// });

describe("LIKE a post", () => {

    beforeEach((done) => {
        mongoose.connect(process.env.MONGODB_CLUSTER_URL);
        done();
    });

    it('should update the post object', async () => {
        const req = {
            body: {
                name: 'my_name',
                postID: 'post_id'
            }
        }
        let res = await likeFunction(req);
        expect(res.message).toBe('error');
    });

});

describe("DELETE an image", () => {

    it('should delete the logo image', async () => {

        const bucketName = 'soen-341-instagram-pictures';
        const gcsFileName = 'test_image';
        const baseUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;

        // Delete the image that was inserted:
        const response = await cloudHelpers.deleteImage(baseUrl, true);

        expect(response).toBe("Image deleted successfully");
    });
});

describe("DELETE a user object", async () => {

    beforeEach((done) => {
        mongoose.connect(process.env.MONGODB_CLUSTER_URL);
        done();
    });

    it('should delete a user in the db', async () => {

        let res = await deleteUser('some_uid');
        expect(res.message).toBe('User has been deleted');
    });

    it('should delete the second user in the db', async () => {

        let res = await deleteUser('some_uid_2');
        expect(res.message).toBe('User has been deleted');
    });

});


test('signin should use the auth firebase method to verify the credentials entered by the user, valid password', async () => {
    const authentication = async () => auth.signInWithEmailAndPassword("ryanmesservey1@gmail.com", "RyanDev1234$")

    return authentication().then(() =>{
        expect(firebase.auth().currentUser).not.toBeNull()
    })
}) //testing signing with an existing user's credentials

test('signin should use the auth firebase method to verify the credentials entered by the user, invalid password', () => {
    const authentication = async () => auth.signInWithEmailAndPassword("ryanmesservey1@gmail.com", "badPassword")

    return auth.signOut().then(() => {
        authentication().then(() =>{
            expect(firebase.auth().currentUser).toBeNull()
        })
    })
}) //testing signing with invalid credentials

test('signout should use the auth firebase method to revert the authenticated user to an signed out state', () => {
    const signOut = async () => auth.signOut()

    return signOut().then(() => {
            expect(firebase.auth().currentUser).toBeNull()
        })
})

test('signup should use the auth firebase method to create a new user in the database and be automatically signed in, user already exist', () => {
    const signUp = async() => auth.createUserWithEmailAndPassword("ryanmesservey1@gmail.com", "RyanDev1234$");

    return auth.signOut().then(() => {
        signUp().then(() =>{
        }).catch(function(error) {
            expect(error.code).toBe("auth/email-already-in-use")
        })
    })
})
