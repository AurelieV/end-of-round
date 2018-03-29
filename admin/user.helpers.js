function timeout() {
  return new Promise((resolve) => setTimeout(resolve, 2000))
}

class UserHelper {
  constructor(app) {
    this.app = app
  }

  async list() {
    const list = await this.app.auth().listUsers(1000)
    return list.users
  }

  async deleteAll(users) {
    if (users.length <= 10) {
      return Promise.all(
        users.map((user) => this.app.auth().deleteUser(user.uid))
      )
    } else {
      await Promise.all(
        users.slice(0, 9).map((user) => this.app.auth().deleteUser(user.uid))
      )
      await timeout()
      return this.deleteAll(users.slice(9))
    }
  }
}

module.exports = UserHelper
