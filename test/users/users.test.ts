import supertest from "supertest";
import { expect } from "chai";
import shortid from "shortid";
import mongoose from "mongoose";

import app from "../../app";

let firstUserIdTest = "";
const firstUserBody = {
  email: `test${shortid.generate()}@gmail.com`,
  password: "Sup3rSecret!23",
};

let accessToken = "";
let refreshToken = "";
const newFirstName = "User";
const newFirstName2 = "User1";
const newLastName2 = "Last";

describe("users and auth endpoints", function () {
  let request: supertest.SuperAgentTest;
  before(function () {
    request = supertest.agent(app);
  });
  after(function (done) {
    app.close(() => {
      mongoose.connection.close(done);
    });
  });

  it("should allow a POST to /users", async function () {
    const res = await request.post(`${process.env.BASE_URL}/users`).send(firstUserBody);

    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an("object");
    expect(res.body.id).to.be.an("string");
    firstUserIdTest = res.body.id;
  });

  it("should allow a POST to /auth", async function () {
    const res = await request.post(`${process.env.BASE_URL}/auth`).send(firstUserBody);
    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an("object");
    expect(res.body.accessToken).to.be.a("string");
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it("should allow a GET from /users/:userId with an access token", async function () {
    const res = await request
      .get(`${process.env.BASE_URL}/users/${firstUserIdTest}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an("object");
    expect(res.body._id).to.be.a("string");
    expect(res.body._id).to.equal(firstUserIdTest);
    expect(res.body.email).to.equal(firstUserBody.email);
  });

  describe("with a valid access token", async function () {
    it("should allow a GET from /users", async function () {
      const res = await request
        .get(`${process.env.BASE_URL}/users`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send();
      expect(res.status).to.equal(403);
    });

    it("should disallow a PATCH to /users/:userId", async function () {
      const res = await request
        .patch(`${process.env.BASE_URL}/users/${firstUserIdTest}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({
          firstName: newFirstName,
        });
      expect(res.status).to.equal(403);
    });

    it("should disallow a PUT to /users/:userId with an nonexistant ID", async function () {
      const res = await request
        .put(`${process.env.BASE_URL}/users/i-do-not-exist`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({
          email: firstUserBody.email,
          password: firstUserBody.password,
          firstName: "Marcos",
          lastName: "Silva",
          permissionLevel: 256,
        });
      expect(res.status).to.equal(404);
    });

    it("should disallow a PUT to /users/:userId trying to change the permission level", async function () {
      const res = await request
        .put(`${process.env.BASE_URL}/users/${firstUserIdTest}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({
          email: firstUserBody.email,
          password: firstUserBody.password,
          firstName: "Marcos",
          lastName: "Silva",
          permissionLevel: 256,
        });
      expect(res.status).to.equal(403);
      expect(res.body.errors).to.be.an("array");
      expect(res.body.errors).to.have.length(1);
      expect(res.body.errors[0]).to.equal(
        "User cannot change permission level"
      );
    });

    it("should allow a PUT to /users/:userId/permissionLevel/2 for testing", async function () {
      const res = await request
        .put(`${process.env.BASE_URL}/users/${firstUserIdTest}/permissionLevel/2`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({});
      expect(res.status).to.equal(204);
    });

    describe("with a new permission level", async function () {
      it("should allow a POST to /auth/refresh-token", async function () {
        const res = await request
          .post(`${process.env.BASE_URL}/auth/refresh-token`)
          .set({ Authorization: `Bearer ${accessToken}` })
          .send({ refreshToken });
        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an("object");
        expect(res.body.accessToken).to.be.a("string");
        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
      });

      it("should allow a PUT to /users/:userId to change first and last names", async function () {
        const res = await request
          .put(`${process.env.BASE_URL}/users/${firstUserIdTest}`)
          .set({ Authorization: `Bearer ${accessToken}` })
          .send({
            email: firstUserBody.email,
            password: firstUserBody.password,
            firstName: newFirstName2,
            lastName: newLastName2,
            permissionLevel: 2,
          });
        expect(res.status).to.equal(204);
      });

      it("should allow a GET from /users/:userId and should have a new full name", async function () {
        const res = await request
          .get(`${process.env.BASE_URL}/users/${firstUserIdTest}`)
          .set({ Authorization: `Bearer ${accessToken}` })
          .send();
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an("object");
        expect(res.body._id).to.be.a("string");
        expect(res.body.firstName).to.equal(newFirstName2);
        expect(res.body.lastName).to.equal(newLastName2);
        expect(res.body.email).to.equal(firstUserBody.email);
        expect(res.body._id).to.equal(firstUserIdTest);
      });

      it("should allow a DELETE from /users/:userId", async function () {
        const res = await request
          .delete(`${process.env.BASE_URL}/users/${firstUserIdTest}`)
          .set({ Authorization: `Bearer ${accessToken}` })
          .send();
        expect(res.status).to.equal(204);
      });
    });
  });
});
