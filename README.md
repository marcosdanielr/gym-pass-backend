# App

GymPass style app.

## FN (functional requirement)

- [x] Must be able to sign up;
- [x] Must be able to authenticate;
- [x] Must be able to get the profile of the logged in user;
- [ ] Must be able to get the check-ins numbers by logged in user;
- [x] Must be able the user get your history of check-ins;
- [ ] Must be able search for gyms near the user;
- [ ] Must be able the user search gyms by name;
- [x] Must be able the user perform check-ins in a gym;
- [ ] Must be able validate the check-in of an user;
- [x] Must be able sign up a gym.

## BN (business rule)

- [x] The user must not be able sign up with an duplicate email;
- [x] The user must not be able perform 2 check-ins in same day;
- [x] The user must not be able check-in if not 100 meters near the gym;
- [ ] The check-in must be validate within 20 minutes created;
- [ ] The check-in must be validate by administrators only;
- [ ] The gym must be to sign up by administrators only.

## NFR (non-functional requirement)

- [x] The user password must be encrypted;
- [x] The application data must be persisted in a PostgreSQL database;
- [x] All data list must be paginated with 20 items per page;
- [ ] The user must be identificated by a JWT (JSON Web Token).
