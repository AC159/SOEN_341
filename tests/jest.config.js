module.exports = {
  testEnvironment: 'node',
  verbose: true,
  preset: 'ts-jest',
  //verbose: true,
  transform: {
   '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest",
  }
};

// Or async function
module.exports = async () => {
  return {
    verbose: true,
  };
};
/*
module.exports = {
    testEnvironment: 'node',
    preset: 'ts-jest',
    //verbose: true,
    transform: {
      '^.+\\.(ts|tsx)?$': 'ts-jest',
      "^.+\\.(js|jsx)$": "babel-jest",
    }
};//https://mongoosejs.com/docs/jest.html

module.exports = {
  verbose: true,
};
  
module.exports = async () => {
  return {
    verbose: true,
  };
};

module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest",
  }
};
*/
