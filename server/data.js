const data = {
  users: [
    {
      name: "Yousuf Islam",
      email: "user1@gmail.com",
      password: "1qasw2!@Q",
    },
    {
      name: "Alex Panda",
      email: "user2@gmail.com",
      password: "1qasw2!@Q",
    },
  ],
};

const taskData = {
  tasks: [
    {
      title: "Make a presentation related to 6G",
      tag: "Team Leader",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      deadline: new Date("2023-09-22 00:00:00"),
      status: 0,
      createdByTask: "38e7a987-2eab-49ef-a083-a485a9bea3ac",
      createdToTask: "9c8b82cb-54f3-4eda-b655-c70fe6c6b6a3",
    },
    {
      title: "Make a user bio data for university",
      tag: "Team Assistant",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis a ante dolor in reprehenderit in voluptate velit esse cill i  consequat",
      deadline: new Date("2023-09-25 00:00:00"),
      status: 0,
      createdByTask: "38e7a987-2eab-49ef-a083-a485a9bea3ac",
      createdToTask: "ed5b6a0d-16bc-4933-9281-49ada3c3bcac",
      // comment: [
      //   {
      //     userId: "34c48084-2b30-41b0-bf11-93831rz4j1bc9",
      //     message: "Lorem ipsum dolor sit amet, consectetur.",
      //   },
      //   {
      //     userId: "34c48084-2b30-41b0-bf11-93831rz4j1bc9",
      //     message:
      //       "Lorem ipsum dolor sit amet, consectetur. Lorem Ips but tristique sen",
      //   },
      // ],
    },
  ],
};

module.exports = { data, taskData };
