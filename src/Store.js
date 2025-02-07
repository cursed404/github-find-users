import { makeAutoObservable } from "mobx";

class GithubStore {
  username = "";
  repos = [];
  loading = false;
  error = "";

  constructor() {
    makeAutoObservable(this);
  }

  setUsername(name) {
    this.username = name;
    this.repos = [];
    this.error = "";
    this.fetchRepos();
  }

  async fetchRepos() {
    if (!this.username) return;

    this.loading = true;
    try {
      const response = await fetch(`https://api.github.com/users/${this.username}/repos`);
      if (!response.ok) throw new Error("Пользователь не найден");

      const data = await response.json();
      this.repos = data;
    } catch (err) {
      this.error = "Ошибка";
    } finally {
      this.loading = false;
    }
  }
}

export default new GithubStore();
