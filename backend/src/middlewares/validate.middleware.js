import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    // Zod will parse it and if invalid then it thorw the error
    schema.parse(req.body);
    next();
  } catch (error) {
    let errors;

    if (error instanceof ZodError) {
      errors = error._zod.def.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      console.log(errors);
    } else {
      errors = [{ field: "unknown", message: "Invlaid error" }];
    }

    return res
      .status(400)
      .json({ success: false, message: "validation failed", errors });
  }
};
