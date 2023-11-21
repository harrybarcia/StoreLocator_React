// ESM

// OR

// CJS
const { faker } = require('@faker-js/faker');

 function createRandomUser() {
  return {
    address: faker.location.street(),
    location: {
      type: 'Point',
      coordinates: [faker.location.longitude(), faker.location.latitude()],
    },
    coordinates: [faker.location.longitude(), faker.location.latitude()],
    
    formattedAddress: faker.location.streetAddress(),
    createdAt: new Date(),
    image: faker.image.url(),
    userId: faker.phone.number(),
    city: faker.location.city(),
    price: faker.finance.amount(0, 10000, 2),
    rating: faker.finance.amount(0, 6, 2),
    reviews: [],
    skipGeocoding: faker.datatype.boolean(),
    fields: [],
    typeObject: [],
  };
}

 const USERS = faker.helpers.multiple(createRandomUser, {
  count: 5,
});

console.log(USERS)


