exports.tryCatch = (controller) => async (req, res) => {
  try {
    await controller(req, res);
  } catch (error) {
    console.log(error);
  }
};
