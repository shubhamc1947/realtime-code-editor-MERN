# CollabCode (MERN)

https://github.com/user-attachments/assets/8bd27627-7bfc-44af-ba29-b282b8c06e8a

CollabCode is a real-time collaborative coding platform where multiple users can write, edit, and share code simultaneously. Perfect for pair programming, technical interviews, teaching coding concepts, or collaborating with team members remotely.

## Quick Start

**Demo Accounts:**
- Email: chrome@gmail.com | Password: 1234
- Email: firefox@gmail.com | Password: 1234

**How to use:**
1. Log in with one of the demo accounts
2. Create a new room or join an existing one with the room ID
3. Share the room ID with others to collaborate
4. Start coding together in real-time!

## Features

- **Real-Time Collaboration**: Multiple users can edit the code simultaneously, with changes reflected in real-time.
- **Syntax Highlighting**: Supports syntax highlighting for multiple programming languages using CodeMirror.
- **Authentication**: Secure user authentication with JWT.
- **Room Management**: Users can create or join rooms using a room ID.
- **Multi-Tab Support**: Create multiple code tabs to organize your work.
- **Language Selection**: Switch between different programming languages.
- **Theme Options**: Choose from various editor themes for comfortable coding.

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
