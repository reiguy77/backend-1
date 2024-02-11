exports.MissingParameters = (res, funcName, params ) => {
    let missingParams = "";
    Object.entries(params).forEach(([paramName, paramValue]) => {
        if (paramValue == null) {
            console.log(paramName)
          missingParams += `${paramName} | `;
        }
      });
    res.status(400).send({ message: `Missing required parameter(s) in ${funcName}: ${missingParams}`, errors: true });
}