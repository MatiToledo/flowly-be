import { App } from "../model";

export class AppRepository {
  async healthCheck() {
    try {
      return "Health check ok";
    } catch (error) {
      console.log(error);
      throw new Error("ERROR_IN_HEALTH_CHECK");
    }
  }
}
