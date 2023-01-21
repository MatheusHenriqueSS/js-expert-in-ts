export class User {
    name: string;
    id: number;
    profession: string;
    birthDay: number;
    constructor({id, name, profession, age}) {
        this.name = name;
        this.id = parseInt(id);
        this.profession = profession;
        this.birthDay = new Date().getFullYear() - age;
    }
}