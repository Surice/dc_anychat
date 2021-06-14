export interface Config {
    prefix: string;
    owner: string;
    activity?: Activity;
}

class Activity {
    type: number;
    name: string;

    constructor(configData: any) {
        this.type = configData.activity.type;
        this.name = configData.activity.name;
    }
}