const request = require("supertest");
const db = require("../database/dbConfig");
const server = require("./server.js");

beforeEach(async () => {
  await db("users").truncate();
  await db("users").insert({ username: "sam", password: "supersecret" });
});

describe("users model", () => {
  describe("insert()", () => {
    it("should insert the provided users into the db", async () => {
      await db("users").insert({ username: "frodo", password: "supersecret" });
      await db("users").insert({ username: "gandalf", password: "supersecret" });

      const users = await db("users");

      expect(users).toHaveLength(3);
    });

    describe("list()", () => {
      it("should get all users", async () => {
        const users = await db("users");

        expect(users).toHaveLength(1);
      });
    });
  });
});

describe("server.js", () => {
  describe("index route", () => {
    it("should return an OK status code from the index route", async () => {
      const expectedStatusCode = 200;

      const response = await request(server).get("/");

      expect(response.status).toEqual(expectedStatusCode);
    });

    it("should return a JSON object from the index route", async () => {
      const expectedBody = { api: "running" };

      const response = await request(server).get("/");

      expect(response.body).toEqual(expectedBody);
    });

    it("should return a JSON object from the index route", async () => {
      const response = await request(server).get("/");

      expect(response.type).toEqual("application/json");
    });
  });
});

describe("auth-router.js", () => {
  describe("auth route", () => {
    it("should return an Created status code from the auth/register route", async () => {
      const expectedStatusCode = 201;

      const response = await request(server).post("/api/auth/register").send({username: "frodo", password: "supersecret" });

      expect(response.status).toEqual(expectedStatusCode);
    });

    it("should return a JSON object from the auth/register route", async () => {

      const response = await request(server).post("/api/auth/register").send({username: "bilbo", password: "supersecret" });

      expect(response.type).toEqual("application/json")
    });

    it("should return an OK status code from the auth/login route", async () => {
      const expectedStatusCode = 200;
      
      const res = await request(server).post("/api/auth/register").send({username: "frodo", password: "supersecret" });
      const response = await request(server).post("/api/auth/login").send({username: "frodo", password: "supersecret" });
      console.log(response);
      expect(response.status).toEqual(expectedStatusCode);
    });

    it("should return a JSON object from the auth/login route", async () => {

      const response = await request(server).post("/api/auth/login").send({username: "sam", password: "supersecret" });

      expect(response.type).toEqual("application/json")
    });
  });
});

describe("jokes-router.js", () => {
  describe("jokes route", () => {
    it("should return an OK status code from the jokes route", async () => {
      const expectedStatusCode = 200;

      const res = await request(server).post("/api/auth/register").send({username: "frodo", password: "supersecret" });
      const response1 = await (request(server).post("/api/auth/login")).send({username: "frodo", password: "supersecret" });
      const token = response1.body.token
      const response = await (request(server).get("/api/jokes")).set({ Authorization: token });

      expect(response.status).toEqual(expectedStatusCode);
    });

    it("should return a JSON object from the jokes route", async () => {

      const res = await request(server).post("/api/auth/register").send({username: "frodo", password: "supersecret" });
      const response1 = await (request(server).post("/api/auth/login")).send({username: "frodo", password: "supersecret" });
      const token = response1.body.token
      const response = await (request(server).get("/api/jokes")).set({ Authorization: token });

      expect(response.type).toEqual("application/json")
    });
  });
});
