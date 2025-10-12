const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@shared': path.resolve(__dirname, 'src/shared'),
            '@features': path.resolve(__dirname, 'src/features'),
            '@app': path.resolve(__dirname, 'src/app'),
            '@config': path.resolve(__dirname, 'src/config'),
        },
    },
    jest: {
        configure: {
            moduleNameMapping: {
                '^@/(.*)$': '<rootDir>/src/$1',
                '^@shared/(.*)$': '<rootDir>/src/shared/$1',
                '^@features/(.*)$': '<rootDir>/src/features/$1',
                '^@app/(.*)$': '<rootDir>/src/app/$1',
                '^@config/(.*)$': '<rootDir>/src/config/$1',
            },
        },
    },
};

