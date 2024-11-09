import { AppRepository } from "../repository/app.repository";

export class AppService {
  private appRepository = new AppRepository();

  async healthCheck() {
    return await this.appRepository.healthCheck();
  }
}
