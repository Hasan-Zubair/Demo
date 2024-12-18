const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
      
    const errorMessages = [];
    if(typeof data.message === "object"){
    for (const key in data.message) {
        errorMessages.push(`${key}: ${data.message.title[0]}`);
    }
  }

  if(typeof data.message === "array"){
    for (const key in data.message[0]) {
      if (data.message[0][key] && data.message[0][key].length > 0) {
        errorMessages.push(`${key}: ${data.message[0][key][0]}`);
      }
    }
  }

    for (const key in data.message[0]) {
      if (data.message[0][key] && data.message[0][key].length > 0) {
        errorMessages.push(`${key}: ${data.message[0][key][0]}`);
      }
    }

    const errorMessageString = errorMessages.join(" & ");
		console.log("TCL:errorMessageString", errorMessageString);
    return errorMessageString;
  } else if (error.request) {
    console.log(error);
    console.log("API Error: No response received");
    return "API Error: No response received"; // Return an appropriate message
  } else {
    console.log(error);
    console.log("API Error: Request setup error", error.message);
    return `API Error: Request setup error - ${error.message}`;
  }
};

export default handleApiError;
