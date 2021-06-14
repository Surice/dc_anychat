export class Config {
    prefix: string;
    owner: string;
    activity?: Activity;

    constructor(configData: any) {
        this.prefix = configData.prefix;
        this.owner = configData.owner;
    }
}

class Activity {
    type: number;
    name: string;

    constructor(configData: any) {
        this.type = configData.activity.type;
        this.name = configData.activity.name;
    }
}