import * as https from "https";

export class Service {
    async makeRequest(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            https.get(url, response => {
                response.on("data", data => resolve(JSON.parse(data)));
                response.on("error", reject);
            })
        })
    }

    async getPlanets(url: string) {
        const result = await this.makeRequest(url);

        return {
            name: result.name,
            surfaceWater: result.surface_water,
            appearedIn: result.films.length,
        }
    }
}
