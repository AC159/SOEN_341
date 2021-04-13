// import { useAuth } from '../../../AuthProvider';
// import { SignOut } from 'frontend/src/components/Authentication/SignOut/SignOut';
// import { signup } from 'frontend/src/AuthProvider'
// import { signin } from 'frontend/src/AuthProvider'
// import { signout } from 'frontend/src/AuthProvider'
// import AuthProvider from '../frontend/src/AuthProvider'
//const app = require("../app");
// import 'firebase/auth'
require('dotenv').config()
require('firebase/auth');
const firebase = require('firebase/app')
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
function sum(a, b) {
    return a + b;
}

// test('random test case', () => {
//     expect(sum(1,1)).toBe(2);
// })

// test('signup should use the auth firebase method to create a new authorized user', () => {
//     expect(auth.createUserWithEmailAndPassword("ryanmesservey@gmail.com", "RyanDev1234$"));
// }) //testing signup with credentials that are not already attributed to a user

test('signin should use the auth firebase method to verify the credentials entered by the user, valid password', () => {
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

// test('signup should use the auth firebase method to create a new user in the database, user already exists', () => {
//     const username = "ryanmesservey" + Date.now() + "@gmail.com"
//     const signUp = async() => auth.createUserWithEmailAndPassword(username, "RyanDev1234$");
//     const signIn = async () => auth.signInWithEmailAndPassword(username, "RyanDev1234$");
//     signUp().then(() =>{
//         console.log("shouldnt happen")
//     }).catch(

//     )
// })

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

// test('Following', () => {
//     return request(users)
//     .post('/follow')
//     .then((response) => {
//         expect(user).toBe(User.findOne({ _id: req.body.uid }).populate('followers', '_id name avatar').populate('following', '_id name avatar')),
//         expect(followedUser).toBe(User.findOne({ _id: req.body.following_uid }).populate('followers', '_id name avatar').populate('following', '_id name avatar')),
//         expect(response.user).toBe(user),
//         expect(response.followedUser).toBe(followedUser);
//     });
// });

// describe("GET /search/:filter ", () => {
//     test('test expected status code for search route', () => {
//         return request(app)
//         .get('/search/:filter')
//         .then((response) => {
//             expect(response.statusCode).toBe(200);
//         });
//     });
// });

// describe("GET /profile/:id ", () => {
//     test('This route should lead to the profile page', () => {
//         return request(app)
//         .get('/profile/:id')
//         .then((response) => {
//             expect(response.statusCode).toBe(401);
//         });
//     });
// });

// describe("POST /avatar ", () => {
//     test('test expected status code for sign up route', () => {
//         return request(app)
//         .post('/avatar')
//         .then((response) => {
//             expect(response.statusCode).toBe(200);
//         });
//     });
// });

// describe("POST /signup ", () => {
//     test('test expected status code for sign up route', () => {
//         return request(app)
//         .post('/signin')
//         .then((response) => {
//             expect(response.statusCode).toBe(201);
//         });
//     });
// });

// describe("GET /signout ", () => {
//     test('This route should lead to the sign out page', () => {
//         return request(app)
//         .get('/signout')
//         .then((response) => {
//             expect(response.statusCode).toBe(401);
//         });
//     });
// }); 
