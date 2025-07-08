jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

const mockedAxios = require("axios");
import { getProjects, saveProject, getProjectById, deleteProject } from "../projectService";

describe("projectService", () => {
  const API_URL = `${process.env.REACT_APP_API_URL}/projects`;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("getProjects", () => {
    it("faz GET para /projects com token e filtros", async () => {
      localStorage.setItem("token", "abc");
      mockedAxios.get.mockResolvedValueOnce({ data: [1, 2, 3] });
      const result = await getProjects({ status: "active" });
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_URL}?status=active`,
        { headers: { Authorization: "Bearer abc" } }
      );
      expect(result).toEqual([1, 2, 3]);
    });
    it("faz GET para /projects sem filtros", async () => {
      localStorage.setItem("token", "abc");
      mockedAxios.get.mockResolvedValueOnce({ data: [1] });
      const result = await getProjects();
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_URL}`,
        { headers: { Authorization: "Bearer abc" } }
      );
      expect(result).toEqual([1]);
    });
  });

  describe("saveProject", () => {
    it("faz POST para /projects ao criar", async () => {
      localStorage.setItem("token", "abc");
      mockedAxios.post.mockResolvedValueOnce({ data: { id: 1 } });
      const result = await saveProject({ name: "P1" });
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}`,
        { name: "P1" },
        { headers: { Authorization: "Bearer abc" } }
      );
      expect(result).toEqual({ id: 1 });
    });
    it("faz PUT para /projects/:id ao editar", async () => {
      localStorage.setItem("token", "abc");
      mockedAxios.put.mockResolvedValueOnce({ data: { id: 2 } });
      const result = await saveProject({ name: "P2" }, "2");
      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${API_URL}/2`,
        { name: "P2" },
        { headers: { Authorization: "Bearer abc" } }
      );
      expect(result).toEqual({ id: 2 });
    });
  });

  describe("getProjectById", () => {
    it("faz GET para /projects/:id", async () => {
      localStorage.setItem("token", "abc");
      mockedAxios.get.mockResolvedValueOnce({ data: { id: 3 } });
      const result = await getProjectById("3");
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_URL}/3`,
        { headers: { Authorization: "Bearer abc" } }
      );
      expect(result).toEqual({ id: 3 });
    });
  });

  describe("deleteProject", () => {
    it("faz DELETE para /projects/:id", async () => {
      localStorage.setItem("token", "abc");
      mockedAxios.delete.mockResolvedValueOnce({ data: { ok: true } });
      const result = await deleteProject("4");
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `${API_URL}/4`,
        { headers: { Authorization: "Bearer abc" } }
      );
      expect(result).toEqual({ ok: true });
    });
  });
}); 