# CollabCode (MERN)

https://github.com/user-attachments/assets/8bd27627-7bfc-44af-ba29-b282b8c06e8a



Welcome to the Real-Time Code Editor project! This application allows multiple users to collaborate on coding in real-time. Built using the MERN stack (MongoDB, Express, React, Node.js) and WebSockets, it provides a seamless experience for code sharing and editing.

## Features

- **Real-Time Collaboration**: Multiple users can edit the code simultaneously, with changes reflected in real-time.
- **Syntax Highlighting**: Supports syntax highlighting for multiple programming languages using CodeMirror.
- **Authentication**: Secure user authentication with JWT.
- **Room Management**: Users can create or join rooms using a room ID.

## Installation

1. **Clone the Repository**

    ```bash
    git clone https://github.com/shubhamc1947/realtime-code-editor-MERN.git
    cd realtime-code-editor-MERN
    ```

2. **Install Dependencies**

    For the server:

    ```bash
    cd api
    npm install
    ```

    For the client:

    ```bash
    npm install
    ```

3. **Set Up Environment Variables**

    Create a `.env` file in the `api` directory and add your environment variables:

    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4. **Run the Application**

    Start the server:

    ```bash
    cd api
    npm start
    ```

    Start the client:

    ```bash
    npm run dev
    ```

    The application should now be running on `http://localhost:5173`.

## Usage

1. **Create or Join a Room**

    Users can create a new room or join an existing room by entering a room ID.

2. **Collaborate**

    Once inside the room, users can start editing the code. The changes will be synchronized in real-time across all users in the room.


## Technologies Used

- **Frontend**: React, CodeMirror
- **Backend**: Node.js, Express, MongoDB
- **Real-Time Communication**: WebSockets (Socket.io)
- **Authentication**: JWT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs, improvements, or new features.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please contact:

- **Name**: Shubham Chaturvedi
- **Email**: shubhamchat224122@gmail.com

## Acknowledgements

Special thanks to all contributors and users of this project.

---

Thank you for using the Real-Time Code Editor! Happy coding!


