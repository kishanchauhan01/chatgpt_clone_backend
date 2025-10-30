export class ApiResponse {
  constructor(statusCode, message, data = null, success = true) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }
}
