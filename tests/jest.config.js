module.exports = {
  testEnvironment: 'node',
  verbose: true,
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest",
    "^.+\\.(js?)$": "babel-jest"
  },
  testPathIgnorePatterns: ['node_modules', '\\.cache', '<rootDir>.*/public'],
  transformIgnorePatterns: [ '/node_modules/(?!(@babel\/runtime|gatsby))', 'node_modules/(?!(gatsby)/)' ],
};
/*
module.exports = async () => {
  return {
    verbose: true,
  };
};
*/
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
