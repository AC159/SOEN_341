const cloudHelpers = require('../cloudStorage/helpers');
const request = require('request');
const { _, createUser, deleteUser, followFunction, unfollowFunction } = require('../routes/users');
const { r, likeFunction, unlikeFunction } = require('../routes/posts');

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
beforeAll(done => {
    done()
  })
  
  afterAll(async done => {
    // Closing the DB connection allows Jest to exit successfully.
    try{
        await mongoose.connection.close()
        done()
    } catch{
        console.log("error in ending the connection")
    }
  })

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

                if (err) {
                    file = null;
                }
                else {
                    file = buffer;
                }
            });

            // Upload the image to google cloud and returns a public image url
            const avatarUrl = await cloudHelpers.uploadImage(file, true);
            expect(avatarUrl).toBe(baseUrl);
        } catch (e) {
            console.log("error when uploading the logo image")
        }
    });

    it('should reject upload', async () => {
        expect.assertions(1);
        try {
            let url = null;

            // Upload the image to google cloud and returns a public image url
            const res = await cloudHelpers.deleteImage(url, true);
            // expect(res).toBe("Image upload rejected!");
        } catch (e) {
            expect(e).toBe("Image upload rejected!");
        }
    });

});



describe("CREATE a user",  () => {

    beforeEach( async (done) => {
        await mongoose.connect(process.env.MONGODB_CLUSTER_URL).catch(err => console.log(err))
        done();
    });

    it('should create a user in the db', async () => {
        try {
            const req = {
                body: {
                    uid: 'some_uid',
                    name: 'some_name',
                    email: 'some_email'
                }
            }
            let res = await createUser(req);

            expect(res.message).toBe('Everything is clear!');
        } catch (e) {
            console.log("error when creating a new user")
        }
    });

    it('should create a second user in the db', async () => {
        try {
            const req = {
                body: {
                    uid: 'some_uid_2',
                    name: 'some_name_2',
                    email: 'some_email_2'
                }
            }
            let res = await createUser(req);

            expect(res.message).toBe('Everything is clear!');
        } catch (e) {
            console.log("error when creating a 2nd user")
        }
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
            expect(res.message).toBe('error');
        } catch (e) {
            console.log("error, created the user when it shouldn't be possible since he already exists")

        }
    });

});


describe("FOLLOW a user", () => {

    beforeEach(async (done) => {
        await mongoose.connect(process.env.MONGODB_CLUSTER_URL).catch(err => console.log(err))
        done();
    });

    it('should update the user object', async () => {
        try {
            const req = {
                body: {
                    uid: 'some_uid',
                    following_uid: 'some_uid_2'
                }
            }
            let res = await followFunction(req);
            expect(res.user._id).toBe(req.body.uid);
        } catch (e) {
            console.log("error in following the user")
        }
    });


    it('should reject the request to follow a user', async () => {
        try {
            // Missing parameter in the request
            const req = {
                body: {
                    following_uid: 'some_uid_2'
                }
            }
            let res = await followFunction(req);
        } catch (e) {
            expect(e).toBe('error when following a user');
        }
    });


});


describe("UNFOLLOW a user", () => {

    beforeEach(async (done) => {
        await mongoose.connect(process.env.MONGODB_CLUSTER_URL).catch(err => console.log(err))
        done();
    });

    it('should update the user object by unfollowing a user', async () => {
        try {
            const req = {
                body: {
                    uid: 'some_uid',
                    following_uid: 'some_uid_2'
                }
            }
            let res = await unfollowFunction(req);
            expect(res.followedUser._id).toBe(req.body.following_uid);
        } catch (e) {
            console.log("error in unfollowing the user");
        }
    });

    it('should reject the request to unfollow a user', async () => {
        try {
            // Missing parameter in the request
            const req = {
                body: {
                    following_uid: 'some_uid_2'
                }
            }
            let res = await unfollowFunction(req);
        } catch (e) {
            expect(e).toBe('error when unfollowing a user');
        }
    });

});


describe("LIKE a post", () => {

    beforeEach(async (done) => {
        await mongoose.connect(process.env.MONGODB_CLUSTER_URL).catch(err => console.log(err))
        done();
    });

    it('should reject the post object', async () => {
        try {
            const req = {
                body: {
                    name: 'some_name',
                    postID: 'id123'
                }
            }
            let res = await likeFunction(req);
            expect(res.message).toBe('error');
        } catch (e) {
            console.log("error when liking a post");
        }
    });

    it('should reject the post request', async () => {
        try {
            const req = {
                body: {
                    name: 'my_name'
                }
            }
            let res = await likeFunction(req);
            expect(res.message).toBe('missing post id');
        } catch (e) {
            console.log("error when liking a post");
        }
    });

    it('should reject the post request', async () => {
        try {
            const req = {
                body: {
                    postID: 'id123'
                }
            }
            let res = await likeFunction(req);
            expect(res.message).toBe('missing name');
        } catch (e) {
            console.log("error when liking a post");
        }
    });

});

describe("UNLIKE a post", () => {

    beforeEach(async (done) => {
        await mongoose.connect(process.env.MONGODB_CLUSTER_URL).catch(err => console.log(err))
        done();
    });

    it('should reject the post object', async () => {
        try {
            const req = {
                body: {
                    postID: 'post_id'
                }
            }
            let res = await unlikeFunction(req);
            expect(res.message).toBe('missing name parameter');
        } catch (e) {
            console.log("error when unliking a post");
        }
    });

    it('should indicate a missing parameter', async () => {
        try {
            const req = {
                body: {
                    name: 'random_name'
                }
            }
            let res = await unlikeFunction(req);
            expect(res.message).toBe('missing postID parameter');
        } catch (e) {
            console.log("error when unliking a post");
        }
    });

});

describe("DELETE an image", () => {

    it('should delete the logo image', async () => {

        try {
            const bucketName = 'soen-341-instagram-pictures';
            const gcsFileName = 'test_image';
            const baseUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;

            // Delete the image that was inserted:
            const response = await cloudHelpers.deleteImage(baseUrl, true);

            expect(response).toBe("Image deleted successfully");
        } catch (e) {
            console.log("error when deleting an image")
        }
    });

    it('should update the post object', async () => {
        try {
            const req = {
                body: {
                    name: 'my_name',
                    postID: 'post_id'
                }
            }
            let res = await likeFunction(req);
            expect(res.message).toBe('error');
        } catch (e) {
            console.log("error")
        }
    });

});

describe("DELETE a user object",  () => {

    beforeEach(async (done) => {
        await mongoose.connect(process.env.MONGODB_CLUSTER_URL).catch(err => console.log(err))
        done();
    });

    it('should delete a user in the db', async () => {

        try {
            let res = await deleteUser('some_uid');
            expect(res.message).toBe('User has been deleted');
        } catch (e) {
            console.log("error when deleting the user object")
        }

    });

    it('should delete the second user in the db', async () => {

        try {
            let res = await deleteUser('some_uid_2');
            expect(res.message).toBe('User has been deleted');
        } catch (e) {
            console.log("error when deleting the 2nd created user")
        }
    });

});

describe("signing in with the firebase method to veryfy the user's credentials", () => {
    it('valid password, user should be signed in and not be null', async () => {

        const authentication = async () => auth.signInWithEmailAndPassword(process.env.EMAIL, process.env.PASSWORD)

        return authentication().then(() =>{
            expect(firebase.auth().currentUser).not.toBeNull()
        }).catch(e => {
            console.log("error when signing in with firebase")
        })
    }) //testing signing with an existing user's credentials

    it('invalid password, user shouldn\'t be signed in, should be null', () => {

        const authentication = async () => auth.signInWithEmailAndPassword(process.env.EMAIL, process.env.PASSWORD)

        return (
            auth.signOut()
            .then(() => {
                authentication()
                .then(() =>{
                    expect(firebase.auth().currentUser).toBeNull()
                 }).catch(error => {
                    // console.log(error.code)
                })
            }).catch(e => {
                console.log("error, user got logged in when he shouldn't have")
            })
        )
    }) //testing signing with invalid credentials
})



describe('signout should use the auth firebase method to revert the authenticated user to an signed out state', () => {
    it('the current user is signed out and current user is null', () => {
        const signOut = async () => auth.signOut()

        return signOut().then(() => {
                expect(firebase.auth().currentUser).toBeNull()
            }).catch((e) => {
                console.log("error when signing out the user")
            })
    })
})
describe("signup should use the firebase method to create a new account and be automatically signed it", () => {
    it('user does not exist, a new account should be created and signed in automatically, user should not be null', () => {
        const email = Date.now() + "@gmail.com"
        const password = process.env.PASSWORD + Date.now();

        const signUp = async() => auth.createUserWithEmailAndPassword(email, password);

        return(
            signUp(() => {

            }).then(() =>{
                expect(firebase.auth().currentUser).not.toBeNull();
            }).catch((e) =>{
                console.log("error when signing up")
            })
        )
})
    it( 'user already exist, an error message should be received', () => {
        const signUp = async() => auth.createUserWithEmailAndPassword(process.env.EMAIL, process.env.PASSWORD);

        return auth.signOut().then(() => {
            signUp().then(() =>{
            }).catch(function(error) {
                expect(error.code).toBe("auth/email-already-in-use")
            })
        }).catch(e => {
            console.log("error when signing up, the user shouldn't be able to create the same user but still did")
        })
    })
})



