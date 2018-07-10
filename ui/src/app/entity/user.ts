export class User {
    id: number;
    username: string;

    static fromObject(data: Object): User {
        if (data == null) {
            return null;
        }
        let u = new User();
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                u[key] = data[key];
            }
        }
        return u;
    }
}
