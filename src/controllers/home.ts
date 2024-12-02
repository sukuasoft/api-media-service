import { Request, Response } from "express";
import { ApiResponse } from "../types/apiResponse";

function GET(request: Request, response: Response<ApiResponse>) {
  response.status(200).json({
    success: true,
    message: "Server running...",
  });
}

const homeController = {
  GET,
};

export default homeController;
