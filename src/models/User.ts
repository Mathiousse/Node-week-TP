export class User {
    id: number;
    username: string;
    hashedPassword: string;
    role: string;
    constructor(id: number, username: string, password: string, role: string) {
        this.id = id;
        this.username = username;
        this.hashedPassword = password;
        this.role = role;
    }
}
