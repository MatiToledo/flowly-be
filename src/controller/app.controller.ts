import { Request, Response } from "express";
import { AppService } from "../service/app.service";
import { responseHandler } from "../lib/common/response-handler";

export class AppController {
  private appService = new AppService();

  healthCheck = async (req: Request, res: Response) => {
    try {
      const response = await this.appService.healthCheck();
      res.status(201).json(responseHandler(true, "SUCCESS", response));
    } catch (error) {
      console.error(error);
      res.status(400).send(responseHandler(false, error.message, error));
    }
  };
}
